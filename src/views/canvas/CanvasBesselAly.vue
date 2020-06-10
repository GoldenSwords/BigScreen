<template>
  <canvas ref="canvas" style="display:block;width: 100%;height: 100%;"></canvas>
</template>
<script>
export default {
  data() {
    return {
      canvas: null,
      activeBtn: "",
      ctx: null,
      timer: null,
      dragging: false,
      border: 4,
      btns: {
        a: {
          x: 10,
          y: 10
        },
        b: {
          x: 10,
          y: 10
        },
        c: {
          x: 10,
          y: 10
        },
        d: {
          x: 10,
          y: 10
        }
      }
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    dragging(val) {
      if (val) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "default";
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      cancelAnimationFrame(this.timer);
    }
  },
  methods: {
    init() {
      this.canvas = this.$refs.canvas;
      this.ctx = this.$refs.canvas.getContext("2d");
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      this.toggleBtn();
      this.timer = requestAnimationFrame(this.painting);
    },
    arc(x, y) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.border, 0, (360 * Math.PI) / 180);
      this.ctx.fillStyle = "orange";
      this.ctx.fill();
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();
    },
    arcAll() {
      this.paintLine();
      this.guideLine();
      this.arc(this.btns.a.x, this.btns.a.y);
      this.arc(this.btns.b.x, this.btns.b.y);
      this.arc(this.btns.c.x, this.btns.c.y);
      this.arc(this.btns.d.x, this.btns.d.y);
    },
    painting() {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.arcAll();
      this.timer = requestAnimationFrame(this.painting);
    },
    guideLine() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.btns.a.x, this.btns.a.y);
      this.ctx.lineTo(this.btns.b.x, this.btns.b.y);
      this.ctx.moveTo(this.btns.c.x, this.btns.c.y);
      this.ctx.lineTo(this.btns.d.x, this.btns.d.y);
      this.ctx.strokeStyle = "yellow";
      this.ctx.stroke();
    },
    paintLine() {
      this.ctx.beginPath();
      this.ctx.moveTo(this.btns.a.x, this.btns.a.y);
      this.ctx.bezierCurveTo(
        this.btns.b.x,
        this.btns.b.y,
        this.btns.c.x,
        this.btns.c.y,
        this.btns.d.x,
        this.btns.d.y
      );
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();
    },
    pickBtn(ev) {
      const arr = ["a", "b", "c", "d"];
      for (let i = 0; i < arr.length; i++) {
        this.ctx.beginPath();
        this.ctx.arc(
          this.btns[arr[i]].x,
          this.btns[arr[i]].y,
          this.border,
          0,
          2 * Math.PI
        );
        if (this.ctx.isPointInPath(ev.offsetX, ev.offsetY)) {
          this.dragging = true;
          return arr[i];
        }
      }
    },
    // 触发按钮点击
    toggleBtn() {
      this.canvas.addEventListener("mousedown", this.down);
      this.canvas.addEventListener("mousemove", this.dragBtn);
      this.canvas.addEventListener("mouseup", () => {
        this.dragging = false;
        this.activeBtn = "";
      });
    },
    down(ev) {
      const btn = this.pickBtn(ev);
      if (btn) {
        this.activeBtn = btn;
      }
    },
    // 触发按钮拖拽
    dragBtn(ev) {
      const btn = this.pickBtn(ev);
      if (btn) {
        this.dragging = true;
      } else {
        this.dragging = false;
      }
      if (this.activeBtn) {
        this.btns[this.activeBtn].x = ev.offsetX;
        this.btns[this.activeBtn].y = ev.offsetY;
      }
    }
  }
};
</script>

<style scoped></style>
