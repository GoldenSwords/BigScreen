<template>
  <div style="width: 100%;height: 100%">
    <template v-if="option.drag">
      <canvas ref="canvas" v-drag></canvas>
    </template>
    <template v-else>
      <canvas ref="canvas"></canvas>
    </template>
  </div>
</template>

<script>
export default {
  name: "EcComp",
  props: {
    option: Object
  },
  mounted() {
    this.initCanvas();
  },
  data() {
    return {
      timer: null,
      ctx: null,
      temp: 1000,
      tempM: 0
    };
  },
  watch: {
    option(val) {
      console.log(val);
      this.resize();
    }
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timer);
  },
  methods: {
    resize() {
      cancelAnimationFrame(this.timer);
      this.initCanvas();
    },
    initCanvas() {
      this.$refs.canvas.width = this.$refs.canvas.clientWidth;
      this.$refs.canvas.height = this.$refs.canvas.clientHeight;
      this.ctx = this.$refs.canvas.getContext("2d");
      this.animation();
    },
    randomColor() {
      return (
        "rgb(" +
        [
          Math.ceil(Math.random() * 255),
          Math.ceil(Math.random() * 255),
          Math.ceil(Math.random() * 255)
        ].join(",") +
        ")"
      );
    },
    randomPoint() {
      const arr = [];
      for (let i = 0; i < Number(this.option.size); i++) {
        arr.push({
          x: Math.ceil(this.ctx.canvas.width * Math.random()),
          y: Math.ceil(this.ctx.canvas.height * Math.random())
        });
      }
      return arr;
    },
    animation() {
      if (new Date().getTime() - this.tempM >= this.temp) {
        this.tempM = new Date().getTime();
        this.$refs.canvas.width = this.$refs.canvas.clientWidth;
        this.$refs.canvas.height = this.$refs.canvas.clientHeight;
        this.ctx.clearRect(
          0,
          0,
          this.ctx.canvas.width,
          this.ctx.canvas.clientHeight
        );
        this.draw();
      }
      this.timer = requestAnimationFrame(() => {
        this.animation();
      });
    },
    draw() {
      const pt = this.randomPoint();
      pt.forEach(p => {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        this.ctx.fillStyle = this.randomColor();
        this.ctx.fill();
      });
    }
  }
};
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
