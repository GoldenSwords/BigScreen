<template>
  <div
    ref="dragBox"
    :style="{
      width: option.drag ? `100%` : ``,
      height: option.drag ? `100%` : ``
    }"
  >
    <template v-if="!option.drag">
      <div ref="container" class="ccccc">
        <div
          ref="mask"
          style="width: 100%;height: 100%;position: absolute;z-index: 100000;"
          @click="edit"
        ></div>
        <component
          ref="component"
          :is="comp"
          :option="propsData"
          @update="update"
        ></component>
      </div>
    </template>
    <template v-else>
      <div
        v-drag
        ref="container"
        style="width: 100%;height: 100%;border: 1px solid red;box-sizing: border-box;"
      ></div>
    </template>
  </div>
</template>

<script>
import TextComp from "@/components/TextComp";
import EcComp from "@/components/EcComp";
import DragBox from "@/plugins/DragBox";
export default {
  name: "DragBox",
  components: { TextComp, EcComp },
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          child: {},
          drag: false
        };
      }
    }
  },
  data() {
    return {
      editStatus: false,
      DragBox: null,
      comp: "",
      h: 0,
      w: 0,
      propsData: null,
      dragBar: [
        {
          left: 0,
          top: 0,
          group: [
            { groupNmae: "left", groupKey: "left" },
            { groupNmae: "top", groupKey: "top" }
          ]
        },
        {
          left: 200,
          top: 0,
          group: [
            { groupNmae: "right", groupKey: "left" },
            { groupNmae: "top", groupKey: "top" }
          ]
        },
        {
          left: 0,
          top: 200,
          group: [
            { groupNmae: "left", groupKey: "left" },
            { groupNmae: "bottom", groupKey: "top" }
          ]
        },
        {
          left: 200,
          top: 200,
          group: [
            { groupNmae: "right", groupKey: "left" },
            { groupNmae: "bottom", groupKey: "top" }
          ]
        }
      ],
      containerCss: {
        width: "200px",
        height: "200px",
        left: "100px",
        top: "100px",
        userSelect: `none`,
        border: "1px solid red"
      },
      domCss: {
        width: "200px",
        height: "200px",
        left: "0px",
        top: "0px",
        userSelect: `none`
        // border: "1px solid red"
      }
    };
  },
  watch: {
    option() {
      this.w = this.option.w || 200;
      this.h = this.option.h || 200;
      this.dragBar = this.option.dragBar || this.dragBar;
      this.containerCss = this.option.containerCss || this.containerCss;
      this.domCss = this.option.domCss || this.domCss;
    }
  },
  beforeMount() {
    this.comp = this.option.child.id;
    this.propsData = this.option.child.ops;
    this.w = this.option.w || 200;
    this.h = this.option.h || 200;
    this.dragBar = this.option.dragBar || this.dragBar;
    this.containerCss = this.option.containerCss || this.containerCss;
    this.domCss = this.option.domCss || this.domCss;
  },
  mounted() {
    const self = this;
    if (!this.option.drag) {
      this.DragBox = DragBox.instance(this.$refs.dragBox, {
        updateCallback(opt) {
          self.dragBar = opt.dragBar;
          self.containerCss = opt.containerCss;
          self.domCss = opt.domCss;
          if (this.editStatus) {
            self.updateAll();
          }
          // this.editStatus = false;
        },
        resize: (w, h) => {
          this.w = w;
          this.h = h;
          if (this.$refs.component && this.$refs.component.resize) {
            this.$refs.component.resize();
          }
        },
        drop: obj => {
          if (obj.tag) {
            this.comp = obj.tag;
            obj.props.drag = false;
            this.propsData = obj.props;
            this.$emit("dropChild", {
              el: this.$el,
              id: this.comp,
              ops: this.propsData
            });
          }
        },
        container: this.$refs.container,
        mask: this.$refs.mask,
        parent: this.$refs.dragBox.parentNode,
        containerCss: this.containerCss,
        domCss: this.domCss,
        dragMode: "edit",
        dragBar: this.dragBar
      });
    }
  },
  methods: {
    update() {},
    updateAll() {
      const p = JSON.parse(JSON.stringify(this.option));
      p.w = this.w;
      p.h = this.h;
      p.dragBar = this.dragBar;
      p.containerCss = this.containerCss;
      p.domCss = this.domCss;
      this.$emit("update", p, {
        el: this.$el,
        id: "drag-box"
      });
      this.edit();
    },
    edit() {
      if (this.propsData) {
        const p = this.propsData;
        this.$emit("edit", p, {
          el: this.$el,
          id: "drag-box"
        });
      }
    },
    accept(opt) {
      this.propsData = opt;
    }
  }
};
</script>

<style scoped>
.wh {
  position: absolute;
  top: 200px;
  width: 200px;
  text-align: center;
  font-size: 12px;
  line-height: 36px;
  display: inline-block;
  color: orange;
}
.wh span {
  padding: 2px 5px;
  background-color: #8080802e;
  border-radius: 5px;
  border: 2px solid #80808030;
}
</style>
