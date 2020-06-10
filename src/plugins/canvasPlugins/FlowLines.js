/**
 * 绘制项
 * */
class FlowLines {
  constructor(dom, opt) {
    console.log(111);
    this.dom = dom;
    this.ctx = dom.getContext("2d");
    this.opt = opt;
    this.devicePixelRatio = 2;
    this.inintDom();
  }
  static instance(dom, option) {
    return new FlowLines(dom, option);
  }
  inintDom() {
    this.dom.width = this.dom.clientWidth * this.devicePixelRatio;
    this.dom.height = this.dom.clientHeight * this.devicePixelRatio;
  }
  destory() {}
}
/**
 * 功能项
 * */
class Tool {
  constructor(dom, opt) {
    this.dom = dom;
    console.log(111);
    this.baseLineStyle = "black";
    this.baseLineWidth = 4;
    this.ctx = dom.getContext("2d");
    this.ctx.strokeStyle = this.baseLineStyle;
    this.ctx.lineWidth = this.baseLineWidth;
    this.opt = opt;
    this.devicePixelRatio = 2;
    this.symbols = [
      [
        {
          type: "rect",
          name: "矩形",
          opt: { w: 100, h: 100, center: { x: 10, y: 10 } }
        },
        {
          type: "rect",
          name: "矩形",
          opt: { w: 100, h: 100, center: { x: 10, y: 10 } }
        }
      ],
      {
        type: "circle",
        name: "矩形",
        opt: { xr: 50, yr: 50, center: { x: 10, y: 10 } }
      },
      {
        type: "diamond",
        name: "矩形",
        opt: { w: 100, h: 100, center: { x: 10, y: 10 } }
      },
      {
        type: "arrow",
        name: "矩形",
        opt: { start: { x: 200, y: 200 }, end: { x: 220, y: 320 } }
      },
      { type: "rect", name: "矩形", opt: { w: 100, h: 100 } },
      { type: "rect", name: "矩形", opt: { w: 100, h: 100 } }
    ];
    this.inintDom();
    this.render();
  }
  static instance(dom, option) {
    return new Tool(dom, option);
  }
  inintDom() {
    this.dom.width = this.dom.clientWidth * this.devicePixelRatio;
    this.dom.height = this.dom.clientHeight * this.devicePixelRatio;
  }
  destory() {}
  render() {
    this.symbols.forEach((i, index) => {
      if (i instanceof Array) {
        i.forEach((p, idx) => {
          const center = {
            y: Math.round(
              (index * this.ctx.canvas.height) / this.symbols.length +
                this.ctx.canvas.height / this.symbols.length / 2
            ),
            x: Math.round(
              (idx * this.ctx.canvas.width) / i.length +
                this.ctx.canvas.width / i.length / 2
            )
          };
          if (this[p.type]) {
            this[p.type](center, p.opt);
          } else {
            throw new Error(`不存在当前类型${p.type}`);
          }
        });
      } else {
        const center = {
          y: Math.round(
            (index * this.ctx.canvas.height) / this.symbols.length +
              this.ctx.canvas.height / this.symbols.length / 2
          ),
          x: Math.round(this.ctx.canvas.width / 2)
        };
        if (this[i.type]) {
          this[i.type](center, i.opt);
        } else {
          throw new Error(`不存在当前类型${i.type}`);
        }
      }
    });
  }
  arrow(center, opt) {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.baseLineStyle;
    this.ctx.strokeStyle = this.baseLineStyle;
    this.ctx.lineWidth = this.baseLineWidth;
    this.ctx.moveTo(opt.start.x, opt.start.y);
    this.ctx.lineTo(opt.end.x, opt.end.y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.save();
    this.ctx.translate(opt.end.x, opt.end.y);
    const angle = Math.atan(
      Math.abs((opt.end.y - opt.start.y) / (opt.end.x - opt.start.x))
    );
    this.ctx.rotate(angle);
    console.log(angle);
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(-10, -10);
    this.ctx.lineTo(10, 0);
    this.ctx.lineTo(-10, 10);
    this.ctx.lineTo(0, 0);
    this.ctx.fill();
    this.ctx.restore();
    // this.ctx.rotate(end.x,end.y)
    // this.ctx.moveTo(end.x,end.y)
  }
  diamond(center, opt) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.baseLineStyle;
    this.ctx.lineWidth = this.baseLineWidth;
    this.ctx.moveTo(center.x, center.y - opt.h / 2);
    this.ctx.lineTo(center.x + opt.w / 2, center.y);
    this.ctx.lineTo(center.x, center.y + opt.h / 2);
    this.ctx.lineTo(center.x - opt.w / 2, center.y);
    this.ctx.lineTo(center.x, center.y - opt.h / 2);
    this.ctx.stroke();
  }
  rect(center, opt) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.baseLineStyle;
    this.ctx.lineWidth = this.baseLineWidth;
    this.ctx.rect(center.x - opt.w / 2, center.y - opt.h / 2, opt.w, opt.h);
    this.ctx.stroke();
  }
  circle(center, opt) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.baseLineStyle;
    this.ctx.lineWidth = this.baseLineWidth;
    this.ctx.ellipse(center.x, center.y, opt.xr, opt.yr, 0, 0, Math.PI * 2);
    this.ctx.stroke();
  }
}
export { FlowLines };
export { Tool };
