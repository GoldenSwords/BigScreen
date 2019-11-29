<template>
  <div style="width: 100%;height: 100%;background-color: #050d42;">
    <div
      v-for="(item, index) in number"
      :key="index"
      :style="{
        width: 'calc(100% / ' + number.length + ')',
        height: '100%',
        float: 'left'
      }"
    >
      <div
        style="margin: 10px;width: calc(100% - 20px);height: calc(100% - 20px)"
      >
        <number-animation
          :animationTime="1000"
          :circleCount="numberCount[index]"
          :targetNumber="item"
          :color="'rgba(255,255,0,1)'"
        ></number-animation>
      </div>
    </div>
  </div>
</template>

<script>
import NumberAnimation from "@/views/demo/NumberAnimation";
export default {
  name: "NumberAnimationBox",
  components: {
    NumberAnimation
  },
  data() {
    return {
      tempNumber: [],
      number: [1, 3, 2, 5, 1, 1, 5],
      numberCount: [],
      dataLength: 7
    };
  },
  mounted() {
    setInterval(() => {
      const qda = [];
      for (let i = 0; i < this.dataLength; i++) {
        qda.push(Math.round(Math.random() * 9));
      }

      this.number.splice(0, this.number.length, ...qda);
      this.initConfig();
    }, 10000);
  },
  beforeMount() {
    this.initConfig();
  },
  methods: {
    initConfig() {
      let count = 0;
      let numberCount = [];
      if (this.tempNumber.length !== 0) {
        numberCount = new Array(this.number.length);
        numberCount.fill(0);
      } else {
        this.number.forEach(item => {
          numberCount.push(count);
          count = item + count * 10;
        });
      }
      this.numberCount.splice(0, this.numberCount.length, ...numberCount);
      this.tempNumber = JSON.parse(JSON.stringify(this.number));
    }
  }
};
</script>

<style scoped></style>
