<template>
  <el-input
    style="width: 100%;"
    v-model="number"
    :autosize="option.autosize"
    :rows="option.rows"
    :show-word-limit="option.showWordLimit"
    :maxlength="option.max"
    :minlength="option.min"
    :disabled="option.disabled"
    :placeholder="option.placeholder"
    type="textarea"
    @change="change"
    size="mini"
  ></el-input>
</template>

<script>
export default {
  name: "LTextarea",
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
      this.number = JSON.stringify(val.value);
    }
  },
  beforeMount() {
    this.number = JSON.stringify(this.option.value);
  },
  mounted() {},
  methods: {
    change(val) {
      try {
        const vals = JSON.parse(JSON.stringify(this.option));
        vals.value = JSON.parse(val);
        this.$emit("callback", vals);
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
