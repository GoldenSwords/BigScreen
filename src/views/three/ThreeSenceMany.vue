<template>
  <canvas ref="canvas" style="width: 100%;height: 100%;"></canvas>
</template>

<script>
import * as THREE from "three";
// import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls";
export default {
  name: "ThreeSenceMany",
  data() {
    return {
      messMaterial: [],
      messMesss: [],
      canvas: null,
      scenes: [],
      limit: 40,
      rect: {
        w: 0,
        h: 0
      },
      renderer: null
    };
  },
  mounted() {
    this.rect.w = this.$refs.canvas.clientWidth / 4;
    this.rect.h = this.$refs.canvas.clientHeight / 4;
    this.init();
  },
  methods: {
    init() {
      this.canvas = this.$refs.canvas;
      var g1 = new THREE.BoxBufferGeometry(1, 1, 1);
      var g2 = new THREE.SphereBufferGeometry(0.5, 12, 8);
      var g3 = new THREE.DodecahedronBufferGeometry(0.5);
      var g4 = new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 12);
      var geometries = [g1, g2, g3, g4];
      this.messMesss.push(g1, g2, g3, g4);
      for (let i = 0; i < this.limit; i++) {
        var scene = new THREE.Scene();
        // make a list item
        var camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
        camera.position.z = 2;
        scene.userData.camera = camera;
        // var controls = new OrbitControls(scene.userData.camera);
        // controls.minDistance = 2;
        // controls.maxDistance = 5;
        // controls.enablePan = false;
        // controls.enableZoom = false;
        // scene.userData.controls = controls;
        // add one random mesh to each scene
        var geometry = geometries[(geometries.length * Math.random()) | 0];
        var material = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(Math.random(), 1, 0.75),
          roughness: 0.5,
          metalness: 0,
          flatShading: true
        });
        this.messMaterial.push(material);
        scene.add(new THREE.Mesh(geometry, material));
        scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));
        var light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(1, 1, 1);
        scene.add(light);
        this.scenes.push(scene);
      }
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        context: this.canvas.getContext("webgl2"),
        antialias: true
      });
      this.renderer.setClearColor(0xffffff, 1);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.animate();
    },
    updateSize() {
      var width = this.canvas.clientWidth;
      var height = this.canvas.clientHeight;
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.renderer.setSize(width, height, false);
      }
    },
    animate() {
      this.render();
      this.instanceId = window.requestAnimationFrame(() => {
        this.animate();
      });
    },
    render() {
      const _this = this;
      this.updateSize();
      // this.canvas.style.transform = `translateY(${window.scrollY}px)`;
      this.renderer.setClearColor(0xffffff);
      this.renderer.setScissorTest(false);
      this.renderer.clear();
      this.renderer.setClearColor(0xe0e0e0);
      this.renderer.setScissorTest(true);
      let x = 0;
      let y = 0;
      this.scenes.forEach(scene => {
        // so something moves
        scene.children[0].rotation.y = Date.now() * 0.001;
        // get the element that is a place holder for where we want to
        // draw the scene
        // get its position relative to the page's viewport
        // check if it's offscreen. If so skip it
        // if (
        //   rect.bottom < 0 ||
        //   rect.top > this.renderer.domElement.clientHeight ||
        //   rect.right < 0 ||
        //   rect.left > this.renderer.domElement.clientWidth
        // ) {
        //   return; // it's off screen
        // }
        // set the viewport
        var width = this.rect.w;
        var height = this.rect.h;
        var left = x * width;
        var bottom = y * height;
        _this.renderer.setViewport(left, bottom, width, height);
        _this.renderer.setScissor(left, bottom, width, height);
        var camera = scene.userData.camera;
        //camera.aspect = width / height; // not changing in this example
        //camera.updateProjectionMatrix();
        //scene.userData.controls.update();
        _this.renderer.render(scene, camera);
        x += 1;
        if (left >= this.canvas.clientWidth) {
          x = 0;
          y += 1;
        }
      });
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.instanceId);
    this.scenes.forEach(scene => {
      scene.dispose();
    });
    this.messMaterial.forEach(scene => {
      scene.dispose();
    });
    this.messMesss.forEach(scene => {
      scene.dispose();
    });
    this.scenes.forEach(scene => {
      scene.dispose();
    });
    this.renderer.dispose();
  }
};
</script>

<style scoped></style>
