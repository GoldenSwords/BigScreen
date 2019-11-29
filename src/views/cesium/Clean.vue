<template>
  <div ref="cesiumContainer"></div>
</template>

<script>
export default {
  name: "Clean",
  mounted: function() {
    //设置静态资源目录
    // buildModuleUr l.setBaseUrl("../public/Cesium/");
    //创建viewer实例
    this.viewer = new this.$Viewer(this.$refs.cesiumContainer);
  },
  data() {
    return {
      viewer: {}
    };
  }
};
</script>

<style scoped></style>
