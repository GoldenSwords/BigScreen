<template>
  <el-input
    style="width: 100%;"
    v-model="number"
    autosize
    :disabled="disabled"
    type="textarea"
    @change="change"
    size="mini"
    label="描述文字"
  ></el-input>
</template>

<script>
export default {
  name: "LTextarea",
  props: {
    value: Object,
    disabled: Boolean,
    option: Object
  },
  data() {
    return {
      number: ""
    };
  },
  watch: {},
  beforeMount() {
    this.number = JSON.stringify(this.value);
  },
  mounted() {},
  methods: {
    change(val) {
      try {
        this.$emit("callback", JSON.parse(val));
      } catch (e) {
        this.$message({
          message: e,
          type: "error"
        });
      }
    }
  }
};
</script>

<style scoped></style>
