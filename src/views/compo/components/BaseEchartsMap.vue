<template>
  <div ref="map" style="width: 100%;height: 100%;"></div>
</template>

<script>
import "../../../../node_modules/echarts/map/js/china.js";
export default {
  name: "BaseEchartsMap",
  data() {
    return {
      baseOption: {
        // backgroundColor: "#013954",
        geo: {
          map: "china",
          zoom: 1.2,
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true, // 是否允许缩放
          itemStyle: {
            normal: {
              color: "rgba(51, 69, 89, .5)", // 地图背景色
              borderColor: "#516a89", // 省市边界线00fcff 516a89
              borderWidth: 1
            },
            emphasis: {
              color: "rgba(37, 43, 61, .5)" // 悬浮背景
            }
          }
        },
        series: []
      },
      chart: null
    };
  },
  mounted() {
    this.chart = this.$echarts.init(this.$refs.map);
    this.renderMap();
  },
  methods: {
    updateComponent() {
      this.renderMap();
    },
    renderMap() {
      console.log(1);
      if (this.chart) {
        this.chart.dispose();
        this.chart = this.$echarts.init(this.$refs.map);
      }
      this.chart.setOption(this.baseOption);
      this.chart.resize();
    }
  }
};
</script>

<style scoped></style>
