<template>
  <div ref="box" class="box">
    <div class="mask"></div>
    <div
      ref="scrollBar"
      class="innerbox"
      :style="{
        lineHeight: height + 'px',
        fontSize: height + 'px',
        textAlign: 'center'
      }"
    >
      <div
        class="inner"
        v-for="(item, index) in numberData"
        :key="index"
        :style="{
          backgroundImage: textColor
        }"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NumberAnimation",
  props: {
    circleCount: Number,
    targetNumber: Number,
    animationTime: Number,
    color: {
      type: String,
      default: "black"
    }
  },
  data() {
    return {
      // animationTime: 5000,
      // circleCount: 2, // 旋转圈数
      // targetNumber: 2, // 最后显示数字
      scrollBar: null, // 滚动轴
      startHeight: 0,
      scrollHeight: 0, // 滚动计算值
      time: -1, // 计时器
      numberData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
      numberHeight: [], // 对应数字高度
      height: 0, // 数字盒子高度
      instanceId: 0, // 定时器ID
      maxHeight: 0, // 当前滚动最大高度 自动计算
      targetNumberIndex: 0 // 选中数字下标 自动计算
    };
  },
  watch: {
    circleCount() {
      console.log(1);
      this.initConfig();
    },
    targetNumber() {
      console.log(2);
      this.initConfig();
    }
  },
  computed: {
    textColor: function() {
      return "".concat(
        "linear-gradient( rgba(255, 255, 255, 1), ",
        this.color,
        ", rgba(255, 255, 255, 1))"
      );
    }
  },
  mounted() {
    this.initConfig();
  },
  methods: {
    initConfig() {
      this.targetNumberIndex = this.numberData.findIndex(item => {
        return item === this.targetNumber;
      });
      this.scrollBar = this.$refs.scrollBar;
      this.height = this.$refs.box.clientHeight;
      this.numberData.forEach(item => {
        this.numberHeight.push(item * this.height);
      });
      this.maxHeight = (this.numberData.length - 1) * this.height;
      this.scrollHeight =
        this.circleCount * this.maxHeight +
        this.numberHeight[this.targetNumberIndex] -
        this.startHeight;
      this.circleAnimation();
    },
    circleAnimation() {
      if (this.time === -1) {
        this.time = new Date().getTime();
      }
      if (new Date().getTime() - this.time >= this.animationTime) {
        this.scrollBar.scrollTo(0, this.numberHeight[this.targetNumberIndex]);
        window.cancelAnimationFrame(this.instanceId);
        this.time = -1;
        this.startHeight = this.numberHeight[this.targetNumberIndex];
        return;
      }
      let h =
        (((new Date().getTime() - this.time) / this.animationTime) *
          this.scrollHeight +
          this.startHeight) %
        this.maxHeight;
      this.scrollBar.scrollTo(0, h);
      this.instanceId = window.requestAnimationFrame(() => {
        this.circleAnimation();
      });
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.instanceId);
  }
};
</script>

<style scoped>
.box,
.innerbox,
.mask,
.inner {
  width: 100%;
  height: 100%;
  font-family: "Agency FB";
}
.mask {
  position: absolute;
  z-index: 1;
}
.innerbox {
  background-image: linear-gradient(
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.2)
  );
  overflow: auto;
  position: absolute;
  left: 0;
  top: 0;
}
.innerbox::-webkit-scrollbar {
  display: none;
}
.box {
  position: relative;
  border: 1px solid green;
  border-radius: 5px;
}
.inner {
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-fill-color: transparent;
}
</style>
