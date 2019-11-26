<template>
  <el-input
    v-model="number"
    :disabled="disabled"
    @change="change"
    size="mini"
    label="描述文字"
  ></el-input>
</template>

<script>
export default {
  name: "LInput",
  props: {
    value: String,
    disabled: Boolean
  },
  data() {
    return {
      number: 0
    };
  },
  watch: {},
  beforeMount() {
    this.number = this.value;
  },
  mounted() {},
  methods: {
    change(val) {
      this.$emit("callback", val);
    }
  }
};
</script>

<style scoped></style>
