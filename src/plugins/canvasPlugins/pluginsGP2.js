class Tool {
  constructor(dom, config) {
    this.dom = dom;
    this.ctx = dom.getContext("2d");
    this.config = config;
  }
  getRandomColor(r, g, b) {
    let hex = this.RgbToHex(r, g, b);
    hex =
      Math.random() > 0.5
        ? this.getDarkColor(hex, Math.random() * 0.1)
        : this.getLightColor(hex, Math.random() * 0.1);
    const rgb = this.HexToRgb(hex);
    return rgb.join(",");
  }
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
    // console.log(hxs);
    return hxs;
  }
  // GRB颜色转Hex颜色
  RgbToHex(a, b, c) {
    const r = /^\d{1,3}$/;
    if (!r.test(a) || !r.test(b) || !r.test(c)) {
      return window.alert("输入错误的rgb颜色值");
    }
    const hexs = [a.toString(16), b.toString(16), c.toString(16)];
    for (let i = 0; i < 3; i++) {
      if (hexs[i].length === 1) hexs[i] = "0" + hexs[i];
    }
    return "#" + hexs.join("");
  }

  // 得到hex颜色值为color的加深颜色值，level为加深的程度，限0-1之间
  getDarkColor(color, level) {
    const r = /^#?[0-9A-Fa-f]{6}$/;
    if (!r.test(color)) return window.alert("输入错误的hex颜色值");
    const rgbc = this.HexToRgb(color);
    // floor 向下取整
    for (let i = 0; i < 3; i++) rgbc[i] = Math.floor(rgbc[i] * (1 - level));
    return this.RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
  }
  // 得到hex颜色值为color的减淡颜色值，level为加深的程度，限0-1之间
  getLightColor(color, level) {
    const r = /^#?[0-9A-Fa-f]{6}$/;
    if (!r.test(color)) return window.alert("输入错误的hex颜色值");
    const rgbc = this.HexToRgb(color);
    for (let i = 0; i < 3; i++) {
      rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);
    }
    return this.RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
  }
  /**
   初始化
   **/
  init() {
    this.config.groundCircleAnimationTimer = new Date().getTime();
    this.config.groundCircleCenterPoint = [
      this.dom.clientWidth / 2,
      this.dom.clientHeight / 3
    ];
    for (let i = 0; i < this.config.groundGridNumber; i++) {
      const color = this.getRandomColor(3, 16, 55);
      this.config.groundGridTemp.push({
        p: [
          parseInt(Math.random() * this.config.groundGridNumberx + 1),
          parseInt(Math.random() * this.config.groundGridNumbery + 1)
        ],
        color: "rgb(".concat(color, ")")
      });
    }
    this.config.deep = this.dom.clientHeight * 1.6;
    this.config.timer = new Date().getTime();
    this.config.groundDiamondTimer = new Date().getTime();
    this.config.timer = new Date().getTime();
    this.dom.width = this.dom.clientWidth;
    this.dom.height = this.dom.clientHeight;
    for (let i = 0; i < this.config.tempLineNumber; i++) {
      this.config.tempLine.push({
        x:
          Math.random() * this.dom.clientWidth * 2 -
          Math.random() * this.dom.clientWidth,
        y: 1,
        width: Math.random() * this.config.lineWidthSeed,
        h:
          Math.random() * this.dom.clientHeight * 0.5 +
          this.dom.clientHeight * 0.5,
        delay: Math.random() * 1000
      });
    }
    this.moveAniamtion();
  }
  // 面板线条
  panelLines() {}
  /**
   动效触发器
   **/
  moveAniamtion() {
    this.ctx.clearRect(0, 0, this.dom.clientWidth, this.dom.clientHeight);
    if (
      new Date().getTime() - this.config.timer2 >
      this.config.addGroundTime2
    ) {
      this.config.timer2 = new Date().getTime();
      this.config.groundGridTemp.splice(0, this.config.groundGridTemp.length);
      for (let i = 0; i < this.config.groundGridNumber; i++) {
        const color = this.getRandomColor(3, 16, 55);
        this.config.groundGridTemp.push({
          p: [
            parseInt(Math.random() * this.config.groundGridNumberx + 1),
            parseInt(Math.random() * this.config.groundGridNumbery + 1)
          ],
          color: "rgb(".concat(color, ")")
        });
      }
    }
    if (new Date().getTime() - this.config.timer > this.config.addGroundTime) {
      this.config.timer = new Date().getTime();
      for (let i = 0; i < 10; i++) {
        this.config.tempLine.push({
          x:
            Math.random() * this.dom.clientWidth * 2 -
            Math.random() * this.dom.clientWidth,
          y: 1,
          width: Math.random() * this.config.lineWidthSeed,
          h:
            Math.random() * this.dom.clientHeight * 0.5 +
            this.dom.clientHeight * 0.5,
          delay: Math.random() * 1000
        });
      }
    }
    this.drawBackground();
    window.requestAnimationFrame(() => {
      this.moveAniamtion();
    });
  }
  /**
   网格绘制方法
   **/
  drawGrid() {
    /* const w = this.dom.clientWidth / this.config.groundGridNumberx
    const h = this.dom.clientHeight / this.config.groundGridNumbery
    if (this.config.groundGridLine.length === 0) {
      for (let i = 0; i < this.config.groundGridNumberx; i++) {
        this.config.groundGridLine.push({ x: i * w, y: 1 })
      }
    } else {
      for (let k = 0; k < this.config.groundGridLine.length; k++) {
        this.config.groundGridLine[k] = { x: k * w, y: 1 }
      }
    }
    this.ctx.lineWidth = 2
    // 网格斑块模板数据
    let pindex = [
      { p: [1, 1], color: 'rgb(6, 22, 71)' },
      { p: [1, 2], color: 'rgb(6, 22, 71)' },
      { p: [1, 3], color: 'rgb(6, 22, 71)' },
      { p: [1, 4], color: 'rgb(6, 22, 71)' },
      { p: [2, 4], color: 'rgb(4, 15, 51)' },
      { p: [2, 6], color: 'rgb(7, 23, 69)' },
      { p: [2, 10], color: 'rgb(7, 23, 69)' },
      { p: [2, 11], color: 'rgb(7, 23, 69)' },
      { p: [3, 8], color: 'rgb(5, 19, 55)' },
      { p: [3, 12], color: 'rgb(10, 32, 84)' },
      { p: [3, 18], color: 'rgb(7, 23, 69)' },
      { p: [4, 4], color: 'rgb(17, 66, 126)' },
      { p: [4, 9], color: 'rgb(3, 16, 55)' },
      { p: [4, 19], color: 'rgb(3, 16, 55)' },
      { p: [4, 18], color: 'rgb(3, 16, 55)' },
      { p: [5, 10], color: 'rgb(5, 19, 55)' },
      { p: [5, 15], color: 'rgb(5, 19, 55)' },
      { p: [5, 18], color: 'rgb(5, 19, 55)' },
      { p: [5, 19], color: 'rgb(5, 19, 55)' },
      { p: [6, 13], color: 'rgb(6, 22, 71)' },
      { p: [6, 17], color: 'rgb(5, 19, 55)' },
      { p: [7, 8], color: 'rgb(5, 19, 55)' },
      { p: [7, 1], color: 'rgb(5, 19, 55)' },
      { p: [7, 3], color: 'rgb(5, 19, 55)' },
      { p: [7, 9], color: 'rgb(5, 19, 55)' },
      { p: [15, 12], color: 'rgb(5, 19, 55)' },
      { p: [15, 1], color: 'rgb(5, 19, 55)' },
      { p: [15, 3], color: 'rgb(5, 19, 55)' },
      { p: [15, 7], color: 'rgb(5, 19, 55)' },
      { p: [16, 12], color: 'rgb(5, 19, 55)' },
      { p: [16, 1], color: 'rgb(5, 19, 55)' },
      { p: [16, 5], color: 'rgb(5, 19, 55)' },
      { p: [16, 9], color: 'rgb(5, 19, 55)' },
      { p: [17, 17], color: 'rgb(5, 19, 55)' },
      { p: [17, 1], color: 'rgb(5, 19, 55)' },
      { p: [17, 3], color: 'rgb(5, 19, 55)' },
      { p: [17, 7], color: 'rgb(5, 19, 55)' },
      { p: [18, 12], color: 'rgb(5, 19, 55)' },
      { p: [18, 1], color: 'rgb(5, 19, 55)' },
      { p: [18, 11], color: 'rgb(5, 19, 55)' },
      { p: [18, 9], color: 'rgb(5, 19, 55)' },
      { p: [19, 12], color: 'rgb(5, 19, 55)' },
      { p: [19, 1], color: 'rgb(5, 19, 55)' }
    ]
    const color = '7, 29, 68'
    pindex = this.config.groundGridTemp
    for (let k = 0; k < this.config.groundGridNumberx + 1; k++) {
      for (let i = 0; i < this.config.groundGridNumberx; i++) {
        const pt = this.config.groundGridLine[i]
        // 纵向网格及圆圈
        this.ctx.beginPath()
        const p = this.calLine(
          this.config.deep,
          this.dom.clientHeight - this.config.groundGridLine[i].y,
          pt
        )
        const p2 = this.calLine(this.config.deep, h * k, p, true)
        this.ctx.arc(
          pt.x,
          pt.y,
          this.config.groundGridNumberRadius,
          0,
          (Math.PI / 180) * 360
        )
        this.ctx.moveTo(pt.x, pt.y)
        this.ctx.lineTo(p2.x, p2.y)
        const lingrad = this.ctx.createLinearGradient(
          0,
          0,
          0,
          this.dom.clientHeight
        )
        lingrad.addColorStop(0, 'rgba(' + color + ',0)')
        lingrad.addColorStop(0.2, 'rgba(' + color + ',0)')
        lingrad.addColorStop(0.4, 'rgba(' + color + ',0.3)')
        lingrad.addColorStop(0.6, 'rgba(' + color + ',.1)')
        lingrad.addColorStop(0.8, 'rgba(' + color + ',.6)')
        this.ctx.strokeStyle = lingrad
        this.ctx.stroke()
        // 绘制网格斑块
        for (let z = 0; z < pindex.length; z++) {
          if (pindex[z].p[0] === k && pindex[z].p[1] === i) {
            const p4 = this.calLine(
              this.config.deep,
              this.dom.clientHeight - this.config.groundGridLine[i + 1].y,
              this.config.groundGridLine[i + 1]
            )
            const p3 = this.calLine(this.config.deep, h * k, p4, true)
            this.ctx.beginPath()
            this.ctx.moveTo(pt.x, pt.y)
            this.ctx.lineTo(p2.x, p2.y)
            this.ctx.lineTo(p3.x, p3.y)
            this.ctx.lineTo(
              this.config.groundGridLine[i + 1].x,
              this.config.groundGridLine[i + 1].y
            )
            this.ctx.fillStyle = pindex[z].color
            this.ctx.fill()
          }
        }

        this.config.groundGridLine[i].x = p2.x
        this.config.groundGridLine[i].y = p2.y
      }
      // 横向网格线
      if (k === 0) {
        for (let z = 0; z < this.config.groundGridNumbery; z++) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.dom.clientWidth, h * z)
          this.ctx.lineTo(0, h * z)
          this.ctx.strokeStyle = 'rgba(' + color + ',0.1)'
          this.ctx.stroke()
        }
      }
    }
    this.ctx.lineWidth = 1 */
  }
  // 背景
  drawBackground() {
    this.ctx.fillStyle = "rgb(0, 9, 43)";
    this.ctx.fillRect(0, 0, this.dom.clientWidth, this.dom.clientHeight);
    this.drawGrid();
    const color = "5, 28, 60";
    const lingrad = this.ctx.createLinearGradient(
      0,
      0,
      0,
      this.dom.clientHeight
    );
    lingrad.addColorStop(0, "rgba(" + color + ",0)");
    lingrad.addColorStop(1, "rgba(" + color + ",.6)");
    this.ctx.strokeStyle = lingrad;
    const h = this.dom.clientHeight;
    let point = {};
    for (let i = 0; i < this.config.gridLineNumber; i++) {
      point = {
        x: (this.dom.clientWidth / this.config.gridLineNumber) * i,
        y: this.dom.clientHeight - h
      };
      const p = this.calLine(this.config.deep, h, point);
      this.ctx.beginPath();
      this.ctx.moveTo(point.x, point.y);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.stroke();
    }
    this.animationBackground();
    this.animationBackgroundCenter();
    this.drawCenter();
  }
  /**
   中心菱形组
   **/
  drawCenter() {
    const x = this.dom.clientWidth / 2;
    const y = this.dom.clientHeight / 3;
    const h = y * 0.06;
    const w = x * 0.12;
    const w4 = x * 0.12;
    const w2 = x * 0.09;
    const w3 = x * 0.064;
    this.diamond(
      x + w2 / 2,
      y + w2 / 2 + h * 2 + this.config.groundDiamondWidth,
      w2,
      0.2,
      { color: "33,33,33", opcity: 0.6 },
      "Fill"
    );
    this.diamond(
      x + w / 2,
      y + w / 2 + h + this.config.groundDiamondWidth,
      w,
      0.2,
      { color: "33,33,33", opcity: 0.6 },
      "Fill"
    );
    this.diamond(
      x + (w * 1.1) / 2,
      y + (w * 1.1) / 2,
      w * 1.1,
      0.4,
      { color: "0, 143, 255", opcity: 1 },
      "Stroke"
    );
    this.diamond(
      x + (w * 1.3) / 2,
      y + (w * 1.3) / 2,
      w * 1.3,
      0.4,
      { color: "57, 239, 246", opcity: 0.6, linePercent: 0.1 },
      "StrokeOut"
    );
    this.diamond(
      x + (w * 1.3) / 2,
      y + (w * 1.3) / 2,
      w * 1.3,
      0.4,
      { color: "47, 140, 200", opcity: 0.6, linePercent: 0.1 },
      "Animation"
    );
    this.diamond(
      x + w / 2,
      y + w / 2,
      w,
      0.4,
      { color: "57, 163, 234", opcity: 0.6 },
      "RadialGradient"
    );
    this.diamond(
      x + w / 2,
      y + w / 2,
      w,
      0.4,
      { color: "57, 163, 234", opcity: 1, linePercent: 0.2 },
      "Border"
    );
    this.diamond(
      x + w2 / 2,
      y + w2 / 2 - h / 2,
      w2,
      0.4,
      { color: "57, 163, 234", opcity: 0.4 },
      "Stroke"
    );
    this.diamond(
      x + w2 / 2,
      y + w2 / 2 - h / 2 - 2,
      w2,
      0.4,
      { color: "57, 163, 234", opcity: 0.4 },
      "Stroke"
    );
    this.diamond(
      x + w2 / 2,
      y + w2 / 2 - h / 2 - 4,
      w2,
      0.4,
      { color: "57, 163, 234", opcity: 0.4 },
      "Stroke"
    );
    this.diamond(
      x + w2 / 2,
      y + w2 / 2 - h / 2 - 6,
      w2,
      0.4,
      { color: "57, 163, 234", opcity: 0.4 },
      "Fill"
    );
    this.diamond(
      x + w3 / 2,
      y + w3 / 2 - h / 2 - 8,
      w3,
      0.4,
      { color: "33,33,33", opcity: 0.4 },
      "Fill"
    );

    // 面板数据计算
    for (let i = 0; i < this.config.panelData.length; i++) {
      const obj = this.config.panelData[i];
      const lix = x * 2 * this.config.panelData[i].x;
      const liy = y * 3 * this.config.panelData[i].y;
      const p = this.calLine(this.config.deep, y * 3 - liy, { x: lix, y: liy });
      const p2 = this.calLine(
        this.config.deep,
        y * 3 * this.config.panelData[i].h,
        p,
        true
      );
      // index++;
      this.ctx.beginPath();
      this.ctx.moveTo(lix, liy);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.lineTo(x * 2 * this.config.panelData[i].tx, p2.y);
      this.ctx.strokeStyle =
        "rgba(" +
        "".concat(
          obj.color.r,
          ",",
          obj.color.g,
          ",",
          obj.color.b,
          ",",
          obj.color.a
        ) +
        ")";
      this.ctx.setLineDash([2, 2]);
      this.ctx.stroke();
      this.ctx.setLineDash([2, 0]);
      if (obj.point) {
        this.ctx.beginPath();
        this.ctx.arc(
          x * 2 * this.config.panelData[i].tx,
          p2.y,
          obj.point.radius,
          0,
          (Math.PI / 180) * 360
        );
        this.ctx.fillStyle = "".concat("rgba(", obj.point.color.join(","), ")");
        // this.ctx.fillRect(x * 2 * this.config.panelData[i].tx,p2.y,10,10);
        this.ctx.fill();
      }
      const speedV = this.config.panelPointSpeed;
      const h1 = Math.abs(p2.y - liy);
      const h2 = Math.abs(p2.x - x * 2 * this.config.panelData[i].tx);
      let point = {};
      let lastPoint = {};
      const lineQW = this.config.panelPointWidth;
      if (obj.animation !== undefined) {
        obj.animation.temp++;
        if (obj.animation.temp * speedV > h1 + h2) {
          this.config.panelData[i].animation.temp = 0;
        }
        if (obj.animation.temp * speedV > h1) {
          point = p2;
          lastPoint = JSON.parse(JSON.stringify(p2));

          // 计算横向点位
          if (p2.x > x * 2 * this.config.panelData[i].tx) {
            point.x = point.x - (speedV * obj.animation.temp - h1);
            lastPoint.x = point.x - lineQW;
          } else {
            point.x = point.x + (speedV * obj.animation.temp - h1);
            lastPoint.x = point.x + lineQW;
          }
        } else {
          // 计算弯折点位
          point = this.calLine(
            this.config.deep,
            y * 3 * (1 - this.config.panelData[i].y) -
              obj.animation.temp * speedV,
            p,
            true
          );
          if (
            Math.sqrt(
              Math.pow(point.x - lix, 2) + Math.pow(point.y - liy, 2)
            ) === 0 ||
            Math.sqrt(
              Math.pow(point.x - lix, 2) + Math.pow(point.y - liy, 2)
            ) === 0
          ) {
            continue;
          }
          const vx =
            (lineQW /
              Math.sqrt(
                Math.pow(point.x - lix, 2) + Math.pow(point.y - liy, 2)
              )) *
            Math.abs(lix - point.x);
          const vy =
            (lineQW /
              Math.sqrt(
                Math.pow(point.x - lix, 2) + Math.pow(point.y - liy, 2)
              )) *
            Math.abs(liy - point.y);

          lastPoint = {
            x: point.x > lix ? point.x - vx : point.x + vx,
            y: point.y > liy ? point.y - vy : point.y + vy
          };
        }
        const lingrad = this.ctx.createLinearGradient(
          lastPoint.x,
          lastPoint.y,
          point.x,
          point.y
        );
        lingrad.addColorStop(
          0,
          "rgba(" + this.config.panelPointColor.join(",") + ",1)"
        );
        lingrad.addColorStop(
          1,
          "rgba(" + this.config.panelPointColor.join(",") + ",1)"
        );
        this.ctx.strokeStyle = lingrad;
        this.ctx.beginPath();
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.lineWidth = 1;
      }
    }

    // 顶部
    // this.diamond(x+w4/2,y+w4/2 - h * 2,w4,0.4,{color:"158, 102, 1",opcity:0.2},"Fill")
    if (
      new Date().getTime() - this.config.groundDiamondTimer >
      this.config.groundDiamondTime
    ) {
      this.config.groundDiamondTimer = new Date().getTime();
      this.config.groundDiamondStatus = !this.config.groundDiamondStatus;
    }
    if (this.config.groundDiamondStatus) {
      this.config.groundDiamondWidth += 0.5;
    } else {
      this.config.groundDiamondWidth -= 0.5;
    }
    this.diamond(
      x + w4 / 2,
      y + w4 / 2 - h * 2,
      w4,
      0.4,
      { color: "158, 102, 1", opcity: 0.2, w: w4, percent: 0.4 },
      "Fill"
    );
    this.diamond(
      x + w4 / 2,
      y + w4 / 2 - h * 2,
      w4,
      0.4,
      { color: "158, 102, 1", opcity: 0.1, w: w4, percent: 0.4 },
      "Stroke"
    );
    this.text(
      this.config.gorundCircleTextFont,
      "rgb(27, 169, 179)",
      x - 1,
      y + w / 2 - h * 5 - 1 + this.config.groundDiamondWidth,
      this.config.gorundCircleText,
      true
    );
    this.text(
      this.config.gorundCircleTextFont,
      "rgb(57, 239, 246)",
      x,
      y + w / 2 - h * 5 + this.config.groundDiamondWidth,
      this.config.gorundCircleText,
      true
    );
    // 中心针头纹理
    const circleLineColor = "0, 143, 255";
    this.circleLine(
      {
        x: x - w,
        y: y - h * 5
      },
      {
        lineWidth: 3,
        color: circleLineColor,
        radius: 4,
        borderRadius: 0,
        opcity: 0.6
      },
      {
        x: x - w,
        y: y + h * 2
      }
    );
    this.circleLine(
      {
        x: x + w,
        y: y - h * 3
      },
      {
        lineWidth: 3,
        color: circleLineColor,
        radius: 3,
        borderRadius: 0,
        opcity: 0.6
      },
      {
        x: x + w,
        y: y + h * 2
      }
    );
    this.circleLine(
      {
        x: x + w * 1.1,
        y: y - h * 6
      },
      {
        lineWidth: 3,
        color: circleLineColor,
        radius: 6,
        borderRadius: 8,
        opcity: 0.8
      },
      {
        x: x + w * 1.1,
        y: y - h / 3
      }
    );
    this.circleLine(
      { x: x - w * 0.8, y: y + h * 2 + 14 },
      {
        lineWidth: 3,
        color: circleLineColor,
        radius: 2,
        borderRadius: 0,
        opcity: 0.3
      }
    );
    this.circleLine(
      { x: x - w * 0.8, y: y + h * 2 + 6 },
      {
        lineWidth: 3,
        color: circleLineColor,
        radius: 4,
        borderRadius: 0,
        opcity: 0.4
      }
    );
    this.circleLine(
      { x: x - w * 0.8, y: y + h * 2 - 6 },
      {
        lineWidth: 3,
        color: circleLineColor,
        radius: 6,
        borderRadius: 7,
        opcity: 0.6
      }
    );
  }
  /**
   文本绘制
   font color
   x,y 文本中心点
   text
   shadow 阴影开关
   **/
  text(font, color, x, y, text, shadow) {
    if (shadow) {
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = color;
    }
    this.ctx.font = "normal bold " + font + "px sans-serif";
    this.ctx.fillStyle = color;
    const w = this.ctx.measureText(text).width;
    this.ctx.fillText(text, x - w / 2, y - font / 2);
    this.ctx.shadowBlur = 0;
  }
  /**
   x,y 菱形中心点
   percent 菱形高宽比 高/宽
   styletype 菱形定制样式
   config 一些自定义配置项
   **/
  diamond(x, y, w, percent, config, styletype) {
    this.ctx.save();
    this.ctx.translate(x - w / 2, y - w / 2);
    this.ctx.transform(1, -percent, -1 / percent, -1, 0, w * percent);
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    let lingrad = null;
    let h = 0;
    let lw = config.w;
    let lp = config.percent;
    switch (styletype) {
      case "RadialGradient":
        lingrad = this.ctx.createRadialGradient(
          w / 2,
          w / 2,
          0,
          w / 2,
          w / 2,
          w
        );
        lingrad.addColorStop(
          1,
          "rgba(" + config.color + "," + config.opcity + ")"
        );
        lingrad.addColorStop(0.25, "rgba(" + config.color + ",0)");
        lingrad.addColorStop(0, "rgba(" + config.color + ",0)");
        this.ctx.fillStyle = lingrad;
        this.ctx.fillRect(0, 0, w, w * percent);
        break;
      case "LinearGradient":
        lingrad = this.ctx.createLinearGradient(-0, 0, 0, w);
        lingrad.addColorStop(1, "rgba(" + config.color + ",1)");
        lingrad.addColorStop(0, "rgba(" + config.color + ",0)");
        this.ctx.fillStyle = lingrad;
        this.ctx.fillRect(0, 0, w, w * percent);
        break;
      case "Stroke":
        this.ctx.strokeStyle =
          "rgba(" + config.color + "," + config.opcity + ")";
        this.ctx.strokeRect(0, 0, w, w * percent);
        break;
      case "Animation":
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(x - w / 2, y - w / 2);
        // const wx = w;
        h = w * percent * config.linePercent;
        // const wy = w * percent;
        this.ctx.moveTo(w, 0);
        this.ctx.lineTo(w + h * 3, -h * 20);
        this.ctx.lineTo(-w - h * 3, -h * 20);
        this.ctx.lineTo(-w, 0);
        lingrad = this.ctx.createLinearGradient(0, 0, 0, -h * 20);
        lingrad.addColorStop(0, "rgba(" + config.color + ",.2)");
        lingrad.addColorStop(1, "rgba(" + config.color + ",0)");
        this.ctx.fillStyle = lingrad;
        this.ctx.fill();
        break;
      case "StrokeOut":
        this.ctx.strokeStyle =
          "rgba(" + config.color + "," + config.opcity + ")";
        h = w * percent * config.linePercent;
        this.ctx.fillStyle = "rgba(" + config.color + "," + config.opcity + ")";
        this.ctx.moveTo(0 - h, 0);
        this.ctx.lineTo(w + h, 0);

        this.ctx.moveTo(0 - h, w * percent);
        this.ctx.lineTo(w + h, w * percent);

        this.ctx.moveTo(0, 0 - h);
        this.ctx.lineTo(0, w * percent + h);

        this.ctx.moveTo(w, 0 - h);
        this.ctx.lineTo(w, w * percent + h);
        this.ctx.stroke();
        break;
      case "Border":
        this.ctx.strokeStyle =
          "rgba(" + config.color + "," + config.opcity + ")";
        h = w * percent * config.linePercent;
        this.ctx.moveTo(h, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(0, h);

        this.ctx.moveTo(h, w * percent);
        this.ctx.lineTo(0, w * percent);
        this.ctx.lineTo(0, w * percent - h);

        this.ctx.moveTo(w, h);
        this.ctx.lineTo(w, 0);
        this.ctx.lineTo(w - h, 0);

        this.ctx.moveTo(w - h, w * percent);
        this.ctx.lineTo(w, w * percent);
        this.ctx.lineTo(w, w * percent - h);
        this.ctx.stroke();
        break;
      case "Fill":
        this.ctx.fillStyle = "rgba(" + config.color + "," + config.opcity + ")";
        this.ctx.fillRect(0, 0, w, w * percent);
        break;
      case "Light":
        lw = config.w;
        lp = config.percent;
        lingrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, lw * 2);
        lingrad.addColorStop(0, "rgba(" + config.color + ",0)");
        lingrad.addColorStop(0.1, "rgba(" + config.color + ",.5)");
        lingrad.addColorStop(0.7, "rgba(" + config.color + ",0)");
        lingrad.addColorStop(1, "rgba(" + config.color + ",0)");
        this.ctx.fillStyle = lingrad;

        this.ctx.beginPath();
        this.ctx.moveTo(lw, lw * lp);
        this.ctx.lineTo(lw, -lw * lp);
        this.ctx.lineTo(w, -w * percent);
        this.ctx.lineTo(w, w * percent);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(lw, lw * lp);
        this.ctx.lineTo(-lw, lw * lp);
        this.ctx.lineTo(-w, w * percent);
        this.ctx.lineTo(w, w * percent);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(-lw, lw * lp);
        this.ctx.lineTo(-lw, -lw * lp);
        this.ctx.lineTo(-w, -w * percent);
        this.ctx.lineTo(-w, w * percent);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(lw, -lw * lp);
        this.ctx.lineTo(-lw, -lw * lp);
        this.ctx.lineTo(-w, -w * percent);
        this.ctx.lineTo(w, -w * percent);
        this.ctx.fill();
        break;
      default:
        break;
    }
    this.ctx.restore();
  }
  /**
   x,y 椭圆中心点
   xr,yr 椭圆半径
   color 颜色
   hasLight 光源开关
   **/
  circle(x, y, xr, yr, color, hasLight, border, opcity, stroke) {
    const line =
      (this.dom.clientHeight / 2) * this.config.groundCircleLineRadius;
    /**
     a x偏移 0 半径倍率 1-0
     b y偏移 1 正增长 1-0
     c x缩放 1 正增长 1-0
     d y缩放 0 正增长 0-1 ,e,f
     **/
    // ctx.transform(1,0,0,1,0,0)
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.transform(0, yr / xr, 1, 0, 0, 0);
    // 底部圆弧
    this.ctx.beginPath();
    // console.log(xr)
    let lingrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, parseInt(xr));
    if (hasLight) {
      lingrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, parseInt(xr));
      lingrad.addColorStop(1, "rgba(" + color + ",0)");
      lingrad.addColorStop(
        0,
        "rgba(" + color + "," + (opcity !== undefined ? opcity : 0.6) + ")"
      );
    } else {
      lingrad.addColorStop(
        1,
        "rgba(" + color + "," + (opcity !== undefined ? opcity : 0.6) + ")"
      );
      lingrad.addColorStop(0.75, "rgba(" + color + ",0.1)");
      lingrad.addColorStop(0, "rgba(" + color + ",0)");
    }
    this.ctx.fillStyle = lingrad;
    this.ctx.arc(0, 0, xr, 0, (Math.PI / 180) * 360);
    this.ctx.fill();
    if (stroke) {
      this.ctx.strokeStyle = "rgba(" + color + ",1)";
      this.ctx.stroke();
    }
    if (border) {
      // 边线
      this.ctx.beginPath();
      this.ctx.moveTo(0, -xr);
      this.ctx.lineTo(0, -xr + 2);
      this.ctx.lineTo(-line * 2, -xr - line * 0.2);
      this.ctx.fillStyle =
        "rgba(22, 69, 124," +
        this.config.groundCircleAnimationTemp /
          this.config.groundCircleAnimationTime +
        ")";
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(0, xr);
      this.ctx.lineTo(0, xr - 2);
      this.ctx.lineTo(-line * 2, xr + line * 0.2);
      this.ctx.fillStyle =
        "rgba(22, 69, 124," +
        this.config.groundCircleAnimationTemp /
          this.config.groundCircleAnimationTime +
        ")";
      this.ctx.fill();
    }

    if (!hasLight) {
      this.ctx.restore();
      return;
    }
    // this.config.groundCircleAnimationTemp = this.config.groundCircleAnimationFlag ? this.config.groundCircleAnimationTemp + 1 : this.config.groundCircleAnimationTemp - 1;
    const max = 20;
    if (
      new Date().getTime() - this.config.groundCircleAnimationTimer >
      this.config.groundCircleAnimationTime
    ) {
      this.config.groundCircleAnimationTimer = new Date().getTime();
      for (let i = 0; i < this.config.groundCircleExpand.length; i++) {
        if (this.config.groundCircleExpand[i].temp > max) {
          this.config.groundCircleExpand.splice(i, 1);
          i--;
        }
      }
    }

    this.ctx.restore();
  }
  /**
   绘制针头
   pointS 开始点 非必须
   pointE 结束点
   config 自定义配置 lineWidth color radius borderRadius
   **/
  circleLine(pointE, config, pointS) {
    const width = config.lineWidth;
    const color = config.color;
    const radius = config.radius;
    const borderRadius = config.borderRadius;
    const opcity = config.opcity;
    if (pointS) {
      this.ctx.beginPath();
      this.ctx.moveTo(pointS.x - width / 2, pointS.y);
      this.ctx.lineTo(pointE.x - width / 2, pointE.y + radius);
      this.ctx.lineTo(pointE.x + width / 2, pointE.y + radius);
      this.ctx.lineTo(pointS.x + width / 2, pointS.y);
      const lingrad = this.ctx.createLinearGradient(
        pointS.x,
        pointS.y,
        pointE.x,
        pointE.y
      );
      lingrad.addColorStop(1, "rgba(" + color + "," + opcity + ")");
      lingrad.addColorStop(0, "rgba(" + color + ",0)");
      this.ctx.fillStyle = lingrad;
      this.ctx.fill();
    }
    if (radius) {
      this.ctx.beginPath();
      this.ctx.fillStyle = "rgba(" + color + "," + opcity + ")";
      this.ctx.arc(pointE.x, pointE.y, radius, 0, (Math.PI / 180) * 360);
      this.ctx.fill();
    }
    if (borderRadius) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = "rgba(" + color + "," + opcity + ")";
      this.ctx.arc(pointE.x, pointE.y, borderRadius, 0, (Math.PI / 180) * 360);
      this.ctx.stroke();
    }
  }
  /**
   中心圈
   **/
  animationBackgroundCenter() {
    const color = "9, 68, 128";
    const colorO = [9, 68, 128];
    const w = this.config.groundCircleCenterPoint[0];
    const h = this.config.groundCircleCenterPoint[1];
    const radiusx = this.config.groundCircleCenterRadius;
    const radiusy = this.config.groundCircleCenterRadius * 1.2;
    // 小圈
    this.circle(
      w,
      h,
      w * radiusx * 0.5,
      h * radiusy * 0.65,
      color,
      false,
      true,
      0.6,
      true
    );
    this.circle(
      w,
      h + this.dom.clientHeight * 0.075,
      w * radiusx * 0.45,
      h * radiusy * 0.6,
      color,
      false,
      false,
      0.3
    );
    this.circle(
      w,
      h + this.dom.clientHeight * 0.15,
      w * radiusx * 0.4,
      h * radiusy * 0.55,
      "255, 127, 39",
      false,
      false,
      0.1
    );
    // 中圈
    this.circle(
      w,
      h + radiusy * 10,
      w * radiusx * 0.7,
      h * radiusy * 0.9,
      color,
      false,
      false,
      0.8,
      false
    );
    let hex = this.getDarkColor(
      this.RgbToHex(colorO[0], colorO[1], colorO[2]),
      0.5
    );
    this.circle(
      w,
      h + radiusy * 20,
      w * radiusx * 0.69,
      h * radiusy * 0.89,
      this.HexToRgb(hex).join(","),
      false,
      false,
      0.1,
      true
    );
    this.circle(
      w,
      h + radiusy * 30,
      w * radiusx * 0.69,
      h * radiusy * 0.89,
      this.HexToRgb(hex).join(","),
      false,
      false,
      0.1,
      true
    );
    this.circle(
      w,
      h + radiusy * 40,
      w * radiusx * 0.69,
      h * radiusy * 0.89,
      this.HexToRgb(hex).join(","),
      false,
      false,
      0.1,
      true
    );
    this.circle(
      w,
      h + radiusy * 50,
      w * radiusx * 0.69,
      h * radiusy * 0.89,
      this.HexToRgb(hex).join(","),
      false,
      false,
      0.1,
      true
    );
    hex = this.getDarkColor(this.RgbToHex(255, 127, 39), 0.5);
    this.circle(
      w,
      h + radiusy * 60,
      w * radiusx * 0.7,
      h * radiusy * 0.9,
      this.HexToRgb(hex).join(","),
      false,
      false,
      0.2,
      true
    );
    // 大圈
    this.circle(
      w,
      h + radiusy * 80,
      w * radiusx,
      h * radiusy * 1.3,
      color,
      false,
      false,
      0.2,
      false
    );
    // this.config.groundCircleAnimationTemp ++;
    // if (
    //   new Date().getTime() - this.config.groundCircleAnimationTimer >
    //   this.config.groundCircleAnimationTime
    // ) {
    //   this.config.groundCircleAnimationTimer = new Date().getTime();
    //   this.config.groundCircleExpand.push({
    //     p: {
    //       rootxr: parseInt(w * radiusx * 1),
    //       rootyr: parseInt(h * radiusy * 1.3),
    //       w: w,
    //       h: h + radiusy * 80,
    //       xr: parseInt(w * radiusx * 1),
    //       yr: parseInt(h * radiusy * 1.3),
    //       color: color // "17, 26, 86"//
    //     },
    //     temp: 0
    //   });
    // }
    // this.CircleExpand();
    // this.config.groundCircleExpand.push()
    // this.circle(w,h+radiusy * 80,w*radiusx*.7 + this.config.groundCircleAnimationTemp,h*radiusy*.9 + this.config.groundCircleAnimationTemp * 1,color,true,true,0,false)
    // TODO 圆的外扩动效
  }
  CircleExpand() {
    const o = this.config.groundCircleAnimationTemp;
    for (let i = 0; i < this.config.groundCircleExpand.length; i++) {
      const opt = this.config.groundCircleExpand[i];
      opt.temp++;
      opt.p.xr += this.config.groundCircleAnimationSpeed;
      opt.p.yr += this.config.groundCircleAnimationSpeed * 0.6;
      if (opt.temp > o * 0.9) {
        this.config.groundCircleExpand.splice(i, 1);
        i--;
        continue;
      }
      this.circle(
        opt.p.w,
        opt.p.h,
        opt.p.xr,
        opt.p.yr,
        opt.p.color,
        true,
        false,
        (o - opt.temp) / o,
        false,
        opt.p.rootxr,
        opt.p.rootyr
      );
    }
  }
  /**
   动效
   背景层流线
   **/
  animationBackground() {
    // const h = 100;
    this.ctx.lineCap = "round";
    let flag = false;
    let x = 0;
    let point = {};
    let speedx = 0;
    for (let i = 0; i < this.config.tempLine.length; i++) {
      this.config.tempLine[i].y += this.config.groundLineSpeed;
      x = this.config.tempLine[i].x;
      point = {
        x: this.config.tempLine[i].x,
        y: this.dom.clientHeight - this.config.tempLine[i].y
      };
      speedx =
        Math.abs(point.x - this.dom.clientWidth / 2) /
        ((this.config.deep - this.config.tempLine[i].y) /
          this.config.groundLineSpeed);
      flag = x < this.dom.clientWidth / 2;
      this.config.tempLine[i].x = flag ? x + speedx : x - speedx;
      if (
        this.config.tempLine[i].y - this.dom.clientHeight >
        this.config.tempLine[i].h
      ) {
        this.config.tempLine.splice(i, 1);
        i--;
        continue;
      }
      const p = this.calLine(
        this.config.deep,
        this.config.tempLine[i].y,
        point
      );
      let pe = p;
      if (this.config.tempLine[i].y - this.config.tempLine[i].h > 0) {
        pe = this.calLine(
          this.config.deep,
          this.config.tempLine[i].y - this.config.tempLine[i].h,
          p,
          true
        );
      }
      this.ctx.beginPath();
      this.ctx.lineWidth = this.config.tempLine[i].width;
      this.ctx.moveTo(point.x, point.y);
      this.ctx.lineTo(pe.x, pe.y);
      const color = "5, 28, 60";
      const lingrad = this.ctx.createLinearGradient(
        pe.x,
        point.y - 10,
        pe.x,
        pe.y + 10
      );
      lingrad.addColorStop(1, "rgba(" + color + ",0)");
      lingrad.addColorStop(1, "rgba(31, 68, 117,.3)");
      lingrad.addColorStop(0.5, "rgba(53, 88, 125,.5)");
      lingrad.addColorStop(0, "rgba(31, 68, 117,.3)");
      lingrad.addColorStop(0, "rgba(" + color + ",0)");
      this.ctx.strokeStyle = lingrad;
      this.ctx.stroke();
      // TODO 修改stroke为fill路径 否则线条粗度一致不理想
    }
    this.ctx.lineWidth = 1;
  }
  // 数据梳理
  drawData() {}
  // 弯折线计算
  tan(angle, w) {
    return Math.tan((Math.PI / 180) * this.config.angle) * w;
  }
  // 计算深度
  /**
   HEIGHT 高度 常量
   DEEP 总深度 自定义参数
   DIRECT 方向 true 则为反向计算 fasle 正向计算
   point 活动计算点 {x,y}
   **/
  calLine(HEIGHT, DEEP, point, DIRECT) {
    const pw = Math.abs(point.x - this.dom.clientWidth / 2);
    const mw = pw / (HEIGHT / DEEP);
    const state = point.x - this.dom.clientWidth / 2 >= 0;
    const center = this.dom.clientWidth / 2;
    const w = DIRECT
      ? pw - mw
      : Math.abs(point.x - this.dom.clientWidth / 2) /
          ((HEIGHT - DEEP) / DEEP) +
        Math.abs(point.x - this.dom.clientWidth / 2);
    return {
      x: state ? center + w : center - w,
      y: DIRECT ? this.dom.clientHeight - DEEP : this.dom.clientHeight
    };
  }
}
Tool.instance = function(dom, config) {
  return new Tool(dom, config);
};
export default Tool;
