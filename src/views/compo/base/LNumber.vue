<template>
  <el-input-number
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
    obj: Object
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
      this.$emit("callback", val, this.obj);
    }
  }
};
</script>

<style scoped></style>
