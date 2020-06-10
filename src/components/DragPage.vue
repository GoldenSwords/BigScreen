<template>
  <div style="width: 100%;height: 100%;">
    <el-container style="height: 100%;">
      <el-aside width="200px">
        <div style="width: 100%;height: 100%;" class="box">
          <div class="item" v-for="(item, index) in componentSet" :key="index">
            <component :is="item.id" :option="item.ops"></component>
            <div
              style="user-select:none;position:absolute;bottom: 0;line-height: 20px;font-size: 12px;text-align: center;width: 100%;background-color: rgba(0,0,0,0.2) "
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </el-aside>
      <el-main style="position: relative;">
        <div class="btns">
          <svg class="icon" aria-hidden="true" @click="update">
            <use :xlink:href="`#iconqueren`"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="displayType = 'auto'">
            <use :xlink:href="`#iconquanping_fuzhi`"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click="displayType = 'fill'">
            <use :xlink:href="`#iconquanping3`"></use>
          </svg>
        </div>
        <div
          style="width: 100%;height: 100%;position: relative;overflow: auto;"
          ref="container"
          class="scroll-x scroll-y"
        >
          <div
            style="width: 100%;height: 100%;position: relative;background-image: linear-gradient(90deg, rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%),linear-gradient(rgba(180, 180, 180, 0.15) 10%, rgba(0, 0, 0, 0) 10%);background-size: 10px 10px;"
            :style="{
              width: displayType === 'auto' ? `${wi}px` : '100%',
              height: displayType === 'auto' ? `${hi}px` : '100%',
              transform: `scale(${displayType === 'auto' ? scale : 1})`,
              transformOrigin: '0 0'
            }"
            class="box"
            @dragover="dragover"
            @drop="drop"
          >
            <template v-for="(item, index) in innerComponent">
              <component
                :key="index"
                :is="item.id"
                :option="item.ops"
                @edit="edit"
                @dropChild="dropChild"
                @update="update"
                ref="ref"
              ></component>
            </template>
          </div>
        </div>
      </el-main>
      <el-aside width="200px" v-show="componentEditStatus">
        <div style="width: 100%;height: 100%;" class="box">
          <edit-component :option="option" @confirm="confirm"></edit-component>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import EditComponent from "./EditComponent";
import TextComp from "./TextComp";
import EcComp from "./EcComp";
import DragBox from "./DragBox";
export default {
  name: "DragPage",
  components: { TextComp, DragBox, EcComp, EditComponent },
  beforeMount() {
    this.$store.dispatch("getStorage", this.storageKeySet).then(resp => {
      console.log(resp);
      if (resp && resp.length > 0) {
        this.innerComponent = resp;
      }
    });
  },
  watch: {
    innerComponent(val) {
      this.autoSave(val);
    }
  },
  mounted() {
    this.ri = this.$refs.container.clientWidth;
    this.scale = this.ri / this.wi;
    console.log(this.ri);
  },
  data() {
    return {
      ri: 0,
      wi: 1920,
      hi: 1080,
      scale: 1,
      displayTypeSet: "fill scale",
      displayType: "fill", //
      storageKeySet: "INSTANCE_STORAGE",
      timer: null,
      componentEditStatus: false,
      innerComponent: [],
      componentSet: [
        {
          id: "drag-box",
          name: "容器",
          key: "box",
          ops: {
            drag: true,
            child: {
              id: "text-comp",
              ops: { text: "111", drag: true, size: "1" }
            }
          }
        },
        {
          id: "text-comp",
          name: "文本",
          ops: { text: "111", drag: true, size: "1" }
        },
        {
          id: "ec-comp",
          name: "散点",
          ops: { text: "111", drag: true, size: "1" }
        }
      ],
      // item: { text: "111", drag: true, size: "1" },
      option: [
        {
          name: "系统设置",
          code: "systm",
          ops: [
            {
              name: "背景色",
              model: "red",
              code: "background",
              type: "ElColorPicker",
              showAlpha: true
            }
          ]
        },
        {
          name: "常规设置",
          code: "normal",
          ops: [
            { name: "尺寸", model: "10", code: "size", type: "el-input-number" }
          ]
        },
        {
          name: "数据设置",
          code: "data",
          ops: [
            {
              name: "数据值",
              model: JSON.stringify(["a", "b", "c"]),
              code: "dat",
              type: "el-input"
            }
          ]
        }
      ]
    };
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timer);
  },
  methods: {
    autoSave() {
      // this.timer = requestAnimationFrame(() => {
      console.log(this.innerComponent);
      this.$store.dispatch("setStorage", {
        key: this.storageKeySet,
        value: JSON.stringify(this.innerComponent)
      });
      // })
    },
    dragover(ev) {
      ev.preventDefault();
    },
    drop(ev) {
      ev.preventDefault();
      const obj = JSON.parse(ev.dataTransfer.getData("Text"));
      const current = JSON.parse(JSON.stringify(this.componentSet));
      const target = current.find(i => i.id === obj.tag && i.key === "box");
      if (target) {
        target.ops.drag = false;
        this.innerComponent.push(target);
      }
    },
    confirm(val) {
      const obj = {};
      val.forEach(i => {
        i.ops.forEach(k => {
          obj[k.code] = k.model;
        });
      });
      // el
      this.$refs.ref.forEach((r, index) => {
        if (r.$el === this.activeTarget.el) {
          console.log(this.innerComponent[index]);
          this.innerComponent[index].ops.child.ops = obj;
          this.$set(this.innerComponent, index, this.innerComponent[index]);
          r.accept(obj);
        }
      });
      // this.$refs.ref.accept(obj);
    },
    update() {
      // console.log(comp);
      // this.$refs.ref.forEach((r, index) => {
      //   if (r.$el === els.el) {
      //     this.innerComponent[index].ops = comp;
      //   }
      // });
      this.autoSave();
    },
    dropChild(child) {
      this.$refs.ref.forEach((r, index) => {
        if (r.$el === child.el) {
          delete child.el;
          this.innerComponent[index].ops.child = child;
          this.$set(this.innerComponent, index, this.innerComponent[index]);
        }
      });
    },
    edit(val, el) {
      this.componentEditStatus = true;
      this.activeTarget = el;
      const result = [];
      for (const i in val) {
        try {
          if (typeof val[i] === "object") {
            result.push({
              model: JSON.stringify(val[i]),
              code: i,
              type: "el-input",
              name: "输入值"
            });
          } else {
            const q = JSON.parse(val[i]);
            result.push({
              model: q,
              code: i,
              type:
                typeof q === "number"
                  ? "el-input-number"
                  : typeof q === "boolean"
                  ? "el-switch"
                  : "el-input",
              name: "输入值"
            });
          }
        } catch (e) {
          result.push({
            model: val[i],
            code: i,
            type: "el-input",
            name: "输入值"
          });
        }
      }
      this.option = [
        {
          name: "基本设置",
          code: "option",
          ops: result
        }
      ];
      this.autoSave();
    }
  }
};
</script>

<style scoped>
.item {
  position: relative;
  width: calc(100% - 20px);
  height: 80px;
  margin: 10px;
  box-sizing: border-box;
  box-shadow: inset 0 0 4px #80808061;
}
.box {
  overflow: auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  box-shadow: inset 0 0 4px #80808061;
}
.btns {
  position: absolute;
  bottom: 10px;
  z-index: 10000;
  margin: auto;
  left: 50%;
  transform: translateX(-50%);
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  font-size: 18px;
  margin: 4px;
  cursor: pointer;
  overflow: hidden;
}
.scroll-x::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.scroll-x::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.scroll-x::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}

/*.scroll-y::-webkit-scrollbar {*/
/*!*滚动条整体样式*!*/
/*width: 1px; !*高宽分别对应横竖滚动条的尺寸*!*/
/*height: 4px;*/
/*}*/
/*.scroll-y::-webkit-scrollbar-thumb {*/
/*!*滚动条里面小方块*!*/
/*border-radius: 10px;*/
/*-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
/*background: #535353;*/
/*}*/
/*.scroll-y::-webkit-scrollbar-track {*/
/*!*滚动条里面轨道*!*/
/*-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);*/
/*border-radius: 10px;*/
/*background: #ededed;*/
/*}*/
</style>
