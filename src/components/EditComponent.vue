<template>
  <div class="eidtBoxComponent">
    <edit-box
      v-for="(item, index) in option"
      :option="item"
      :key="index"
    ></edit-box>
    <el-button @click="confirm">确定</el-button>
  </div>
</template>

<script>
import EditBox from "./EditBox";
export default {
  name: "EditComponent",
  components: { EditBox },
  props: {
    option: Array
  },
  mounted() {},
  methods: {
    confirm() {
      this.$emit("confirm", this.option);
    }
  }
};
</script>

<style scoped></style>
