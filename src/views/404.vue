<template>
  <div>
    <div>404</div>
    <el-button-group>
      <el-button @click="beforePage" type="default">上一页</el-button>
      <el-button @click="homePage" type="primary">首页</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    beforePage() {
      this.$router.go(-1);
    },
    homePage() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped></style>
