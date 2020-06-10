<template>
  <el-select
    style="width: 100%;"
    v-model="select"
    multiple
    placeholder="请选择"
    @change="change"
    size="mini"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "LSelect",
  props: {
    value: Number,
    disabled: Boolean,
    option: Object
  },
  data() {
    return {
      select: [],
      options: [
        {
          value: 0,
          label: "静态模式"
        },
        {
          value: 1,
          label: "切换模式"
        },
        {
          value: 2,
          label: "轮播模式"
        }
      ]
    };
  },
  beforeMount() {
    this.select = this.value;
  },
  methods: {
    change(val) {
      this.$emit("callback", val);
    }
  }
};
</script>

<style scoped></style>
