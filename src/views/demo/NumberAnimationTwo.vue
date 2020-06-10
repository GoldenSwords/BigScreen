<template>
  <ul ref="box" :style="{}">
    <li
      v-for="(item, index) in dataNumbers"
      :key="index"
      :style="{
        '--angel': (360 / dataNumbers.length) * index + currentAngle + 'deg',
        lineHeight: height * 2 + 'px',
        fontSize: height * 2 + 'px'
      }"
    >
      {{ item }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "NumberAnimationTwo",
  data() {
    return {
      height: 0,
      speed: 1,
      targetNumber: 2,
      currentAngle: 0,
      circleCount: 3,
      angelMax: 0,
      dataNumbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      instanceId: null
    };
  },
  mounted() {
    this.height = this.$refs.box.clientHeight;
    this.angelMax =
      this.circleCount * 360 +
      this.dataNumbers.findIndex(item => {
        return item === this.targetNumber;
      }) *
        (360 / this.dataNumbers.length);
    this.animation();
  },
  computed: {},
  methods: {
    zAngel(val) {
      const angel = val % 360;
      let z = 0;
      // if ((angel > 90 && angel <= 180) || (angel > 270 && angel <= 360)) {
      //   z = ((90 - (angel % 90)) / 90) * (this.height * 2);
      // } else {
      //   z = ((angel % 90) / 90) * (this.height * 2);
      // }
      if (angel >= 0 && angel < 90) {
        z = (angel / 90) * -(this.height / 2);
      } else if (angel >= 90 && angel < 180) {
        z = -(this.height / 2) - ((angel - 90) / 90) * (this.height / 2);
      } else if (angel >= 180 && angel < 270) {
        z = -this.height + ((angel - 180) / 90) * (this.height / 2);
      } else {
        z = -(this.height / 2) + ((angel - 270) / 90) * (this.height / 2);
      }
      return -z;
    },
    animation() {
      if (this.currentAngle >= this.angelMax) {
        window.cancelAnimationFrame(this.instanceId);
        return;
      }
      this.currentAngle += this.speed;
      this.instanceId = window.requestAnimationFrame(() => {
        this.animation();
      });
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.instanceId);
  }
};
</script>

<style scoped>
:root {
  --angel: 0deg;
  --top: 0px;
  --z: 0px;
}
ul {
  perspective: 600px;
  transform-style: preserve-3d;
  transform-origin: center;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  text-align: center;
}
ul::-webkit-scrollbar {
  display: none;
}
ul li {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
  height: 100%;
  transform: rotateX(var(--angel)) translateZ(-1200px);
  backface-visibility: hidden;
}
</style>
