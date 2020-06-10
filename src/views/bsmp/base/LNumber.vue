<template>
  <el-input-number
    style="width: 100%;"
    v-model="number"
    :disabled="option.disabled"
    :min="option.min"
    :max="option.max"
    :step="option.step"
    :step-strictly="option.stepStrictly"
    :controls="option.controls"
    :controls-position="option.controlsPosition"
    :placeholder="option.placeholder"
    @change="change"
    size="mini"
    label="描述文字"
  ></el-input-number>
</template>

<script>
export default {
  name: "LNumber",
  props: {
    option: Object
  },
  data() {
    return {
      number: 0
    };
  },
  watch: {
    option(val) {
      this.number = val.value;
    }
  },
  beforeMount() {
    this.number = this.option.value;
  },
  mounted() {},
  methods: {
    change(val) {
      const vals = JSON.parse(JSON.stringify(this.option));
      vals.value = val;
      this.$emit("callback", vals);
    }
  }
};
</script>

<style scoped></style>
