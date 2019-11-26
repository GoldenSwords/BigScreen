<template>
  <canvas
    ref="canvas"
    style="display: block;width: 100%; height: 100%;"
  ></canvas>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls";
export default {
  name: "ThreeEarth",
  data() {
    return {
      canvas: null,
      scene: null,
      light: null,
      camera: null,
      width: null,
      height: null,
      earthMesh: null,
      cloudsMesh: null,
      controls: null,
      renderer: null,
      cube: null,
      // 3d折线数据
      diversions: [
        [
          [1, 1, 3],
          [1, 2, 3],
          [2, 4, 3]
        ],
        [
          [2, 2, 3],
          [3, 3, 3],
          [5, 1, 3]
        ]
      ],
      material: null // 纹理
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.demoB();
  },
  methods: {
    webglAvailable() {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    },
    demoA() {},
    demoB() {
      const SCREEN_WIDTH = this.canvas.clientWidth;
      const SCREEN_HEIGHT = this.canvas.clientHeight;
      // const VIEW_ANGLE = 45
      // const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
      const NEAR = 0.1;
      const FAR = 20000;
      // RENDERER
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: this.canvas,
        context: this.canvas.getContext("webgl2")
      });
      this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      // SCENE
      this.scene = new THREE.Scene();
      // CAMERA
      // this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR)
      this.camera = new THREE.OrthographicCamera(
        SCREEN_WIDTH / -2,
        SCREEN_WIDTH / 2,
        SCREEN_HEIGHT / 2,
        SCREEN_HEIGHT / -2,
        NEAR,
        FAR
      );
      this.scene.add(this.camera);
      this.camera.position.set(0, -500, 200);
      this.camera.lookAt(this.scene.position);
      // camera.rotation.x = 0.1
      // LIGHT
      var spotLight1 = new THREE.SpotLight("black");
      spotLight1.position.set(-1000, 0, 40);
      // var spotLight2 = new THREE.SpotLight(0xffffff)
      // spotLight2.position.set(400, 400, 400)
      this.scene.add(spotLight1);
      // scene.add(spotLight2)
      // PLANE
      // var geometry = new THREE.PlaneGeometry(600, 300, 1)
      // var material = new THREE.MeshBasicMaterial({ color: 'red' })
      // var cube = new THREE.Mesh(geometry, material)
      // this.scene.add(cube)

      // GROUP
      var group = new THREE.Group();
      // OBJ
      var geometry = new THREE.BoxBufferGeometry(100, 100, 100);
      var material = new THREE.MeshBasicMaterial({
        color: "green",
        opacity: 0.5,
        transparent: true
      });
      var cube = new THREE.Mesh(geometry, material);
      group.add(cube);
      // border
      geometry = new THREE.EdgesGeometry(geometry, 1);
      material = new THREE.LineBasicMaterial({ color: "orange" });
      cube = new THREE.LineSegments(geometry, material);
      group.add(cube);
      group.position.set(-10, 10, 0);
      group.rotation.z = (Math.PI / 180) * 45;
      this.scene.add(group);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.enabled = true

      this.renderer.render(this.scene, this.camera);
      this.animate();
    },
    // 动效
    animate() {
      // this.cube.rotation.x += 0.01
      // this.cube.rotation.y += 0.01
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(this.animate);
    }
  },
  beforeDestroy() {}
};
</script>

<style scoped></style>
