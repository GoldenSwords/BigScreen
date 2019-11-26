<template>
  <div ref="chart" style="width: 100%;height: 100%;"></div>
</template>

<script>
export default {
  name: "BaseEchartsBar",
  data() {
    return {
      baseOption: {
        backgroundColor: "#013954",
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar"
          }
        ]
      },
      chart: null
    };
  },
  mounted() {
    this.chart = this.$echarts.init(this.$refs.chart);
    this.renderMap();
  },
  methods: {
    renderMap() {
      this.chart.setOption(this.baseOption);
    }
  }
};
</script>

<style scoped></style>
