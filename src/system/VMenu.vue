<template>
  <div class="sidebar">
    <div class="sidebar-right">
      <div class="sidebar-right-box">
        <div class="sidebar-title">{{ activeRoot[config.text] }}</div>
        <template v-for="(item, idx) in activeMenu">
          <v-menu-item :data="item" :key="idx" :config="config"></v-menu-item>
        </template>
      </div>
    </div>
    <div class="sidebar-left" style="background-color: #fff;">
      <i
        :class="toggle ? active : diasbled"
        style="font-size: 30px;line-height: 60px;"
        @click="toggle = !toggle"
      ></i>
      <div
        class="sidebar-button"
        :class="idx === activeIndex ? 'active' : ''"
        v-for="(item, idx) in data"
        :key="idx"
        @click="doActive(idx)"
      >
        <template v-if="item.icon && item.icon.indexOf('iconfont-') !== -1">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="`${item.icon.replace('iconfont-', '')}`"></use>
          </svg>
        </template>
        <template v-else>
          <i :class="item.icon"></i>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import VMenuItem from "./VMenuItem";
export default {
  name: "VMenu",
  components: { VMenuItem },
  props: {
    data: Array
  },
  data() {
    return {
      toggle: false,
      active: "el-icon-s-fold",
      diasbled: "el-icon-s-unfold",
      config: {
        text: "menuName",
        children: "children",
        icon: "icon"
      },
      activeIndex: 0,
      activeRoot: {},
      activeMenu: []
    };
  },
  watch: {
    toggle(val) {
      this.$emit("toggle", val);
    },
    data() {
      if (this.data.length > 0) {
        this.activeRoot = this.data[0];
        this.activeMenu = this.data[0][this.config.children];
      }
    }
  },
  beforeMount() {
    if (this.data.length > 0) {
      this.activeRoot = this.data[this.activeIndex];
      this.activeMenu = this.data[this.activeIndex][this.config.children];
    }
  },
  methods: {
    doActive(index) {
      this.activeIndex = index;
      this.activeRoot = this.data[index];
      this.activeMenu = this.data[index].children;
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 100%;
  height: 100%;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.sidebar-button {
  font-size: 30px;
  line-height: 60px;
  cursor: pointer;
}
.sidebar-title {
  overflow: hidden; /*内容超出后隐藏*/
  text-overflow: ellipsis; /* 超出内容显示为省略号*/
  white-space: nowrap; /*文本不进行换行*/
  padding: 20px;
  color: rgb(29, 111, 255);
  font-size: 20px;
  font-weight: bold;
  line-height: 40px;
}
.sidebar-left {
  border-right: 1px solid rgb(246, 246, 246);
  width: 60px;
  height: 100%;
  position: relative;
  left: 0;
  top: 0;
  text-align: center;
}
.sidebar-right {
  overflow: auto;
  /*padding: 0 0 0 20px;*/
  transition: 1s;
  width: calc(100% - 60px);
  height: 100%;
  position: absolute;
  top: 0;
  left: 60px;
  text-align: left;
}
/*滚动条整体样式*/
.sidebar-right::-webkit-scrollbar {
  width: 3px;
  height: 1px;
}
/*滚动条滑块*/
.sidebar-right::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
/*滚动条轨道*/
.sidebar-right::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
  border-radius: 10px;
  background: #ccc;
}
.active {
  background-color: rgb(230, 235, 243);
  color: #fff;
}
.icon {
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
