<template>
  <div style="width: 100%;height: 100%">
    <canvas
      ref="canvas"
      style="display: block;width: 100%; height: 100%;"
    ></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import CanvasRenderer from 'three/examples/js/renderers/CanvasRenderer'
export default {
  name: "ThreeEarth",
  data() {
    return {
      earthImg: require("../../assets/earth.jpg"),
      cloudsImg: require("../../assets/clouds.jpg"),
      scene: null,
      light: null,
      camera: null,
      width: null,
      height: null,
      earthMesh: null,
      cloudsMesh: null,
      controls: null
    };
  },
  mounted() {
    this.initThree();
    this.initCamera();
    this.initScene();
    this.initLight();
    this.initEarth();
    this.initClouds();
    this.animate();
  },
  methods: {
    initClouds() {
      // 实例化一个球体，半径要比地球的大一点，从而实现云飘咋地球上的感觉
      const cloudsGeo = new THREE.SphereGeometry(201, 100, 100);
      // transparent 与 opacity 搭配使用，设置材质的透明度，当 transparent 设为 true 时， 会对材质特殊处理，对性能会有些损耗。
      const cloudsMater = new THREE.MeshPhongMaterial({
        alphaMap: new THREE.TextureLoader().load(this.cloudsImg),
        transparent: true,
        opacity: 0.2
      });

      this.cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMater);
      this.scene.add(this.cloudsMesh);
    },
    animate() {
      this.controls.update();
      // 地球自转
      this.earthMesh.rotation.y -= 0.002;
      // 漂浮的云层
      this.cloudsMesh.rotation.y -= 0.005;
      this.cloudsMesh.rotation.z += 0.005;
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(this.animate);
    },
    initThree() {
      this.width = this.$refs.canvas.clientWidth;
      this.height = this.$refs.canvas.clientHeight;
      this.$refs.canvas.width = this.$refs.canvas.clientWidth;
      this.height = this.$refs.canvas.height = this.$refs.canvas.clientHeight;
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: this.$refs.canvas,
        context: this.$refs.canvas.getContext("webgl2")
      });
      this.renderer.setClearColor(0xffffff);
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.width / this.height,
        1,
        10000
      );
      this.camera.position.x = -500;
      this.camera.position.y = 500;
      this.camera.position.z = -500;
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },
    initScene() {
      this.scene = new THREE.Scene();
    },
    initLight() {
      // A light source positioned directly above the scene, with color fading from the sky color to the ground color.
      // 位于场景正上方的光源，颜色从天空颜色渐变为地面颜色。
      //  var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
      // scene.add(light);

      // 环境光
      this.light = new THREE.AmbientLight(0xffffff);
      this.light.position.set(100, 100, 200);
      this.scene.add(this.light);

      // 平行光
      // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
      // light = new THREE.DirectionalLight(0xffffbb, 1);
      // light.position.set(-1, 1, 1);
      // scene.add(light);
    },
    initEarth() {
      // 实例化一个半径为 200 的球体
      const earthGeo = new THREE.SphereGeometry(200, 100, 100);
      const earthMater = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(this.earthImg)
      });
      this.earthMesh = new THREE.Mesh(earthGeo, earthMater);
      this.scene.add(this.earthMesh);
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.animate);
    this.renderer.dispose();
  }
};
</script>

<style scoped></style>
