import event from "@/plugins/event";
class BesselUtil {
  constructor(dom, option) {
    // const self = zone;
    // const { lineStyle } = option;
    this.dom = dom;
    this.devicePixelRatio = 1;
    this.option = option;
    this.inintDom();
    this.catchPosition = { x: 0, y: 0 };
    this.catchData = {
      a: { x: 0, y: 0 },
      b: { x: 0, y: 0 },
      c: { x: 0, y: 0 },
      d: { x: 0, y: 0 }
    };
    this.mousePoint = { x: 0, y: 0 };
    this.ctx = dom.getContext("2d");
    this.dragTarget = null;
    this.hoverMode = false;
    this.dragMode = false;
    this.dbclick = option.dbclick;
    this.changeTarget = option.changeTarget;
    this.context = option.contextMenuAction;
    this.inputAction = option.inputAction;
    this.clickCallback = option.clickAction;
    this.points = [];
    this.pointSymbol = {
      active: false,
      a: null,
      b: null,
      c: null,
      d: null
    };
    this.bindEvent();
    this.timer = requestAnimationFrame(() => {
      this.paint();
    });
  }
  inintDom() {
    this.dom.width = this.dom.clientWidth * this.devicePixelRatio;
    this.dom.height = this.dom.clientHeight * this.devicePixelRatio;
  }
  setMousePoint(p) {
    this.mousePoint = p;
    this.styleEvent(this.mousePoint);
  }
  point(ev) {
    return {
      x: ev.offsetX,
      y: ev.offsetY
    };
  }
  bindEvent() {
    const self = this;
    event.$on("resize", () => {
      setTimeout(() => {
        self.inintDom();
      }, 1000);
    });
    window.addEventListener("contextmenu", ev => {
      ev.preventDefault();
      if (typeof this.context === "function") {
        this.context(this.point(ev));
      }
    });
    this.dom.addEventListener("click", ev => {
      ev.stopPropagation();
      // if (!this.dragMode) {
      const p = this.point(ev);
      if (
        this.catchPosition.x === p.x &&
        this.catchPosition.y === p.y &&
        this.dragTarget === null
      ) {
        this.click(ev);
      }
      console.log(JSON.stringify(this.pointSymbol));
      // }
    });
    this.dom.addEventListener("dblclick", ev => {
      // 文本添加
      if (typeof this.inputAction === "function") {
        const ps = this.points[this.dragTarget.index];
        this.inputAction(this.point(ev), {
          center: this.MultiPointBezier([ps.a, ps.b, ps.c, ps.d], 0.5),
          index: this.dragTarget.index
        });
      }
    });
    this.dom.addEventListener("mousedown", ev => {
      if (typeof this.clickCallback === "function") {
        this.clickCallback();
      }
      this.mouseDown(ev);
      // if (!this.dragMode) {
      //   this.click(ev);
      // }
    });
    this.dom.addEventListener("mousemove", ev => {
      this.mousePoint = this.point(ev);
      this.styleEvent(ev);
    });
    this.dom.addEventListener("mouseup", () => {
      this.dragMode = false;
      this.hoverMode = false;
      if (this.dragTarget !== null) {
        this.defaultDom(this.dragTarget.index);
      }
    });
  }
  resetSymbol() {
    return {
      active: false,
      a: null,
      b: null,
      c: null,
      d: null
    };
  }
  activeDom(index) {
    this.points[index].active = true;
  }
  defaultDom(index) {
    this.points[index].active = false;
  }
  mouseDown(ev) {
    this.catchPosition = this.point(ev);
    if (this.dragTarget !== null) {
      this.dragMode = true;
      this.hoverMode = false;
      this.catchData = JSON.parse(
        JSON.stringify(this.points[this.dragTarget.index])
      );
      this.activeDom(this.dragTarget.index);
    }
  }
  click(ev) {
    this.dragMode = false;
    if (this.pointSymbol.a === null) {
      this.pointSymbol.a = this.point(ev);
    } else if (this.pointSymbol.d === null) {
      this.pointSymbol.d = this.point(ev);
      this.pointSymbol.b = this.calcModePoint(
        this.pointSymbol.a,
        this.pointSymbol.d
      );
      this.pointSymbol.c = this.calcModePoint(
        this.pointSymbol.d,
        this.pointSymbol.a
      );
      this.points.push(JSON.parse(JSON.stringify(this.pointSymbol)));
      this.pointSymbol = this.resetSymbol();
    }
  }
  arc(point, active, hover, paint) {
    this.ctx.beginPath();
    this.ctx.arc(
      point.x,
      point.y,
      active
        ? this.option.circleRadiusActive || 6
        : this.option.circleRadius || 4,
      0,
      (360 * Math.PI) / 180
    );
    if (paint !== false) {
      this.ctx.fillStyle = hover
        ? this.option.circleHoverFillStyle || "blue"
        : active
        ? this.option.circleActiveFillStyle || "yellow"
        : this.option.circleFillStyle || "orange";
      this.ctx.fill();
      this.ctx.strokeStyle = hover
        ? this.option.circleHovereStrokeStyle || "blue"
        : active
        ? this.option.circleActiveStrokeStyle || "yellow"
        : this.option.circleStrokeStyle || "black";
      this.ctx.stroke();
    }
  }
  makeLine() {
    this.points.forEach(p => {
      this.besselByPoints(p);
      this.ctx.strokeStyle = p.active
        ? this.option.lineStyleActive || "orange"
        : this.option.lineStyle || "black";
      this.ctx.stroke();
      this.ctx.beginPath();
      this.arc(p.a, p.active, false);
      this.arc(p.d, p.active, false);
    });
    if (this.pointSymbol.a) {
      this.arc(this.pointSymbol.a, false, false);
    }
    if (this.dragTarget && this.hoverMode) {
      this.besselByPoints(this.points[this.dragTarget.index]);
      this.ctx.strokeStyle = this.option.lineStyleHover || "blue";
      this.ctx.stroke();
      this.ctx.beginPath();
      this.arc(this.points[this.dragTarget.index].a, true, false);
      this.arc(this.points[this.dragTarget.index].d, true, false);
    }
  }
  static instance(dom, option, zone) {
    return new BesselUtil(dom, option, zone);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  paint() {
    this.clear();
    this.makeLine();
    this.timer = requestAnimationFrame(() => {
      this.paint();
    });
  }
  calcModePoint(s, e) {
    return {
      x: e.x,
      y: s.y
    };
  }
  calcMove(root, catchP, targetP) {
    return {
      x: root.x + targetP.x - catchP.x,
      y: root.y + targetP.y - catchP.y
    };
  }
  styleEvent() {
    let isIn = false;
    // const p = this.point(ev);
    const p = this.mousePoint;
    if (this.dragMode) {
      const q = this.points[this.dragTarget.index];
      switch (this.dragTarget.mode) {
        case "drag":
          q[this.dragTarget.target] = p;
          q.b = this.calcModePoint(q.a, q.d);
          q.c = this.calcModePoint(q.d, q.a);
          break;
        case "move":
          // catchData
          q.a = this.calcMove(this.catchData.a, this.catchPosition, p);
          q.b = this.calcMove(this.catchData.b, this.catchPosition, p);
          q.c = this.calcMove(this.catchData.c, this.catchPosition, p);
          q.d = this.calcMove(this.catchData.d, this.catchPosition, p);
          break;
      }
      if (typeof this.changeTarget === "function") {
        this.changeTarget(this.dragTarget.index, {
          lines: q,
          center: this.MultiPointBezier([q.a, q.b, q.c, q.d], 0.5)
        });
      }
    } else {
      for (let i = 0; i < this.points.length; i++) {
        const isIna = this.checkIn(this.points[i].a, p, this.points[i].active);
        const isInb = this.checkIn(this.points[i].d, p, this.points[i].active);
        const isInc = this.checkInLine(
          this.points[i],
          p,
          this.option.clickRange || 2
        );
        if (isIna || isInb) {
          isIn = true;
          this.dragTarget = {
            index: i,
            mode: "drag",
            target: isIna ? "a" : "d"
          };
          break;
        }
        if (isInc) {
          isIn = true;
          this.dragTarget = {
            index: i,
            mode: "move"
          };
          break;
        }
      }
      if (isIn) {
        this.dom.style.cursor = "pointer";
        this.hoverMode = true;
      } else {
        this.dom.style.cursor = "default";
        this.hoverMode = false;
        this.dragTarget = null;
      }
    }
  }
  besselByPoints(p) {
    this.ctx.beginPath();
    this.ctx.moveTo(p.a.x, p.a.y);
    this.ctx.bezierCurveTo(p.b.x, p.b.y, p.c.x, p.c.y, p.d.x, p.d.y);
  }
  checkInLine(p, check, r) {
    this.ctx.lineWidth = r;
    const mp = { x: r, y: r };
    const rmp = { x: -r, y: -r };
    const cp = { x: 0, y: 0 };
    const p1 = JSON.parse(JSON.stringify(p));
    const temp = JSON.parse(JSON.stringify(p));
    const p2 = {
      a: temp.d,
      b: temp.c,
      c: temp.b,
      d: temp.a
    };
    p1.a = this.calcMove(p1.a, mp, cp);
    p1.b = this.calcMove(p1.b, mp, cp);
    p1.c = this.calcMove(p1.c, mp, cp);
    p1.d = this.calcMove(p1.d, mp, cp);
    p2.a = this.calcMove(p2.a, rmp, cp);
    p2.b = this.calcMove(p2.b, rmp, cp);
    p2.c = this.calcMove(p2.c, rmp, cp);
    p2.d = this.calcMove(p2.d, rmp, cp);
    this.ctx.beginPath();
    this.ctx.moveTo(p1.a.x, p1.a.y);
    this.ctx.bezierCurveTo(p1.b.x, p1.b.y, p1.c.x, p1.c.y, p1.d.x, p1.d.y);
    this.ctx.lineTo(p2.a.x, p2.a.y);
    this.ctx.bezierCurveTo(p2.b.x, p2.b.y, p2.c.x, p2.c.y, p2.d.x, p2.d.y);
    if (this.ctx.isPointInPath(check.x, check.y)) {
      this.ctx.lineWidth = 1;
      return true;
    }
    this.ctx.lineWidth = 1;
    return false;
  }
  checkIn(point, check, active) {
    this.arc(point, active, false, false);
    if (this.ctx.isPointInPath(check.x, check.y)) {
      return true;
    }
    return false;
  }
  destory() {
    cancelAnimationFrame(this.timer);
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

  MultiPointBezier(points, t) {
    const len = points.length;
    let x = 0,
      y = 0;
    const erxiangshi = function(start, end) {
      let cs = 1,
        bcs = 1;
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
}
export default BesselUtil;
