<template>
  <contener-inner :menu="'q23'">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
        <el-button style="float: right; padding: 3px 0" type="text"
          >操作按钮</el-button
        >
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{ "列表内容 " + o }}
      </div>
    </el-card>
  </contener-inner>
</template>

<script>
import ContenerInner from "@/system/ContenerInner";
export default {
  name: "RoleConfig",
  components: { ContenerInner }
};
</script>

<style scoped></style>
