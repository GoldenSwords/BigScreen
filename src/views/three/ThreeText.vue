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
      var loader = new THREE.FontLoader();
      loader.load(
        // require("../../../node_modules/three/examples/fonts/droid/droid_sans_bold.typeface.json"),
        require("../../../public/helvetiker_regular.typeface.json"),
        function(font) {
          var xMid, text;
          var color = 0x006699;
          var matDark = new THREE.LineBasicMaterial({
            color: color,
            side: THREE.DoubleSide
          });
          var matLite = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
          });
          var message = "   Three.js\nSimple text.";
          let shape = null;
          const shapes = font.generateShapes(message, 100);
          let geometry = new THREE.ShapeBufferGeometry(shapes);
          geometry.computeBoundingBox();
          xMid =
            -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
          geometry.translate(xMid, 0, 0);
          // make shape ( N.B. edge view not visible )
          text = new THREE.Mesh(geometry, matLite);
          text.position.z = -150;
          this.scene.add(text);
          // make line shape ( N.B. edge view remains visible )
          var holeShapes = [];
          for (var i = 0; i < shapes.length; i++) {
            shape = shapes[i];
            if (shape.holes && shape.holes.length > 0) {
              for (var j = 0; j < shape.holes.length; j++) {
                var hole = shape.holes[j];
                holeShapes.push(hole);
              }
            }
          }
          shapes.push.apply(shapes, holeShapes);
          var lineText = new THREE.Object3D();
          for (let i = 0; i < shapes.length; i++) {
            shape = shapes[i];
            const points = shape.getPoints();
            geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.translate(xMid, 0, 0);
            const lineMesh = new THREE.Line(geometry, matDark);
            lineText.add(lineMesh);
          }
          this.scene.add(lineText);
        }
      ); //end load function
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
