<template>
  <el-input
    style="width: 100%;"
    v-model="number"
    :disabled="option.disabled"
    :maxlength="option.max"
    :minlength="option.min"
    :placeholder="option.placeholder"
    :show-word-limit="option.showWordLimit"
    @change="change"
    size="mini"
    label="描述文字"
  ></el-input>
</template>

<script>
export default {
  name: "LInput",
  props: {
    option: Object
  },
  data() {
    return {
      number: ""
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
