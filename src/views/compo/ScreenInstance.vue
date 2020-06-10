<template>
  <el-container style="width: 100%;height: 100%;">
    <el-main style="width: 100%;height: 100%;">
      <div
        class="LScroll"
        ref="main"
        style="width: 100%;height: 100%;position: relative;"
      >
        <div
          style="width: 100%;height: 100%;position: absolute;"
          :style="{
            width: configDataInstance.Option.width + 'px',
            height: configDataInstance.Option.height + 'px',
            backgroundColor: configDataInstance.Option.color,
            transform:
              'scale(' + rootWidth / configDataInstance.Option.width + ')',
            transformOrigin: '0 0'
          }"
        >
          <div
            ref="root"
            class="pageBox"
            style="width: 100%;height: 100%;"
            @click="rootClick"
            @contextmenu.prevent="showAddPanelBox"
          >
            <span
              v-show="sliderShow"
              class="panelBorder"
              @click="sliderShow = false"
              style="position: absolute;z-index: 10;"
              :style="{
                left: position.x + 'px',
                top: position.y + 'px'
              }"
            >
              <ul class="panelBox">
                <li v-for="item in sliderData" :key="item.id">
                  <div
                    v-for="(ite, idx) in item"
                    :key="idx + '_qtx'"
                    @click.stop.prevent="sliderClick(ite)"
                  >
                    {{ ite.name }}
                  </div>
                </li>
              </ul>
            </span>
            <template v-for="item in activeComponents">
              <component-view
                ref="comps"
                :comp="item.compInstance"
                :obj="item.obj"
                :option="item.option"
                :optionformat="doFormatKeyOption(item.option)"
                :uuid="item._uuid"
                :key="item._uuid"
                @clickCallback="compClick"
                @contextmenuCallback="showAddPanelBox"
              >
              </component-view>
            </template>
          </div>
        </div>
      </div>
    </el-main>
    <el-aside style="width: 20%;" class="LScroll">
      <config-view @callback="callback"></config-view>
    </el-aside>
  </el-container>
</template>

<script>
import event from "@/plugins/event";
import {
  generateUUID,
  registerComp,
  formatKeyOption
} from "@/plugins/util/util";
import {
  getCompoTempList,
  getComponentConfigTemplateDetail
  // componentsTemplateDetail
  // componentsTemplateDetail,
  // getComponentConfigTemplateDetail
} from "@/api/baseCompo";
import ComponentView from "@/views/compo/components/ComponetView";
import ConfigView from "@/views/compo/components/ConfigView";
export default {
  name: "ScreenInstance",
  components: { ComponentView, ConfigView },
  data() {
    return {
      targetComp: null,
      rootWidth: 0,
      drawer: false, //管理项面板
      activeTarget: null,
      position: {
        //菜单位置
        x: 0,
        y: 0
      },
      configDataInstance: {
        Option: {
          width: 0,
          height: 0,
          color: ""
        }
      },
      configData: {}, // 基础配置项
      silentEvent: false,
      sliderShow: false, //右键菜单
      sliderData: [],
      operationData: [
        [
          { id: 0, name: "置顶" },
          { id: 1, name: "置底" },
          { id: 2, name: "上移一层" },
          { id: 3, name: "下移一层" }
        ],
        [
          { id: 4, name: "删除" },
          { id: 5, name: "复制" }
        ]
      ],
      panelTemplateData: [], //模板列表
      activeComponents: [], // 激活的组件
      registComponentList: [], //注册的组件列表
      activeConfigs: [] //当前激活组件的配置项
    };
  },
  watch: {},
  beforeMount() {
    this.getData();
  },
  mounted() {
    this.rootWidth = this.$refs.main.clientWidth;
  },
  methods: {
    doFormatKeyOption(keys) {
      const obj = {};
      if (keys) {
        for (let i = 0; i < keys.length; i++) {
          const data = formatKeyOption(JSON.parse(JSON.stringify(keys[i])));
          Object.keys(data).forEach(item => {
            obj[item] = data[item];
          });
        }
      }
      return obj;
    },
    callback(val, uuid) {
      console.log(uuid);
      const has = val.find(item => {
        return item.id === 0;
      });
      if (has) {
        this.configDataInstance = formatKeyOption(has);
      } else {
        const obj = this.activeComponents.find(item => {
          return item._uuid === uuid;
        });
        obj.option = val;
        obj.optionformat = this.doFormatKeyOption(val);
      }
    },
    sliderClick(item) {
      this.silent();
      this.addComponent(item);
    },
    //添加组件
    addComponent(item) {
      const compObj = this.registComponentList.find(comp => {
        return comp.name === item.code;
      });
      const dataObj = this.panelTemplateData.find(data => {
        return data.code === item.code;
      });
      getComponentConfigTemplateDetail(JSON.stringify(dataObj.id)).then(
        resp => {
          const uuid = generateUUID();
          this.activeComponents.push({
            option: resp.data.msg,
            obj: JSON.parse(JSON.stringify(dataObj)),
            compInstance: compObj.comp,
            _uuid: uuid
          });
          event.$emit(
            "updateConfig",
            undefined,
            this.configData,
            undefined,
            "root"
          );
        }
      );
    },
    //初始化组件数据
    getData() {
      getComponentConfigTemplateDetail("0").then(resp => {
        this.configData = resp.data.msg;
        const obj = {};
        for (let i = 0; i < this.configData.length; i++) {
          const data = formatKeyOption(
            JSON.parse(JSON.stringify(this.configData[i]))
          );
          Object.keys(data).forEach(item => {
            obj[item] = data[item];
          });
        }
        this.configDataInstance = obj;
        event.$emit(
          "updateConfig",
          undefined,
          this.configData,
          undefined,
          "root"
        );
      });
      getCompoTempList().then(resp => {
        this.panelTemplateData = resp.data.msg;
        this.sliderData = [resp.data.msg];
        this.panelTemplateData.forEach(item => {
          registerComp(item.code, item.component, result => {
            //TODO 追加配置项 扩展项
            this.registComponentList.push({
              name: item.code,
              comp: result.default,
              config: "",
              plugin: ""
            });
          });
        });
      });
    },
    //右键面板
    showAddPanelBox(e, option, activeTarget) {
      this.activeTarget = activeTarget;
      this.silent();
      this.position.x = e.offsetX;
      this.position.y = e.offsetY;
      if (!activeTarget) {
        this.sliderData = [this.panelTemplateData];
      } else {
        this.sliderData = this.operationData;
      }
      this.sliderShow = true;
      return false;
    },
    //显示管理项
    showManage() {
      this.drawer = true;
    },
    compClick(e, option, activeTarget) {
      this.activeTarget = activeTarget;
      const qt = this.activeComponents.find(item => {
        return item.compInstance === activeTarget;
      });
      this.silent();
      event.$emit("updateConfig", qt.obj.id, option, qt._uuid, "compo");
      return false;
    },
    rootClick(e) {
      this.activeTarget = null;
      this.silent(e);
      this.drawer = true;
      getComponentConfigTemplateDetail("0").then(resp => {
        this.configData = resp.data.msg;
        const obj = {};
        for (let i = 0; i < this.configData.length; i++) {
          const data = formatKeyOption(
            JSON.parse(JSON.stringify(this.configData[i]))
          );
          Object.keys(data).forEach(item => {
            obj[item] = data[item];
          });
        }
        this.configDataInstance = obj;
        event.$emit(
          "updateConfig",
          undefined,
          this.configData,
          undefined,
          "root"
        );
      });
      return false;
    },
    //关闭组件选择
    silent() {
      this.sliderShow = false;
    }
  }
};
</script>

<style scoped>
.pageBox {
  position: relative;
  /*background-color: rgb(5, 5, 39);*/
  background-image: linear-gradient(
      90deg,
      rgba(180, 180, 180, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 20px 20px;
}
.panelBorder {
  background-color: rgb(48, 54, 64);
  padding: 5px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  width: 80px;
}
.panelBox {
  list-style: none;
  margin: 0;
  padding: 0;
}
.panelBox li {
  padding: 0 5px;
}
.panelBox li {
  cursor: pointer;
  border-top: 2px solid rgb(58, 70, 89);
}
.panelBox li div:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.panelBox li:first-child {
  border-top: 0;
}
</style>
