<template>
  <el-input-number
    style="width: 100%;"
    v-model="number"
    :disabled="disabled"
    @change="change"
    size="mini"
    label="描述文字"
  ></el-input-number>
</template>

<script>
export default {
  name: "LNumber",
  props: {
    value: Number,
    disabled: Boolean,
    option: Object
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
