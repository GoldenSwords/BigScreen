<template>
  <div
    style="display:block;width: 100%;height: 100%;position: relative;display: flex;font-size: 0;"
  >
    <div
      v-show="contextMenuDisplay"
      class="contextMenu"
      :style="{
        left: `${left}px`,
        top: `${top}px`
      }"
    >
      右键菜单
    </div>
    <div class="left">
      <div>左侧菜单</div>
    </div>
    <div
      v-show="inputDisplay"
      class="input"
      style="position: absolute;transform: translateX(-50%) translateY(-50%);"
      :style="{
        left: `${ileft}px`,
        top: `${itop}px`
      }"
    >
      <el-input
        ref="input"
        placeholder="请输入内容"
        v-model="input"
        size="mini"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          size="mini"
          @click="confirmText"
        ></el-button>
      </el-input>
    </div>
    <div
      class="text"
      v-for="(item, index) in textData"
      :key="index"
      :style="{
        left: `${item.x}px`,
        top: `${item.y}px`
      }"
      @mouseover="over(item)"
    >
      {{ item.text }}
    </div>
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>

<script>
import BesselUtil from "@/plugins/canvasPlugins/BesselUtil";
export default {
  data() {
    return {
      textData: [],
      inputDisplay: false,
      input: "",
      position: {},
      util: null,
      ileft: 0,
      itop: 0,
      left: 0,
      top: 0,
      contextMenuDisplay: false,
      option: {
        lineStyle: "black",
        lineStyleActive: "orange",
        circleRadius: 4,
        clickRange: 10,
        circleRadiusActive: 6,
        circleFillStyle: "orange",
        circleStrokeStyle: "black",
        circleActiveFillStyle: "yellow",
        circleActiveStrokeStyle: "orange",
        changeTarget: (index, option) => {
          console.log(this, this.textData);
          const point = this.textData.find(i => i._index === index)
          if (point) {
            point.x = option.center.x
            point.y = option.center.y
          }
        },
        inputAction: (point, opt) => {
          console.log(this);
          this.inputDisplay = true;
          this.ileft = point.x;
          this.itop = point.y;
          this.position = opt;
        },
        clickAction: () => {
          this.contextMenuDisplay = false;
        },
        contextMenuAction: point => {
          this.contextMenuDisplay = true;
          this.left = point.x;
          this.top = point.y;
        }
      }
    };
  },
  mounted() {
    this.util = BesselUtil.instance(this.$refs.canvas, this.option, this);
  },
  beforeDestroy() {
    if (this.util) {
      this.util.destory();
    }
  },
  methods: {
    over(p) {
      this.util.setMousePoint(p);
    },
    confirmText() {
      this.textData.push({
        x: this.position.center.x,
        y: this.position.center.y,
        text: this.input,
        _index: this.position.index
      });
      this.inputDisplay = false;
    }
  }
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
