<template>
  <div ref="bar" style="width: 100%;height: 100%;"></div>
</template>

<script>
// import echarts from 'echarts'
export default {
  name: "bar",
  data() {
    return {
      time: 0,
      speed: 1000,
      chart: null,
      chartData: [],
      option: {
        title: {
          text: "动态数据 + 时间坐标轴"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " : " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    this.time = new Date().getTime();
    this.chart = this.$echarts.init(this.$refs.bar);
    this.chart.setOption(this.option);
    this.initChart();
  },
  methods: {
    initChart() {
      if (new Date().getTime() - this.time > this.speed) {
        this.time = new Date().getTime();
        this.chartData.push(this.randomData());
        this.chart.setOption({
          series: [
            {
              data: this.chartData,
              type: "line",
              smooth: true
            }
          ]
        });
      }
      window.requestAnimationFrame(this.initChart);
    },
    randomData() {
      // var now = +new Date(1997, 9, 3)
      // var oneDay = 24 * 3600 * 1000
      var value = Math.random() * 1000;
      // now = new Date(+now + oneDay)
      value = value + Math.random() * 21 - 10;
      return {
        name: new Date().getMilliseconds(),
        value: [new Date().getTime(), Math.round(value)]
      };
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.initChart);
    this.chart.dispose();
    this.chartData.splice(0, this.chartData.length);
  }
};
</script>

<style scoped></style>
