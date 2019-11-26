<template>
  <canvas ref="canvas" style="display:block;width: 100%;height: 100%;"></canvas>
</template>

<script>
import curveTxt from "@/plugins/canvasPlugins/curveTxt";
// import pluginsGP2 from '@/plugins/canvasPlugins/pluginsGP2'
export default {
  name: "CanvasDemo",
  data() {
    return {
      curveTxt: null,
      plugins: null,
      option: {
        timer: 0,
        timer2: 0,
        addGroundTime: 1000,
        addGroundTime2: 10000,
        deepMaxAngle: 30, // 最大深度转角
        deep: 300,
        font: 10,
        groundSpeed: 1,
        groundLineSpeed: 15,
        lineWidthSeed: 10,
        gridLineNumber: 10,
        tempLineNumber: 1,
        groundDiamondStatus: false,
        groundDiamondTimer: 0,
        groundDiamondTime: 1000,
        groundDiamondWidth: 0,
        groundGridNumberx: 30,
        groundGridTimer: 5000,
        groundGridNumber: 50,
        groundGridTemp: [],
        groundGridNumbery: 20,
        groundGridNumberRadius: 4,
        groundGridLine: [],
        groundCircleExpand: [],
        groundCircleAnimationFlag: false,
        groundCircleAnimationTemp: 30,
        groundCircleAnimationSpeed: 10,
        groundCircleAnimationTime: 20000,
        groundCircleAnimationTimer: 0,
        groundCircleLineRadius: 0.5,
        groundCircleCenterRadius: 0.4,
        gorundCircleText: "",
        gorundCircleTextFont: 40,
        gorundCircleTextColor: "rgb(255,255,255)",
        groundCircleCenterPoint: [],
        tempLine: [], // 流线
        panelPointColor: [51, 255, 51],
        panelPointSpeed: 4,
        panelPointWidth: 5,
        panelData: [
          {
            name: "新一代天气雷达",
            value: "323784",
            side: "left",
            x: 0.05,
            y: 0.3,
            h: 0.58,
            tx: 0.47,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "风廓线雷达",
            value: "323784",
            side: "left",
            x: 0.11,
            y: 0.28,
            h: 0.6,
            tx: 0.43,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "大气成分",
            value: "323784",
            side: "left",
            x: 0.14,
            y: 0.25,
            h: 0.62,
            tx: 0.43,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "雷电监测",
            value: "323784",
            side: "left",
            x: 0.19,
            y: 0.21,
            h: 0.64,
            tx: 0.43,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "地面气象观测",
            value: "323784",
            side: "left",
            x: 0.24,
            y: 0.18,
            h: 0.66,
            tx: 0.43,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "高空气象观测",
            value: "323784",
            side: "left",
            x: 0.29,
            y: 0.15,
            h: 0.68,
            tx: 0.43,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "GBSS/MET",
            value: "323784",
            side: "left",
            x: 0.33,
            y: 0.13,
            h: 0.7,
            tx: 0.43,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "自动土壤水分",
            value: "323784",
            side: "left",
            x: 0.38,
            y: 0.1,
            h: 0.72,
            tx: 0.43,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "XX中心",
            value: "323784",
            side: "right",
            x: 0.92,
            y: 0.28,
            h: 0.6,
            tx: 0.61,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "XX中心",
            value: "323784",
            side: "right",
            x: 0.87,
            y: 0.27,
            h: 0.64,
            tx: 0.61,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "XX中心",
            value: "323784",
            side: "right",
            x: 0.82,
            y: 0.22,
            h: 0.66,
            tx: 0.61,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "XX中心",
            value: "323784",
            side: "right",
            x: 0.76,
            y: 0.18,
            h: 0.68,
            tx: 0.61,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },
          {
            name: "XX中心",
            value: "323784",
            side: "right",
            x: 0.71,
            y: 0.13,
            h: 0.72,
            tx: 0.61,
            color: { r: 0, g: 143, b: 255, a: 0.8 },
            animation: { speed: 3, temp: 0 }
          },

          {
            name: "L2",
            value: "323784",
            side: "bottom",
            x: 0.43,
            y: 0.44,
            h: 0.4,
            tx: 0.1,
            color: { r: 51, g: 255, b: 51, a: 0.8 },
            point: { radius: 4, color: [51, 255, 51, 0.8] }
          },
          {
            name: "L3",
            value: "323784",
            side: "bottom",
            x: 0.46,
            y: 0.42,
            h: 0.33,
            tx: 0.2,
            color: { r: 51, g: 255, b: 51, a: 0.8 },
            point: { radius: 4, color: [51, 255, 51, 0.8] }
          },
          {
            name: "L4",
            value: "323784",
            side: "bottom",
            x: 0.5,
            y: 0.41,
            h: 0.2,
            tx: 0.5,
            color: { r: 51, g: 255, b: 51, a: 0.8 },
            point: { radius: 4, color: [51, 255, 51, 0.8] }
          },
          {
            name: "L5",
            value: "323784",
            side: "bottom",
            x: 0.54,
            y: 0.42,
            h: 0.33,
            tx: 0.8,
            color: { r: 51, g: 255, b: 51, a: 0.8 },
            point: { radius: 4, color: [51, 255, 51, 0.8] }
          },
          {
            name: "L6",
            value: "323784",
            side: "bottom",
            x: 0.57,
            y: 0.44,
            h: 0.4,
            tx: 0.9,
            color: { r: 51, g: 255, b: 51, a: 0.8 },
            point: { radius: 4, color: [51, 255, 51, 0.8] }
          }
        ],
        // 面板
        panelLines: []
      },
      CurveOptions: {
        linesDataConfig: {
          // 线条队列
          temp: [],
          // 一些基础配置
          config: {
            speed: 1, // 移动速率
            lineWidth: 3,
            depart: 20, // 文字间距
            color: [
              [28, 34, 67, 1],
              [18, 53, 98, 1],
              [66, 214, 231, 1],
              [97, 151, 181, 1]
            ] // 线条色彩
          }
        }
      },
      liensSet: [
        [
          [
            { x: 0.316, y: 0.833 },
            { x: 0.35, y: 0.666 },
            { x: 0.35, y: 0.666 },
            { x: 0.483, y: 0.2 },
            { x: 0.73, y: 0.16 }
          ],
          [
            { x: 0.25, y: 0.833 },
            { x: 0.266, y: 0.666 },
            { x: 0.35, y: 0.33 },
            { x: 0.416, y: 0.2 },
            { x: 0.6, y: 0.133 }
          ]
        ],
        [
          [
            { x: 0.516, y: 0.833 },
            { x: 0.55, y: 0.666 },
            { x: 0.35, y: 0.666 },
            { x: 0.483, y: 0.2 },
            { x: 0.73, y: 0.16 }
          ],
          [
            { x: 0.55, y: 0.833 },
            { x: 0.566, y: 0.666 },
            { x: 0.35, y: 0.33 },
            { x: 0.416, y: 0.2 },
            { x: 0.6, y: 0.133 }
          ]
        ]
      ],
      ops: {
        linesData: [
          {
            tempText: [
              "1",
              "1",
              "0",
              "0",
              "1",
              "1",
              "0",
              "1",
              "0",
              "0",
              "1",
              "1",
              "1",
              "0",
              "0",
              "1",
              "1",
              "0",
              "1",
              "0",
              "0",
              "1",
              "1",
              "1",
              "0",
              "0",
              "1",
              "1",
              "0",
              "1",
              "0",
              "0",
              "1"
            ], // 绘制的文本
            font: 12, // 文本字号
            value: [
              // {x: 0.66, y: 0.7}, {x: 0.6, y: 0.48}, {x: 0.35, y: 0.166}, {x: 0.483, y: 0.18}, {x: 0.15, y: 0.14}
              { x: 0.316, y: 0.833 },
              { x: 0.35, y: 0.666 },
              { x: 0.35, y: 0.666 },
              { x: 0.483, y: 0.2 },
              { x: 0.73, y: 0.16 } // 数据收集
            ] // 贝塞尔点位
          },
          {
            tempText: ["1", "1", "0", "0", "1", "1", "0", "1", "0", "0", "1"], // 绘制的文本
            font: 14, // 文本字号
            value: [
              // {x: 0.62, y: 0.8}, {x: 0.48, y: 0.48}, {x: 0.35, y: 0.166}, {x: 0.283, y: 0.18}, {x: 0.01, y: 0.14}
              { x: 0.25, y: 0.833 },
              { x: 0.266, y: 0.666 },
              { x: 0.35, y: 0.33 },
              { x: 0.416, y: 0.2 },
              { x: 0.6, y: 0.133 } // 数据收集
            ]
          }
        ]
      }
    };
  },
  mounted() {
    this.curveTxt = curveTxt.instance(
      this.$refs.canvas,
      this.CurveOptions,
      this.ops
    );
    // this.plugins = pluginsGP2.instance(this.$refs.canvas, this.option)
    // this.plugins.init()
    this.curveTxt.init(this.$refs.canvas, this.CurveOptions, this.ops);
    setTimeout(() => {
      for (let i = 0; i < this.ops.linesData.length; i++) {
        this.ops.linesData[i].value = this.liensSet[1][i];
        this.$set(this.ops.linesData, i, this.ops.linesData[i]);
      }
      this.curveTxt.reDraw(this.$refs.canvas, this.CurveOptions, this.ops);
    }, 3000);
  }
};
</script>

<style scoped></style>
