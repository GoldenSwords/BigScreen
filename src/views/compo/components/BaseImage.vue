<template>
  <div
    style="width: 100%;height: 100%;"
    :style="{
      borderRadius: (opt.Option ? opt.Option.borderRadius : 0) + 'px'
    }"
  >
    <img :src="srcData" style="width: 100%;height: 100%;" />
  </div>
</template>

<script>
export default {
  name: "BaseImage",
  props: {
    opt: {
      type: Object,
      default: () => {
        return {};
      }
    },
    src: String,
    srcList: Array,
    option: Object
  },
  watch: {
    opt(val) {
      console.log(val);
    }
  },
  data() {
    return {
      srcData: "http://localhost:8080/favicon.ico",
      time: 0,
      instanceId: null,
      srcIndex: 0
    };
  },
  mounted() {
    console.log(this.opt);
    this.time = new Date().getTime();
    if (this.opt.moveOption) {
      this.srcData = this.opt.moveOption.src;
    }
    if (this.srcList) {
      this.srcData = this.srcList[this.srcIndex];
      this.play();
    }
  },
  methods: {
    play() {
      this.instanceId = window.requestAnimationFrame(() => {
        if (new Date().getTime() - this.time > this.option.playtime) {
          this.time = new Date().getTime();
          this.srcIndex =
            this.srcIndex >= this.srcList.length ? 0 : this.srcIndex + 1;
          this.srcData = this.srcList[this.srcIndex];
        }
        this.play();
      });
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.instanceId);
  }
};
</script>

<style scoped></style>
