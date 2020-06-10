class DragBox {
  /**
   * 拖拽按钮 dragBar:[{x:100,y:100,group:['left','top','middle']}]
   * 拖拽模式 dragMode: view / edit / hover
   * CSS驼峰语法 css: {...}
   * */
  constructor(dom, opt) {
    this.defaultOp = {
      width: "10px",
      display: `none`,
      height: "10px",
      cursor: "crosshair",
      boxSizing: "border-box",
      userSelect: "none",
      backgroundColor: "#Fff",
      border: "1px solid black"
    };
    this.widthTooltipBox = {
      transform: `translateY(-50%) translateX(-50%)`,
      display: `block`,
      position: `absolute`,
      borderTop: `1px dashed blue`,
      left: `0px`,
      boxSizing: `border-box`,
      top: `0px`,
      lineHeight: `0`,
      background: `#fff`
    };
    this.heightTooltipBox = {
      borderLeft: `1px dashed blue`,
      position: `absolute`,
      left: `0px`,
      boxSizing: `border-box`,
      top: `0px`,
      lineHeight: `0`,
      background: `#fff`
    };
    this.spanBox = {
      transform: `translateY(-50%) translateX(-50%)`,
      display: `block`,
      left: "50%",
      top: "50%",
      position: `absolute`,
      lineHeight: `20px`,
      fontSize: `12px`,
      textAlign: `center`,
      padding: `0 5px`,
      background: "#fff",
      color: "orange"
    };
    this.whBox = {
      position: `absolute`,
      top: `200px`,
      width: `200px`,
      textAlign: `center`,
      fontSize: `12px`,
      lineHeight: `36px`,
      display: `inline-block`,
      color: `orange`
    };
    this.container = opt.container;
    this.mask = opt.mask;
    this.left = document.createElement("div");
    this.top = document.createElement("div");
    this.wh = document.createElement("div");
    this.spanBoxDom = document.createElement("div");
    this.doCss(this.spanBoxDom, this.spanBox);
    this.dom = dom;
    this.root = dom.parentNode;
    const {
      updateCallback,
      dragBar = [],
      dragMode = "view",
      domCss = {},
      containerCss = {},
      parent,
      drop,
      resize
    } = opt;
    this.opt = {
      updateCallback,
      resize,
      drop,
      parent,
      dragBar,
      dragMode,
      domCss,
      containerCss
    };
    this.local = {
      status: {
        bar: false,
        container: false
      },
      resizeStatus: false,
      left: 0,
      top: 0,
      clickPositon: { x: 0, y: 0 },
      moveOffset: { x: 0, y: 0 },
      dragMode: false,
      resizeMode: false,
      resizeTarget: null
    };
    this.doInit();
    if (this.opt.dragMode === "edit") {
      this.bindEvent();
    }
  }
  togglePlaceholder() {
    this.wh.style.display = this.left.style.display = this.top.style.display =
      this.top.style.display === "block" ? "none" : "block";
  }
  showPlacehoder() {
    this.wh.style.display = this.left.style.display = this.top.style.display =
      "block";
  }
  hidePlacehoder() {
    this.wh.style.display = this.left.style.display = this.top.style.display =
      "none";
  }
  hideBar(type) {
    this.local.status[type] = false;
    if (
      !this.local.status.bar &&
      !this.local.status.container &&
      !this.local.dragMode &&
      !this.local.resizeMode
    ) {
      this.opt.dragBar.forEach(i => {
        i.dom.style.display = "none";
      });
    }
  }
  showBar(type) {
    this.local.status[type] = true;
    if (this.local.status.bar || this.local.status.container) {
      this.opt.dragBar.forEach(i => {
        i.dom.style.display = "block";
      });
    }
  }
  bindEvent() {
    //
    this.container.addEventListener("mouseover", () => {
      this.container.style.cursor = "pointer";
      this.showBar("container");
    });
    this.container.addEventListener("mouseout", () => {
      this.container.style.cursor = "default";
      this.hideBar("container");
    });
    this.container.addEventListener("drop", ev => {
      ev.preventDefault();
      if (typeof this.opt.drop === "function") {
        this.opt.drop(JSON.parse(ev.dataTransfer.getData("Text")));
      }
    });
    this.container.addEventListener("dragover", ev => {
      ev.preventDefault();
    });
    this.container.addEventListener("mousedown", ev => {
      if (ev.target === this.container || ev.target === this.mask) {
        this.local.clickPositon = {
          x: Number(this.dom.style.left.replace("px", "")),
          y: Number(this.dom.style.top.replace("px", "")),
          clientX: ev.clientX,
          clientY: ev.clientY
        };
        this.local.dragMode = true;
        this.local.resizeMode = false;
        this.showPlacehoder();
      }
    });
    document.addEventListener("mouseup", ev => {
      this.local.dragMode = false;
      this.local.resizeMode = false;
      this.local.moveOffset = {
        clientX: ev.clientX,
        clientY: ev.clientY
      };
      if (this.local.dragMode) {
        this.movingDom();
      } else if (this.local.resizeMode) {
        this.resize();
      }
      this.hidePlacehoder();
      if (this.local.resizeStatus) {
        this.local.resizeStatus = false;
        if (typeof this.opt.resize === "function") {
          this.opt.resize(
            Number(this.container.style.width.replace("px", "")),
            Number(this.container.style.height.replace("px", ""))
          );
        }
      }
      const bars = this.opt.dragBar.map(i => i);
      bars.forEach(i => {
        return {
          left: i.dom.style.left.replace("px", ""),
          top: i.dom.style.top.replace("px", ""),
          group: i.group
        };
      });
      const cccs = {
        width: this.container.style.width,
        height: this.container.style.height,
        left: this.container.style.left,
        top: this.container.style.top
      };
      const containerCss = this.opt.containerCss;
      for (const i in cccs) {
        containerCss[i] = cccs[i];
      }
      const dcss = {
        width: this.dom.style.width,
        height: this.dom.style.height,
        left: this.dom.style.left,
        top: this.dom.style.top
      };
      const domCss = this.opt.domCss;
      for (const i in dcss) {
        domCss[i] = dcss[i];
      }
      this.opt.updateCallback({
        dragBar: bars,
        containerCss: containerCss,
        domCss: domCss
      });
    });
    this.root.addEventListener("mousemove", ev => {
      this.local.moveOffset = {
        clientX: ev.clientX,
        clientY: ev.clientY
      };
      if (this.local.dragMode) {
        //拖拽模式
        this.movingDom();
      } else if (this.local.resizeMode) {
        //尺寸模式
        this.resize();
      }
    });

    // dragbar
    this.opt.dragBar.forEach((i, index) => {
      if (i.dom) {
        i.dom.__index = index;
        i.dom.addEventListener("mouseout", () => {
          this.hideBar("bar");
        });
        i.dom.addEventListener("mouseover", () => {
          this.showBar("bar");
        });
        i.dom.addEventListener("mousedown", ev => {
          this.local.resizeMode = true;
          this.local.dragMode = false;
          this.local.resizeTarget = i;
          this.local.clickPositon = {
            x: Number(i.dom.style.left.replace("px", "")),
            y: Number(i.dom.style.top.replace("px", "")),
            clientX: ev.clientX,
            clientY: ev.clientY
          };
          // const tt = this.opt.dragBar[ev.target.__index];
          // tt.left = Number(tt.dom.style.left.replace("px", ""));
          // tt.top = Number(tt.dom.style.top.replace("px", ""));
          this.showPlacehoder();
        });
      }
    });
  }
  resize() {
    this.local.resizeTarget.dom.style.left = `${this.local.clickPositon.x +
      this.local.moveOffset.clientX -
      this.local.clickPositon.clientX}px`;
    this.local.resizeTarget.dom.style.top = `${this.local.clickPositon.y +
      this.local.moveOffset.clientY -
      this.local.clickPositon.clientY}px`;
    this.resizeByGroup(this.local.resizeTarget);
    this.resizeContainer();
  }
  resizeContainer() {
    const map = this.opt.dragBar.map(i => i);
    // 更改容器
    let left = this.calcMaxMin(
      map,
      i => Number(i.dom.style.left.replace("px", "")),
      "min"
    );
    let right = this.calcMaxMin(
      map,
      i => Number(i.dom.style.left.replace("px", "")),
      "max"
    );
    let bottom = this.calcMaxMin(
      map,
      i => Number(i.dom.style.top.replace("px", "")),
      "max"
    );
    let top = this.calcMaxMin(
      map,
      i => Number(i.dom.style.top.replace("px", "")),
      "min"
    );
    this.container.style.left = `${left}px`;
    this.container.style.top = `${top}px`;
    this.container.style.width = `${right - left}px`;
    this.container.style.height = `${bottom - top}px`;
    this.appendPlaceHolder("top", top, left);
    this.appendPlaceHolder("left", left, top, true);
    this.wh.style.top = `${bottom}px`;
    this.wh.style.width = `${right - left}px`;
    const node = document.createTextNode(
      `高:${bottom - top}px 宽:${right - left}px`
    );
    if (this.wh.childNodes && this.wh.childNodes.length > 0) {
      this.wh.removeChild(this.wh.childNodes[0]);
    }
    this.wh.appendChild(node);
  }
  appendPlaceHolder(key, val, val2) {
    this.showPlacehoder();
    const dom = this.dom.style;
    const keyset = key === "top" ? "height" : "width";
    const domV = Number(dom[key].replace("px", ""));
    this[key].style[keyset] = `${domV + val}px`;
    this[key].style.left =
      key === "top" ? `${val2}px` : `${val - (domV + val) / 2}px`;
    this[key].style.top = key === "top" ? `${-domV}px` : `${val2}px`;
    this.local[key] = `${domV + val}px`;
    const node = this.spanBoxDom.cloneNode(true);
    node.appendChild(document.createTextNode(this.local[key]));
    if (this[key].childNodes && this[key].childNodes.length > 0) {
      this[key].removeChild(this[key].childNodes[0]);
    }
    this[key].appendChild(node);
    this.local.resizeStatus = true;
  }
  calcMaxMin(data, format, key) {
    let v = key === "max" ? -99999999 : 99999999;
    data
      .map(i => i)
      .forEach(i => {
        v =
          key === "max"
            ? Number(format(i)) > v
              ? Number(format(i))
              : v
            : Number(format(i)) < v
            ? Number(format(i))
            : v;
      });
    return v;
  }
  resizeByGroup(target) {
    const groupstr = target.group.map(i => JSON.stringify(i));
    const gb = target.group.map(i => i);
    const key = target._index;
    if (groupstr) {
      groupstr.forEach((i, index) => {
        for (let j = 0; j < this.opt.dragBar.length; j++) {
          const ob = this.opt.dragBar[j];
          const tars = this.opt.dragBar[key];
          const px = tars.dom.style[gb[index].groupKey];
          if (j !== key && ob.group.map(i => JSON.stringify(i)).includes(i)) {
            ob.dom.style[gb[index].groupKey] = px;
            ob[gb[index].groupKey] = px.replace("px", "");
            tars[gb[index].groupKey] = px.replace("px", "");
          }
        }
      });
    }
  }
  destory() {}
  movingDom() {
    this.dom.style.left = `${this.local.clickPositon.x +
      this.local.moveOffset.clientX -
      this.local.clickPositon.clientX}px`;
    this.dom.style.top = `${this.local.clickPositon.y +
      this.local.moveOffset.clientY -
      this.local.clickPositon.clientY}px`;
    this.resizeContainer();
  }
  doCss(dom, css, no, only) {
    for (const j in css) {
      if (
        (only &&
          no &&
          no.length > 0 &&
          only.length > 0 &&
          only.includes(j) &&
          !no.includes(j)) ||
        (only && only.length > 0 && only.includes(j)) ||
        (no && no.length > 0 && !no.includes(j))
      ) {
        dom.style[j.replace(/([A-Z])/g, "-$1").toLowerCase()] = css[j];
      } else if (!no && !only) {
        dom.style[j.replace(/([A-Z])/g, "-$1").toLowerCase()] = css[j];
      }
    }
  }
  doInit() {
    this.dom.style.position = this.container.style.position = this.wh.style.position = this.top.style.position = this.left.style.position = `absolute`;
    this.doCss(this.left, this.widthTooltipBox);
    this.doCss(this.wh, this.whBox);
    this.doCss(this.top, this.heightTooltipBox);
    this.doCss(this.container, this.opt.containerCss);
    this.doCss(this.dom, this.opt.domCss);
    this.dom.appendChild(this.container);
    this.dom.appendChild(this.wh);
    this.dom.appendChild(this.left);
    this.dom.appendChild(this.top);
    this.opt.dragBar.forEach((i, index) => {
      const dom = document.createElement("div");
      dom.style.position = `absolute`;
      this.doCss(dom, this.defaultOp);
      dom.style.left = `${i.left}px`;
      dom.style.top = `${i.top}px`;
      dom.style.transform = `translateX(-50%) translateY(-50%)`;
      i.dom = dom;
      i._index = index;
      this.dom.appendChild(dom);
    });
    this.resizeContainer();
    this.togglePlaceholder();
  }
  static instance(dom, opt) {
    return new DragBox(dom, opt);
  }
}
export default DragBox;
