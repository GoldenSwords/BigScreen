<template>
  <div ref="cesiumContainer"></div>
</template>

<script>
import CesiumControll from "@/plugins/cesium/CesiumControll";
export default {
  name: "Clean",
  data() {
    return {
      Tool: null
    };
  },
  mounted: function() {
    //设置静态资源目录
    // buildModuleUr l.setBaseUrl("../public/Cesium/");
    this.Tool = CesiumControll.instance(this.$refs.cesiumContainer);
  },
  methods: {}
};
</script>

<style scoped></style>
