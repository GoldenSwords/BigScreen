<template>
  <div ref="root">
    <div
      class="slider-bar"
      @click="toggle"
      :class="
        data[config.children]
          ? 'slider-big'
          : activeIndex
          ? 'slider-normal active '
          : 'slider-normal'
      "
    >
      <router-link :to="getPath(data)" tag="div">
        <i v-if="data[config.icon]" :class="data[config.icon]"></i
        >{{ data[config.text] }}
        <i
          v-if="data[config.children]"
          :class="active ? expandClass : ''"
          class="pin el-icon-arrow-down"
        ></i>
      </router-link>
    </div>
    <div v-if="active">
      <template v-for="(item, idx) in data[config.children]">
        <v-menu-item :data="item" :key="idx" :config="config"></v-menu-item>
      </template>
    </div>
  </div>
</template>

<script>
import event from "@/plugins/event";
export default {
  name: "VMenuItem",
  props: {
    data: Object,
    config: Object
  },
  data() {
    return {
      active: false,
      activeIndex: false,
      expandClass: "rotateDown"
    };
  },
  beforeMount() {
    event.$on("slider-select", dom => {
      if (dom !== this.$refs.root) {
        this.activeIndex = false;
      }
    });
  },
  methods: {
    getPath(item) {
      return item.hasOwnProperty("path") ? item.path : "/";
    },
    toggle() {
      if (!this.data[this.config.children]) {
        this.activeIndex = true;
        event.$emit("slider-select", this.$refs.root);
      }
      this.active = !this.active;
    }
  }
};
</script>

<style scoped>
.slider-bar {
  padding: 0 0 0 20px;
  cursor: pointer;
}
.pin {
  transition: 200ms;
}
.slider-big {
  font-size: 18px;
  line-height: 40px;
  font-weight: bold;
}
.slider-normal {
  font-size: 14px;
  line-height: 40px;
  font-weight: normal;
}
.rotateDown {
  transform: rotate(180deg);
}
.active {
  background-color: rgb(247, 247, 247);
}
</style>
