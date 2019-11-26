<template>
  <div
    style="display: block;width: 100%; height: 100%;position: relative;"
    ref="parent"
  >
    <div ref="slider" class="slider"></div>
    <canvas
      ref="canvas"
      style="display: block;width: 100%; height: 100%;"
    ></canvas>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls";
export default {
  name: "ThreeDemo",
  data() {
    return {
      instanceId: null,
      sceneL: null,
      sceneR: null,
      camera: null,
      renderer: null,
      controls: null,
      sliderPos: 0,
      clicked: false,
      slider: null,
      sliderMoved: false,
      rootClient: 240
    };
  },
  mounted() {
    this.sliderPos = this.$refs.canvas.clientWidth / 2;
    this.init();
  },
  methods: {
    init() {
      this.sceneL = new THREE.Scene();
      this.sceneL.background = new THREE.Color(0xff00ff);
      this.sceneR = new THREE.Scene();
      this.sceneR.background = new THREE.Color(0x8fbcd4);
      this.camera = new THREE.PerspectiveCamera(
        35,
        this.$refs.canvas.clientWidth / this.$refs.canvas.clientHeight,
        0.1,
        10
      );
      this.camera.position.set(2, 4, 7);
      this.initMeshes();
      this.initLights();
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: this.$refs.canvas,
        context: this.$refs.canvas.getContext("webgl2")
      });
      this.renderer.setSize(
        this.$refs.canvas.clientWidth,
        this.$refs.canvas.clientHeight
      );
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setScissorTest(true);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.render();
      this.initComparisons();
    },
    initMeshes() {
      // GROUP
      var group = new THREE.Group();
      const geoB = new THREE.BoxBufferGeometry(2, 2, 2);
      const matB = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        opacity: 0.5,
        transparent: true
      });
      const meshB = new THREE.Mesh(geoB, matB);
      group.add(meshB);
      // OBJ
      const geometry = new THREE.EdgesGeometry(geoB, 1);
      const material = new THREE.MeshBasicMaterial({ color: "green" });
      const cube = new THREE.LineSegments(geometry, material);
      group.add(cube);
      // meshB.opacity = 0.5
      // meshB.material.opacity = 0.5
      this.sceneL.add(group);
      const geoA = new THREE.IcosahedronBufferGeometry(1, 0);
      const matA = new THREE.MeshStandardMaterial({ color: 0xff0000 });
      const meshA = new THREE.Mesh(geoA, matA);
      this.sceneR.add(meshA);
    },
    initLights() {
      const light1 = new THREE.DirectionalLight();
      light1.position.set(20, 20, 20);
      this.sceneL.add(light1);
      this.sceneR.add(light1.clone());
      const light2 = new THREE.DirectionalLight();
      light2.position.set(-20, 20, 20);
      this.sceneL.add(light2);
      this.sceneR.add(light2.clone());
    },
    render() {
      this.renderer.setScissor(
        0,
        0,
        this.sliderPos,
        this.$refs.canvas.clientHeight
      );
      this.renderer.render(this.sceneL, this.camera);
      this.renderer.setScissor(
        this.sliderPos,
        0,
        this.$refs.canvas.clientWidth,
        this.$refs.canvas.clientHeight
      );
      this.renderer.render(this.sceneR, this.camera);
      this.instanceId = window.requestAnimationFrame(() => {
        this.render();
      });
    },
    onWindowResize() {
      this.camera.aspect =
        this.$refs.canvas.clientWidth / this.$refs.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(
        this.$refs.canvas.clientWidth,
        this.$refs.canvas.clientHeight
      );
      if (!this.sliderMoved) this.sliderPos = this.$refs.canvas.clientWidth / 2;
    },
    initComparisons() {
      this.slider = this.$refs.slider;
      this.clicked = false;
      this.slider.addEventListener("mousedown", this.slideReady);
      this.$refs.parent.addEventListener("mouseup", this.slideFinish);
      this.$refs.parent.addEventListener("mousemove", this.slideMove);
      this.$refs.parent.addEventListener("mouseout", this.slideFinish);
    },
    slideReady() {
      this.clicked = true;
      this.controls.enabled = false;
    },
    slideFinish() {
      this.clicked = false;
      this.controls.enabled = true;
    },
    slideMove(e) {
      if (!this.clicked) return false;
      this.sliderMoved = true;
      this.sliderPos = e.clientX - this.rootClient;
      // prevent the slider from being positioned outside the window bounds
      if (this.sliderPos < 0) {
        this.sliderPos = 0;
      }
      if (this.sliderPos > this.$refs.canvas.clientWidth) {
        this.sliderPos = this.$refs.canvas.clientWidth;
      }
      this.slider.style.left =
        this.sliderPos - this.slider.offsetWidth / 2 + "px";
      // this.slider.style.left = this.sliderPos + 'px'
    }
  },
  beforeDestroy() {
    if (this.instanceId) {
      window.cancelAnimationFrame(this.instanceId);
    }
  }
};
</script>

<style scoped>
.slider {
  position: absolute;
  cursor: ew-resize;
  width: 40px;
  height: 40px;
  background-color: #2196f3;
  opacity: 0.7;
  border-radius: 50%;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
}
</style>
