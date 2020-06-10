<template>
  <div
    style="position: absolute;"
    :style="{
      left: optionformat.moveOption.x + 'px',
      top: optionformat.moveOption.y + 'px',
      width: optionformat.moveOption.width + 'px',
      height: optionformat.moveOption.height + 'px',
      backgroundImage: optionformat.moveOption.url
        ? 'url(' + optionformat.moveOption.url + ')'
        : '',
      backgroundSize: '100% 100%',
      backgroundColor: optionformat.moveOption.color
        ? optionformat.moveOption.color
        : ''
    }"
  >
    <div
      style="width: 100%;height: 100%;position: absolute;z-index: 10;"
      @click.stop.prevent="click"
      @contextmenu.stop.prevent="contextmenu"
    ></div>
    <component ref="comp" :is="comp" :opt="optionformat"></component>
  </div>
</template>

<script>
/**
 * option 组件对象
 * mode
 *      编辑模式 manage
 *      预览模式 view
 **/
export default {
  name: "ComponetView",
  props: {
    uuid: String,
    obj: Object,
    option: Array,
    optionformat: Object,
    comp: Object,
    mode: {
      type: String,
      default: "manage"
    }
  },
  watch: {
    optionformat() {
      if (this.$refs.comp.updateComponent) {
        setTimeout(() => {
          this.$refs.comp.updateComponent();
        }, 1000);
      }
    }
  },
  data() {
    return {};
  },
  beforeMount() {
    console.log(this.obj, this.option);
  },
  methods: {
    click(e) {
      this.$emit("clickCallback", e, this.option, this.comp, this.uuid);
    },
    contextmenu(e) {
      this.$emit("contextmenuCallback", e, this.option, this.comp, this.uuid);
    }
  }
};
</script>

<style scoped></style>
