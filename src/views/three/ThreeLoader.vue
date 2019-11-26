<template>
  <canvas ref="canvas" style="width: 100%;height: 100%;"></canvas>
</template>

<script>
import * as THREE from "three";
export default {
  name: "ThreeLoader",
  data() {
    return {
      instanceId: null,
      camera: null,
      scene: null,
      renderer: null,
      mess: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.$refs.canvas.clientWidth / this.$refs.canvas.clientHeight,
        1,
        1000
      );
      this.camera.position.z = 400;
      this.scene = new THREE.Scene();
      var texture = new THREE.TextureLoader().load(
        require("../../../public/earth.jpg")
      );
      var geometry = new THREE.BoxBufferGeometry(200, 200, 200);
      var material = new THREE.MeshBasicMaterial({ map: texture });
      this.mesh = new THREE.Mesh(geometry, material);
      this.scene.add(this.mesh);
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: this.$refs.canvas,
        context: this.$refs.canvas.getContext("webgl2")
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(
        this.$refs.canvas.clientWidth,
        this.$refs.canvas.clientHeight
      );
      //
      window.addEventListener("resize", this.onWindowResize, false);
      this.animate();
    },
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
      this.mesh.rotation.x += 0.005;
      this.mesh.rotation.y += 0.01;
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
