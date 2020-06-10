<template>
  <div style="font-size: 12px;margin: 10px 0 5px 0;">
    <span style="">{{ option.name }}</span>
    <el-row v-for="(item, index) in option.ops" :key="index">
      <el-col :span="6">
        {{ item.name }}
      </el-col>
      <el-col :span="18">
        <component
          ref="comp"
          size="mini"
          :is="item.type"
          v-model="item.model"
        ></component>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "EditBox",
  props: {
    option: Object
  },
  mounted() {}
};
</script>

<style scoped></style>
