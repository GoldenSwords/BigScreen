<template>
  <el-color-picker
    :disabled="option.disabled"
    v-model="color"
    :color-format="option.colorFormat"
    size="mini"
    :predefine="option.predefine"
    :show-alpha="option.showAlpha"
    @change="change"
  ></el-color-picker>
</template>

<script>
export default {
  name: "LColor",
  props: {
    option: Object
  },
  watch: {
    option(val) {
      this.color = val.value;
    }
  },
  beforeMount() {
    this.color = this.option.value;
  },
  mounted() {},
  methods: {
    change(val) {
      const vals = JSON.parse(JSON.stringify(this.option));
      vals.value = val;
      this.$emit("callback", vals);
    }
  },
  data() {
    return {
      color: ""
    };
  }
};
</script>

<style scoped></style>
