<template>
  <canvas ref="canvas" style="width: 100%;height: 100%;"></canvas
></template>

<script>
import * as THREE from "three";
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls";
export default {
  name: "ThreeText",
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.$refs.canvas.clientWidth / this.$refs.canvas.clientHeight,
        1,
        10000
      );
      this.camera.position.set(0, -400, 600);
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: this.$refs.canvas,
        context: this.$refs.canvas.getContext("webgl2")
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      var controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(0, 0, 0);
      controls.update();
      window.addEventListener("resize", this.onWindowResize, false);
    }, // end init
    onWindowResize() {
      this.camera.aspect =
        this.$refs.canvas.clientWidth / this.$refs.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.$refs.canvas.clientWidth,
        this.$refs.canvas.clientHeight
      );
    },
    animate() {
      this.renderer.render(this.scene, this.camera);
      this.instanceId = window.requestAnimationFrame(() => {
        this.animate();
      });
    }
  },
  beforeDestroy() {
    if (this.instanceId) {
      window.cancelAnimationFrame(this.instanceId);
    }
  }
};
</script>

<style scoped></style>
