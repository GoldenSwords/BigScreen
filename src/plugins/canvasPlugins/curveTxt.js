class Tool {
  constructor(dom, config, options) {
    this.dom = dom;
    this.intanceId = null;
    this.ctx = dom.getContext("2d");
    this.config = config;
    this.options = options;
  }
  clearRect(dom) {
    this.ctx = dom.getContext("2d");
    this.ctx.clearRect(0, 0, dom.clientWidth, dom.clientHeight); // 清空
  }
  reDraw(dom, config, options) {
    window.cancelAnimationFrame(this.intanceId);
    this.init(dom, config, options);
  }
  /**
   初始化变量
  **/
  init(dom, config, options) {
    this.dom = dom;
    this.ctx = dom.getContext("2d");
    this.config = config;
    this.options = options;

    this.HEIGHT = this.dom.height = this.dom.clientHeight;
    this.WIDTH = this.dom.width = this.dom.clientWidth;
    this.config.linesDataConfig.temp = [];
    // 派发线条队列
    for (let i = 0; i < this.options.linesData.length; i++) {
      let values = this.options.linesData[i].value;
      for (let v = 0; v < values.length; v++) {
        values[v].x = values[v].x * this.WIDTH;
        values[v].y = values[v].y * this.HEIGHT;
      }
      this.config.linesDataConfig.temp.push({
        temp: 0,
        number: 300,
        obj: this.options.linesData[i]
      });
    }
    this.moveAniamtion();
  }

  // 动画
  moveAniamtion() {
    // 初始化矩形面板
    this.ctx.fillStyle = "rgba(5, 18, 59,0)";
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT); // 清空
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT); // 填充
    for (let i = 0; i < this.config.linesDataConfig.temp.length; i++) {
      let obj = this.config.linesDataConfig.temp[i];
      this.ctx.lineWidth = this.config.linesDataConfig.config.lineWidth; // 设置线条粗细
      const ps = this.CreateBezierPoints(obj.obj.value, obj.number); // 根据给定点生成固定数量的贝塞尔线条路径
      if (
        obj.temp + this.config.linesDataConfig.config.speed >
        ps.length +
          obj.obj.tempText.length * this.config.linesDataConfig.config.depart
      ) {
        obj.temp = 0;
      } else {
        obj.temp += this.config.linesDataConfig.config.speed;
      }
      this.paintLines(ps, this.config.linesDataConfig.config.color); // 绘制路径
      this.ctx.fillStyle = "#d0dcec"; // 设置画笔颜色
      if (obj.obj.tempText) {
        // 这里绘制文本
        let index = 0;
        obj.obj.tempText.forEach(item => {
          if (
            obj.temp + index * this.config.linesDataConfig.config.depart >= 0 &&
            obj.temp + index * this.config.linesDataConfig.config.depart <
              ps.length
          ) {
            this.ctx.font = obj.obj.font + "px bold";
            // this.ctx.rotate(-45);
            this.ctx.fillText(
              item,
              ps[obj.temp + index * this.config.linesDataConfig.config.depart]
                .x - 10,
              ps[obj.temp + index * this.config.linesDataConfig.config.depart].y
            );
          }
          index--;
        });
      }
      this.ctx.lineWidth = 1; // 恢复到初始化宽度
    }
    this.intanceId = window.requestAnimationFrame(() => {
      this.moveAniamtion();
    });
  }

  /**
   anchorpoints：贝塞尔基点
   pointsAmount：生成的点数
   return 路径点的Array
   **/
  CreateBezierPoints(anchorpoints, pointsAmount) {
    const points = [];
    for (let i = 0; i < pointsAmount; i++) {
      const point = this.MultiPointBezier(anchorpoints, i / pointsAmount);
      points.push(point);
    }
    return points;
  }

  // 基点函数
  MultiPointBezier(points, t) {
    const len = points.length;
    let x = 0;
    let y = 0;
    const erxiangshi = function(start, end) {
      let cs = 1;
      let bcs = 1;
      while (end > 0) {
        cs *= start;
        bcs *= end;
        start--;
        end--;
      }
      return cs / bcs;
    };
    for (let i = 0; i < len; i++) {
      const point = points[i];
      x +=
        point.x *
        Math.pow(1 - t, len - 1 - i) *
        Math.pow(t, i) *
        erxiangshi(len - 1, i);
      y +=
        point.y *
        Math.pow(1 - t, len - 1 - i) *
        Math.pow(t, i) *
        erxiangshi(len - 1, i);
    }
    return { x: x, y: y };
  }

  /**
   绘制线条
   **/
  paintLines(data, color) {
    if (!color || data.length === 0) {
      return;
    }
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([4, 2]); // 虚线
    this.ctx.moveTo(data[0].x, data[0].y);
    for (let i = 1; i < data.length; i++) {
      this.ctx.lineTo(data[i].x, data[i].y);
    }
    if (typeof color === "string") {
      this.ctx.strokeStyle = "".concat("rgba(", color, ")");
      this.ctx.stroke();
    } else {
      const lingrad = this.ctx.createLinearGradient(
        data[0].x,
        data[0].y,
        data[data.length - 1].x,
        data[data.length - 1].y
      );
      for (let i = 0; i < color.length; i++) {
        lingrad.addColorStop(
          color.length - 1 === 0 ? 0 : i / (color.length - 1),
          "rgba(" + color[i].join(",") + ")"
        );
      }
      this.ctx.strokeStyle = lingrad;
      this.ctx.stroke();
    }
  }
}

Tool.instance = function(dom, config, options) {
  return new Tool(dom, config, options);
};
export default Tool;
