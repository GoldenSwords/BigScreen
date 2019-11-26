<template>
  <div
    class="panel"
    style="position: absolute;"
    :style="{
      left:
        opt.config.moveOption !== undefined
          ? opt.config.moveOption.x + 'px'
          : 0,
      top:
        opt.config.moveOption !== undefined
          ? opt.config.moveOption.y + 'px'
          : 0,
      width:
        opt.config.moveOption !== undefined
          ? opt.config.moveOption.width + 'px'
          : 0,
      height:
        opt.config.moveOption !== undefined
          ? opt.config.moveOption.height + 'px'
          : 0,
      backgroundColor:
        opt.config.moveOption !== undefined ? opt.config.moveOption.color : ''
    }"
  >
    <div
      ref="clickDom"
      style="width: 100%;height: 100%;position: absolute;z-index: 1;"
      class="mask"
      @click="manageScreen(opt)"
      @contextmenu="contextmenu"
    ></div>
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
          v-for="item in compoTemplateData"
          :key="item.id"
          @click.stop="addPanel(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </span>
    <div
      v-if="activeComponent.comp"
      style="width: 100%;height: 100%;z-index: 11;position: absolute;"
    >
      <div
        ref="clickDomIner"
        style="width: 100%;height: 100%;position: absolute;z-index: 1;"
        class="mask"
        @click="manageScreenOb(opt)"
        @contextmenu="contextmenu"
      ></div>
      <component :is="activeComponent.comp" :opt="activeComponent"></component>
    </div>
  </div>
</template>

<script>
import { generateUUID, registComponent } from "@/plugins/util/util";
import {
  getCompoTempList,
  componentsTemplateDetail,
  getComponentConfigTemplateDetail
} from "@/api/baseCompo";
export default {
  name: "BasePanel",
  props: {
    opt: Object
  },
  data() {
    return {
      left: 0,
      top: 0,
      sliderShow: false,
      activeComponent: {
        comp: null,
        config: null
      },
      compoTemplateData: []
    };
  },
  mounted() {
    console.log("BasePanel", JSON.stringify(this.opt));
    this.getList();
  },
  methods: {
    getList() {
      getCompoTempList().then(resp => {
        this.compoTemplateData = resp.data.msg;
      });
    },
    silent() {
      this.sliderShow = false;
    },
    manageScreenOb(item) {
      this.silent();
      item.target = this;
      this.$emit("onmanage", item);
    },
    manageScreen(item) {
      this.silent();
      item.target = this;
      this.$emit("onmanage", item);
    },
    contextmenuIner(e) {
      this.$emit("silent");
      if (e.target !== this.$refs.clickDomIner) {
        return;
      }
      this.left = e.layerX;
      this.top = e.layerY;
      this.sliderShow = true;
      return false;
    },
    contextmenu(e) {
      this.$emit("silent");
      if (e.target !== this.$refs.clickDom) {
        return;
      }
      this.left = e.layerX;
      this.top = e.layerY;
      this.sliderShow = true;
      return false;
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
    addPanel(item) {
      componentsTemplateDetail(JSON.stringify(item)).then(resp => {
        if (resp.config) {
          getComponentConfigTemplateDetail(
            JSON.stringify(resp.data.msg.config.configId)
          ).then(data => {
            registComponent(item.code, item.component).then(result => {
              this.activeComponent = {
                name: resp.data.msg.code,
                comp: result.default,
                config: this.formatterKeyValue(data.data.msg),
                configRoot: data.data.msg,
                _uuid: generateUUID()
              };
            });
          });
        }
      });
    }
  }
};
</script>

<style scoped>
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
