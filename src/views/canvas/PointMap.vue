<template>
  <div ref="parent" style="width:100%;height:100%;position: relative;">
    <canvas
      ref="canvas"
      style="width:100%;height:100%;position: absolute;left:0;top:0;"
    ></canvas>
    <div
      class="hoverPin"
      v-for="(data, index) in tempConfig.data"
      :key="index"
      style="font-size:12px;width:80px;text-align:center;height:14px;line-height: 14px;position: absolute;display: inline-block;color: #fff;background-color: rgba(0,0,0,0.2);padding: 5px;border-radius: 10%;"
      :style="{
        left: data.x - 45 + 'px',
        top: data.y - 40 + 'px'
      }"
    >
      {{ data.item.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PointMap",
  props: {
    geo: Object,
    bounds: Object
  },
  data() {
    return {
      hoverData: [],
      WIDTH: 0,
      ctx: null,
      HEIGHT: 0,
      instanceID: null,
      config: {
        scale: 1,
        itemStyle: {
          symbol: "circle",
          radius: 3,
          fillStyle: "fill",
          animation: true,
          color: [255, 255, 255]
        },
        showGrid: false,
        // background: "rgb(2, 36, 72)",
        background: ctx => {
          ctx.beginPath();
          ctx.fillStyle = "rgb(0, 20, 47)";
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.beginPath();
          const radius =
            ctx.canvas.width > ctx.canvas.height
              ? ctx.canvas.width / 2
              : ctx.canvas.height / 2;
          const gradient = ctx.createRadialGradient(
            ctx.canvas.width / 2,
            ctx.canvas.height / 2,
            0,
            ctx.canvas.width / 2,
            ctx.canvas.height / 2,
            radius
          );
          gradient.addColorStop(0, "rgba(4, 37, 140,.5)");
          gradient.addColorStop(1, "rgba(0, 20, 47,.5)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        },
        x: 90,
        y: 90,
        // symbol:'rect', // rect circle function
        symbol: "rect",
        symbols: function(ctx) {
          let r = 6;
          const rc = 6;
          ctx.beginPath();
          ctx.fillStyle = "rgb(8, 52, 102)";
          ctx.fillRect(-r / 2, -r / 2, r, r);
          r = rc;
          ctx.beginPath();
          ctx.moveTo(-r / 2, -r / 2);
          ctx.lineTo(-r / 2, r / 2);
          ctx.lineTo(0, 0);
          ctx.fillStyle = "rgb(8, 99, 190)";
          ctx.fill();

          ctx.beginPath();
          ctx.lineTo(-r / 2, r / 2);
          ctx.lineTo(r / 2, r / 2);
          ctx.lineTo(0, 0);
          ctx.fillStyle = "rgb(3, 54, 106)";
          ctx.fill();

          ctx.beginPath();
          ctx.lineTo(r / 2, r / 2);
          ctx.lineTo(r / 2, -r / 2);
          ctx.lineTo(0, 0);
          ctx.fillStyle = "rgb(53, 201, 250)";
          ctx.fill();

          ctx.beginPath();
          ctx.lineTo(r / 2, -r / 2);
          ctx.lineTo(-r / 2, -r / 2);
          ctx.lineTo(0, 0);
          ctx.fillStyle = "rgb(8, 97, 186)";
          ctx.fill();
          ctx.beginPath();
        },
        radius: 2,
        fillStyle: "fill", // fill stroke
        color: "rgb(8, 97, 186)",
        bounds: {
          southwest: [10, 0],
          northeast: [200, 80]
        }
      },
      tempConfig: {
        animationNumber: 0,
        animationSpeed: 0.05,
        animationDistance: 5,
        data: [],
        dataLayer: null,
        tempCanvas: null,
        netGrids: [],
        evnet: {
          hover: false
        }
      }
    };
  },
  watch: {
    "tempConfig.dataLayer"(val) {
      if (val) {
        this.tempConfig.evnet.hover = true;
        this.tempConfig.dataLayer.canvas.addEventListener(
          "mousemove",
          this.dataHoverEvent
        );
      }
    }
  },
  mounted() {
    if (!this.geo) {
      return;
    }
    this.ctx = this.$refs.canvas.getContext("2d");
    this.instance();
    this.addData([
      { lng: 0, lat: 0, name: "北京" },
      { lng: 80, lat: 60, name: "上海" }
    ]);
  },
  methods: {
    HexToRgb(str) {
      const r = /^#?[0-9A-Fa-f]{6}$/;
      // test方法检查在字符串中是否存在一个模式，如果存在则返回true，否则返回false
      if (!r.test(str)) return window.alert("输入错误的hex");
      // replace替换查找的到的字符串
      str = str.replace("#", "");
      // match得到查询数组
      const hxs = str.match(/../g);
      // alert('bf:'+hxs)
      for (let i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);
      // alert(parseInt(80, 16))
      return hxs;
    },
    LngLatToPix(lng, lat) {
      return {
        x:
          ((lng - this.config.bounds.southwest[0]) /
            (this.config.bounds.northeast[0] -
              this.config.bounds.southwest[0])) *
          this.ctx.canvas.width,
        y:
          ((this.config.bounds.northeast[1] - lat) /
            (this.config.bounds.northeast[1] -
              this.config.bounds.southwest[1])) *
          this.ctx.canvas.height
      };
    },
    _initMap() {
      const geo = this.geo;
      let obj = null;
      this.tempConfig.tempCanvas = document
        .createElement("canvas")
        .getContext("2d");
      this.WIDTH = this.tempConfig.tempCanvas.canvas.width = this.ctx.canvas.width =
        this.ctx.canvas.clientWidth * this.config.scale;
      this.HEIGHT = this.tempConfig.tempCanvas.canvas.height = this.ctx.canvas.height =
        this.ctx.canvas.clientHeight * this.config.scale;
      this.tempConfig.tempCanvas.fillStyle = "black";
      if (!this.bounds) {
        this.config.bounds = {
          southwest: [9999, 9999],
          northeast: [-9999, -9999]
        };
        for (let i = 0; i < geo.features.length; i++) {
          obj = geo.features[i];
          for (let k = 0; k < obj.geometry.coordinates.length; k++) {
            for (let j = 0; j < obj.geometry.coordinates.length; j++) {
              for (let l = 0; l < obj.geometry.coordinates[j].length; l++) {
                for (
                  let m = 0;
                  m < obj.geometry.coordinates[j][l].length;
                  m++
                ) {
                  this.config.bounds.southwest[0] =
                    this.config.bounds.southwest[0] >
                    obj.geometry.coordinates[j][l][m][0]
                      ? obj.geometry.coordinates[j][l][m][0]
                      : this.config.bounds.southwest[0];
                  this.config.bounds.southwest[1] =
                    this.config.bounds.southwest[1] >
                    obj.geometry.coordinates[j][l][m][1]
                      ? obj.geometry.coordinates[j][l][m][1]
                      : this.config.bounds.southwest[1];
                  this.config.bounds.northeast[0] =
                    this.config.bounds.northeast[0] <
                    obj.geometry.coordinates[j][l][m][0]
                      ? obj.geometry.coordinates[j][l][m][0]
                      : this.config.bounds.northeast[0];
                  this.config.bounds.northeast[1] =
                    this.config.bounds.northeast[1] <
                    obj.geometry.coordinates[j][l][m][1]
                      ? obj.geometry.coordinates[j][l][m][1]
                      : this.config.bounds.northeast[1];
                }
              }
            }
          }
        }
      } else {
        this.config.bounds = this.bounds;
      }
      for (let i = 0; i < geo.features.length; i++) {
        obj = geo.features[i];
        for (let k = 0; k < obj.geometry.coordinates.length; k++) {
          for (let j = 0; j < obj.geometry.coordinates.length; j++) {
            for (let l = 0; l < obj.geometry.coordinates[j].length; l++) {
              this.tempConfig.tempCanvas.beginPath();
              for (let m = 0; m < obj.geometry.coordinates[j][l].length; m++) {
                let obpoint = this.LngLatToPix(
                  obj.geometry.coordinates[j][l][m][0],
                  obj.geometry.coordinates[j][l][m][1]
                );
                if (m === 0) {
                  this.tempConfig.tempCanvas.moveTo(obpoint.x, obpoint.y);
                } else if (m === obj.geometry.coordinates[j][l].length - 1) {
                  this.tempConfig.tempCanvas.lineTo(obpoint.x, obpoint.y);
                  obpoint = this.LngLatToPix(
                    obj.geometry.coordinates[j][l][0][0],
                    obj.geometry.coordinates[j][l][0][1]
                  );
                  this.tempConfig.tempCanvas.lineTo(obpoint.x, obpoint.y);
                } else {
                  this.tempConfig.tempCanvas.lineTo(obpoint.x, obpoint.y);
                }
              }
              this.tempConfig.tempCanvas.fill();
            }
          }
        }
      }
    },
    instance(geo) {
      this._initMap(geo);
      this._initGrid();
      return this;
    },
    _DataPick(ctx, x, y, config) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      if (typeof config.symbol === "string") {
        if (config.symbol === "rect") {
          ctx.moveTo(
            0 - config.radius,
            0 - config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 - config.radius,
            0 + config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 + config.radius,
            0 + config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 + config.radius,
            0 - config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 - config.radius,
            0 - config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
        } else {
          ctx.arc(0, 0, config.radius, 0, (Math.PI / 180) * 360);
        }
      } else if (typeof config.symbol === "function") {
        config.symbol(ctx);
      }
    },
    _itemStyle(ctx, x, y, config) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      if (typeof config.symbol === "string") {
        if (config.symbol === "rect") {
          ctx.moveTo(
            0 - config.radius,
            0 - config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 - config.radius,
            0 + config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 + config.radius,
            0 + config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 + config.radius,
            0 - config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
          ctx.lineTo(
            0 - config.radius,
            0 - config.radius,
            config.radius,
            0,
            (Math.PI / 180) * 360
          );
        } else {
          ctx.arc(0, 0, config.radius, 0, (Math.PI / 180) * 360);
        }
      } else if (typeof config.symbol === "function") {
        config.symbol(ctx);
      }
      if (config.fillStyle === "fill") {
        ctx.fillStyle = config.color;
        ctx.fill();
      } else {
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    },
    _gridStyle(x, y) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.beginPath();
      if (typeof this.config.symbol === "string") {
        if (this.config.symbol === "rect") {
          this.ctx.moveTo(
            0 - this.config.radius,
            0 - this.config.radius,
            this.config.radius,
            0,
            (Math.PI / 180) * 360
          );
          this.ctx.lineTo(
            0 - this.config.radius,
            0 + this.config.radius,
            this.config.radius,
            0,
            (Math.PI / 180) * 360
          );
          this.ctx.lineTo(
            0 + this.config.radius,
            0 + this.config.radius,
            this.config.radius,
            0,
            (Math.PI / 180) * 360
          );
          this.ctx.lineTo(
            0 + this.config.radius,
            0 - this.config.radius,
            this.config.radius,
            0,
            (Math.PI / 180) * 360
          );
          this.ctx.lineTo(
            0 - this.config.radius,
            0 - this.config.radius,
            this.config.radius,
            0,
            (Math.PI / 180) * 360
          );
        } else {
          this.ctx.arc(0, 0, this.config.radius, 0, (Math.PI / 180) * 360);
        }
      } else if (typeof this.config.symbol === "function") {
        this.config.symbol(this.ctx);
      }
      if (this.config.fillStyle === "fill") {
        this.ctx.fillStyle = this.config.color;
        this.ctx.fill();
      } else {
        this.ctx.strokeStyle = this.config.color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
      this.ctx.restore();
    },
    _initGrid() {
      if (
        this.config.background &&
        typeof this.config.background === "string"
      ) {
        this.ctx.fillStyle = this.config.background;
        this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
      } else if (
        this.config.background &&
        typeof this.config.background === "function"
      ) {
        this.config.background(this.ctx);
      }
      this.tempConfig.netGrids.splice(0, this.tempConfig.netGrids.length);
      const x = Math.round(this.WIDTH / this.config.x);
      const y = Math.round(this.HEIGHT / this.config.y);
      const imgdata = this.tempConfig.tempCanvas.getImageData(
        0,
        0,
        this.WIDTH,
        this.HEIGHT
      );
      for (let i = 0; i <= this.config.y; i++) {
        for (let k = 0; k <= this.config.x; k++) {
          if (imgdata.data[(i * y * imgdata.width + k * x) * 4 + 3] === 255) {
            this.tempConfig.netGrids.push({
              _x: k,
              _y: i,
              x: k * x,
              y: i * y
            });
            this._gridStyle(k * x, i * y);
          }
        }
      }
      if (this.config.showGrid) {
        this.ctx.lineWidth = this.config.scale;
        this.ctx.beginPath();
        for (let i = 0; i <= this.config.y; i++) {
          this.ctx.moveTo(0, i * y);
          this.ctx.lineTo(this.WIDTH, i * y);
        }
        for (let i = 0; i <= this.config.x; i++) {
          this.ctx.moveTo(i * x, 0);
          this.ctx.lineTo(i * x, this.HEIGHT);
        }
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
      }
    },
    addData(data) {
      // itemStyle = itemStyle || this.config.itemStyle;
      if (!this.tempConfig.dataLayer) {
        this.tempConfig.dataLayer = document
          .createElement("canvas")
          .getContext("2d");
        this.tempConfig.dataLayer.canvas.style.position = "absolute";
        this.tempConfig.dataLayer.canvas.style.let = "0";
        this.tempConfig.dataLayer.canvas.style.top = "0";
        this.tempConfig.dataLayer.canvas.style.width = "100%";
        this.tempConfig.dataLayer.canvas.style.height = "100%";
        this.tempConfig.dataLayer.canvas.width = this.WIDTH;
        this.tempConfig.dataLayer.canvas.height = this.HEIGHT;
        this.$refs.parent.appendChild(this.tempConfig.dataLayer.canvas);
      }
      this.tempConfig.data.splice(0, this.tempConfig.data.length);
      // const x = Math.round(this.WIDTH / this.config.x)
      // const y = Math.round(this.HEIGHT / this.config.y)

      data.forEach(point => {
        let tempy = -1;
        let tempx = -1;
        const px =
          ((point.lng - this.config.bounds.southwest[0]) /
            (this.config.bounds.northeast[0] -
              this.config.bounds.southwest[0])) *
          this.WIDTH;
        const py =
          ((this.config.bounds.northeast[1] - point.lat) /
            (this.config.bounds.northeast[1] -
              this.config.bounds.southwest[1])) *
          this.HEIGHT;
        this.tempConfig.netGrids.forEach(net => {
          if (tempx === -1) {
            tempx = net.x;
            tempy = net.y;
          }
          if (
            Math.pow(net.x - px, 2) + Math.pow(net.y - py, 2) <
            Math.pow(tempx - px, 2) + Math.pow(tempy - py, 2)
          ) {
            tempx = net.x;
            tempy = net.y;
          }
        });
        this.tempConfig.data.push({
          x: tempx,
          y: tempy,
          item: point,
          hover: this.tempConfig.evnet.hover
        });
      });
      setTimeout(() => {
        this.updateData();
      }, 100);
      return {
        layer: this.tempConfig.dataLayer,
        remove: this.layerRemove
      };
    },
    layerRemove(intance) {
      for (let i = 0; i <= this.tempConfig.layers.length; i++) {
        if (this.tempConfig.layers[i].layer === intance) {
          window.cancelRequestAnimationFrame(
            this.tempConfig.layers[i].animationId
          );
          this.tempConfig.layers.splice(i, 1);
          break;
        }
      }
    },
    updateData() {
      this.tempConfig.dataLayer.clearRect(0, 0, this.WIDTH, this.HEIGHT);

      this.tempConfig.animationNumber =
        this.tempConfig.animationNumber <=
        this.config.itemStyle.radius + this.tempConfig.animationDistance
          ? this.tempConfig.animationNumber + this.tempConfig.animationSpeed
          : this.config.itemStyle.radius;

      const itemStyle = JSON.parse(JSON.stringify(this.config.itemStyle));
      const pointStyle = JSON.parse(JSON.stringify(this.config.itemStyle));
      itemStyle.fillStyle = "stroke";
      itemStyle.radius = this.tempConfig.animationNumber;
      const color = itemStyle.color;
      color.push(
        (this.config.itemStyle.radius +
          this.tempConfig.animationDistance -
          this.tempConfig.animationNumber) /
          (this.config.itemStyle.radius + this.tempConfig.animationDistance)
      );
      itemStyle.color = "".concat("rgba(", color.join(","), ")");
      pointStyle.color = "".concat("rgb(", pointStyle.color.join(","), ")");
      this.tempConfig.data.forEach(data => {
        if (data.item.itemStyle) {
          if (data.item.itemStyle.color) {
            const colorf = JSON.parse(
              JSON.stringify(data.item.itemStyle.color)
            );
            pointStyle.color = "".concat("rgb(", colorf.join(","), ")");
            colorf.push(
              (this.config.itemStyle.radius +
                this.tempConfig.animationDistance -
                this.tempConfig.animationNumber) /
                (this.config.itemStyle.radius +
                  this.tempConfig.animationDistance)
            );
            itemStyle.color = "".concat("rgba(", colorf.join(","), ")");
          }
          if (data.item.itemStyle.symbol) {
            itemStyle.symbol = pointStyle.symbol = data.item.itemStyle.symbol;
          }
        }
        this._itemStyle(this.tempConfig.dataLayer, data.x, data.y, itemStyle);
        this._itemStyle(this.tempConfig.dataLayer, data.x, data.y, pointStyle);
      });
      if (this.instanceID) {
        window.cancelAnimationFrame(this.instanceID);
      }
      this.instanceID = window.requestAnimationFrame(() => {
        this.updateData();
      });
    },
    dataHoverEvent(e) {
      this.tempConfig.dataLayer;
      this.tempConfig.data.forEach(data => {
        const pointStyle = JSON.parse(JSON.stringify(this.config.itemStyle));
        if (data.item.itemStyle) {
          if (data.item.itemStyle.color) {
            const colorf = JSON.parse(
              JSON.stringify(data.item.itemStyle.color)
            );
            pointStyle.color = "".concat("rgb(", colorf.join(","), ")");
          }
        }
        this._itemStyle(this.tempConfig.dataLayer, data.x, data.y, pointStyle);
        const flag = this.tempConfig.dataLayer.isPointInPath(
          e.clientX,
          e.clientY
        );
        data.hover = flag;
      });
    }
  },
  beforeDestroy() {
    if (this.tempConfig.evnet.hover && this.tempConfig.dataLayer) {
      this.tempConfig.dataLayer.canvas.removeEventListener(
        "mousemove",
        this.dataHoverEvent
      );
    }
    window.cancelAnimationFrame(this.instanceID);
  }
};
</script>

<style scoped>
.hoverPin:before {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border: solid transparent;
  pointer-events: none;
  border-color: rgba(0, 0, 0, 0);
}
.hoverPin:before {
  border-top-color: rgba(0, 0, 0, 0.2);
  border-width: 6px;
  left: calc(50% - 6px);
  content: "";
  top: 100%;
}
</style>
