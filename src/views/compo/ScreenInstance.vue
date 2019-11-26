<template>
  <el-container style="width: 100%;height: 100%;">
    <el-main style="width: 100%;height: 100%;">
      <div style="width: 100%;height: 100%;position: relative;">
        <div
          ref="clickDom"
          class="pageBox"
          style="width: 100%;height: 100%;"
          @click="manageScreen"
          @contextmenu.prevent="contextmenu"
        >
          <span
            v-show="sliderShow"
            class="panelBorder"
            @click="sliderShow = false"
            style="position: absolute;z-index: 10;"
            :style="{
              left: left + 'px',
              top: top + 'px'
            }"
          >
            <ul class="panelBox">
              <li
                v-for="item in panelTemplateData"
                :key="item.id"
                @click="addPanel(item)"
              >
                {{ item.name }}
              </li>
            </ul>
          </span>
          <template v-for="item in activeComponents">
            <component
              ref="comps"
              :is="item.comp"
              :opt="item"
              :key="item._uuid"
              @silent="silent"
              @onmanage="manage"
            ></component>
          </template>
        </div>
        <div
          v-show="drawer"
          style="width: 260px;height: 100%;position: absolute;right: 0;top: 0;z-index: 50;    background-color: rgba(0, 0, 0,.2);color: #fff;border-left: 2px solid rgba(255,255,255,.2);"
        >
          <h1>{{ configData.name }}</h1>
          <template v-for="item in activeConfigs">
            <el-row :key="item._uuid">
              <el-col :span="12" style="text-align: right;padding: 0 10px;">
                {{ item.obj.name }}
              </el-col>
              <el-col :span="12">
                <component
                  :is="item.comp"
                  :value="item.obj.model"
                  :obj="item"
                  @callback="configCallback"
                ></component>
              </el-col>
            </el-row>
          </template>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { generateUUID, registComponent } from "@/plugins/util/util";
import {
  getPanelTemplateList,
  componentsTemplateDetail,
  getComponentConfigTemplateDetail
} from "@/api/baseCompo";
export default {
  name: "ScreenInstance",
  components: {},
  data() {
    return {
      configData: {},
      drawer: false,
      top: 0,
      left: 0,
      silentEvent: false,
      sliderShow: false,
      panelTemplateData: [],
      compoTemplateData: [],
      activeComponents: [],
      activeConfigs: []
    };
  },
  watch: {
    configData(val) {
      this.activeConfigs.splice(0, this.activeConfigs.length);
      if (val && val.configRoot.child) {
        for (let i = 0; i < val.configRoot.child.length; i++) {
          this.regist(
            val.configRoot.child[i].code,
            val.configRoot.child[i].component,
            val.configRoot.child[i]
          );
        }
      }
    }
  },
  beforeMount() {
    this.getData();
  },
  methods: {
    configCallback(val, obj) {
      let actives = null;
      this.activeConfigs.forEach(item => {
        if (item === obj) {
          item.obj.model = val;
          actives = item;
        }
      });
      this.activeComponents.forEach(item => {
        if (item === this.configData) {
          console.log(
            this.configData.configRoot.key,
            item.config[this.configData.configRoot.key]
          );
          item.config[this.configData.configRoot.key][actives.obj.key] =
            actives.obj.model;
          // console.log(item, this.configData, actives);
        }
      });
    },
    regist(name, component, obj) {
      registComponent(name, component).then(resp => {
        this.activeConfigs.push({
          name: name,
          obj: obj,
          comp: resp.default,
          _uuid: generateUUID()
        });
      });
    },
    addPanel(item) {
      componentsTemplateDetail(JSON.stringify(item)).then(resp => {
        if (resp.config) {
          getComponentConfigTemplateDetail(
            JSON.stringify(resp.data.msg.config.configId)
          ).then(data => {
            registComponent(item.code, item.component).then(result => {
              this.activeComponents.push({
                name: resp.data.msg.code,
                comp: result.default,
                config: this.formatterKeyValue(data.data.msg),
                configRoot: data.data.msg,
                _uuid: generateUUID()
              });
            });
          });
        }
      });
    },
    formatterKeyValue(config) {
      const result = {};
      const column = "key";
      const keys = "model";
      if (config.child) {
        config.child.forEach(item => {
          result[item[column]] = item[keys];
        });
        const data = {};
        data[config[column]] = result;
        return data;
      }
      return {};
    },
    getData() {
      getPanelTemplateList().then(resp => {
        this.panelTemplateData = resp.data.msg;
      });
    },
    // 大屏配置
    manageScreen(e) {
      if (this.configData.name && e.target !== this.$refs.clickDom) {
        this.drawer = true;
      } else {
        this.drawer = false;
      }
      this.silent();
    },
    //    添加面板
    contextmenu(e) {
      if (e.target !== this.$refs.clickDom) {
        return;
      }
      this.silent();
      this.left = e.layerX;
      this.top = e.layerY;
      this.sliderShow = true;
    },
    manage(item) {
      console.log(item);
      this.configData = item;
      this.drawer = true;
    },
    silent() {
      this.sliderShow = false;
      if (this.$refs.comps) {
        this.$refs.comps.forEach(item => {
          item.silent();
        });
      }
    }
  }
};
</script>

<style scoped>
.pageBox {
  position: relative;
  background-color: rgb(5, 5, 39);
  background-image: linear-gradient(
      90deg,
      rgba(180, 180, 180, 0.15) 10%,
      rgba(0, 0, 0, 0) 10%
    ),
    linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 20px 20px;
}
.panelBorder {
  background-color: rgb(4, 4, 4);
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
  border-top: 1px solid #6f6f6f;
}
.panelBox li:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.panelBox li:first-child {
  border-top: 0;
}
</style>
