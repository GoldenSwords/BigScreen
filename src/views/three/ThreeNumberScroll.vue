<template>
  <canvas ref="canvas" style="width: 100%;height: 100%;"></canvas>
</template>

<script>
import * as THREE from "three";
export default {
  name: "ThreeCanvas",
  data() {
    return {
      WIDTH: 0,
      HEIGHT: 0,
      instanceId: null,
      camera: null,
      geometry: null,
      material: null,
      scene: null,
      renderer: null,
      mess: null,
      numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      textFont: 100,
      currentNumber: 3,
      textFamily: "Agency FB",
      rotateToAngel: 0,
      rotateAngel: 0,
      rotateSpeed: 1,
      startAngel: 18,
      color: ["black", "blue"]
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.rotateAngel = 360 / this.numbers.length;
      this.rotateToAngel =
        this.numbers.findIndex(item => {
          return item === this.currentNumber;
        }) * this.rotateAngel;
      this.WIDTH = this.$refs.canvas.clientWidth;
      this.HEIGHT = this.$refs.canvas.clientHeight;
      this.camera = new THREE.PerspectiveCamera(
        70,
        this.$refs.canvas.clientWidth / this.$refs.canvas.clientHeight,
        1,
        1000
      );
      this.camera.position.z = 100;
      this.scene = new THREE.Scene();

      this.geometry = new THREE.CylinderBufferGeometry(
        80,
        80,
        100,
        10,
        1,
        true,
        0,
        Math.PI * 2
      );
      const texture = new THREE.CanvasTexture(this.paintText());
      texture.needsUpdate = true;
      this.material = new THREE.MeshBasicMaterial({
        map: texture
      });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.rotation.z = Math.PI / 2;
      this.mesh.rotation.x = (Math.PI / 180) * this.startAngel;
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
      if (
        this.mesh.rotation.x <
        (Math.PI / 180) * (this.rotateToAngel + this.startAngel)
      ) {
        this.mesh.rotation.x += (Math.PI / 180) * this.rotateSpeed;
      }
      this.renderer.render(this.scene, this.camera);
      this.instanceId = window.requestAnimationFrame(() => {
        this.animate();
      });
    },
    paintText() {
      var canvas = document.createElement("canvas");
      canvas.width = this.WIDTH * this.numbers.length;
      canvas.height = this.HEIGHT;
      var ctx = canvas.getContext("2d");
      this.textFont = canvas.height;
      ctx.font = this.textFont + "px " + this.textFamily;
      let textObj = 0;
      if (typeof this.color === "string") {
        ctx.fillStyle = this.color;
      }
      for (let i = 0; i < this.numbers.length; i++) {
        ctx.save();
        ctx.translate(this.WIDTH / 2 + this.WIDTH * i, this.HEIGHT / 2);
        ctx.rotate((Math.PI / 180) * 90);
        textObj = ctx.measureText(this.numbers[i]);
        if (this.color instanceof Array) {
          const LinearGradient = ctx.createLinearGradient(
            -textObj.width / 2,
            -(
              textObj.actualBoundingBoxAscent + textObj.actualBoundingBoxDescent
            ) / 2,
            -textObj.width / 2,
            (textObj.actualBoundingBoxAscent +
              textObj.actualBoundingBoxDescent) /
              2
          );
          for (let i = 0; i < this.color.length; i++) {
            LinearGradient.addColorStop(
              i / (this.color.length - 1),
              this.color[i]
            );
          }
          ctx.fillStyle = LinearGradient;
        }
        ctx.fillText(
          this.numbers[i],
          -textObj.width / 2,
          (textObj.actualBoundingBoxAscent + textObj.actualBoundingBoxDescent) /
            2
        );
        ctx.restore();
      }
      return canvas;
    }
  },
  beforeDestroy() {
    if (this.instanceId) {
      window.cancelAnimationFrame(this.instanceId);
    }
    this.material.dispose();
    this.geometry.dispose();
    this.scene.dispose();
    this.renderer.dispose();
  }
};
</script>

<style scoped></style>
