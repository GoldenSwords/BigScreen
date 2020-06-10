<template>
  <div
    style="display:block;width: 100%;height: 100%;position: relative;display: flex;font-size: 0;"
  >
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
import { Tool } from "@/plugins/canvasPlugins/FlowLines";
export default {
  data() {
    return {};
  },
  mounted() {
    this.util = Tool.instance(this.$refs.canvas, this.option, this);
  },
  beforeDestroy() {
    if (this.util) {
      this.util.destory();
    }
  },
  methods: {}
};
</script>

<style scoped>
.contextMenu {
  position: absolute;
  font-size: 14px;
}
.canvas {
  display: inline-block;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  box-shadow: 0 0 2px black;
  border-radius: 5px;
}
.left {
  position: absolute;
  width: 100px;
  font-size: 14px;
  box-shadow: 0 0 2px black;
  margin: 2px;
  border-radius: 5px;
}
.text {
  user-select: none;
  cursor: pointer;
  position: absolute;
  left: 0;
  top: 0;
  padding: 2px;
  font-size: 12px;
  border-radius: 4px;
  box-shadow: 0 0 2px black;
  background-color: #fff;
  transform: translateX(-50%) translateY(-50%);
}
</style>
