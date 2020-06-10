<template>
  <el-row style="height: 100%;">
    <el-col :span="12" style="text-align: left;height: 100%;">
      <span style="font-size: 20px;font-weight: bold; font-style: italic;"
        >测试专用系统 <span style="color: orange;">V1.0</span></span
      >
    </el-col>
    <el-col :span="10" style="text-align: right;height: 100%;">
      <el-breadcrumb separator="/" style="line-height: 60px;float: right;">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">API</a></el-breadcrumb-item>
        <el-breadcrumb-item
          >帮助<i class="el-icon-s-opportunity"></i
        ></el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="2" style="height: 100%;">
      <el-dropdown style="height: 60px;" @command="handleCommand">
        <el-avatar
          icon="el-icon-user-solid"
          style="margin: 10px 0 0 0;color: rgb(43, 127, 252)"
        ></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="setting">设置</el-dropdown-item>
          <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { loginout } from "@/api/system";
export default {
  name: "VHeader",
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        loginout();
        this.$router.push("/Login");
      }
    }
  }
};
</script>

<style scoped></style>
