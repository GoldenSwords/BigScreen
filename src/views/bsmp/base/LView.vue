<template>
  <component
    :is="componentObj"
    :option="optionTemp"
    @callback="callback"
  ></component>
</template>

<script>
import { registerComp } from "@/plugins/util/util";
export default {
  name: "LView",
  props: {
    row: Object,
    option: Object,
    componentPath: String
  },
  data() {
    return {
      optionTemp: null,
      componentObj: null
    };
  },
  watch: {
    option(val) {
      this.optionTemp = JSON.parse(JSON.stringify(val));
    },
    componentPath(val) {
      const names = val.split("/");
      registerComp(names[names.length - 1], val, obj => {
        this.componentObj = obj.default;
      });
    }
  },
  beforeMount() {
    this.optionTemp = JSON.parse(JSON.stringify(this.option));
    const names = this.componentPath.split("/");
    registerComp(names[names.length - 1], this.componentPath, obj => {
      this.componentObj = obj.default;
    });
  },
  computed: {
    formatValue() {
      const val = {};
      if (this.row) {
        val[this.row.key] = this.optionTemp.value;
      }
      return val;
    }
  },
  methods: {
    callback(val) {
      this.optionTemp = val;
      this.$emit("callback", this.optionTemp);
    }
  }
};
</script>

<style scoped></style>
