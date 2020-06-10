<template>
  <div style="width: 100%;height: 100%;display: block;">
    <canvas
      ref="canvas"
      style="width: 100%;height: 100%;display: block;"
    ></canvas>
    <script type="x-shader/x-vertex" id="vertexshader">
      attribute float size;
      attribute vec3 customColor;
      varying vec3 vColor;
      void main() {
      	vColor = customColor;
      	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      	gl_PointSize = size * ( 300.0 / -mvPosition.z );
      	gl_Position = projectionMatrix * mvPosition;
      }
    </script>

    <script type="x-shader/x-fragment" id="fragmentshader">
      uniform vec3 color;
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      void main() {
      	gl_FragColor = vec4( color * vColor, 1.0 );
      	gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
      }
    </script>
  </div>
</template>

<script>
/**
 * 台风3D示例
 * */
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
export default {
  name: "ThreeStorm",
  data() {
    return {
      moveDirect: false,
      png: require("@/assets/spark1.png"),
      flowIndex: 0,
      WIDTH: 0,
      HEIGHT: 0,
      controls: null,
      group: null,
      instanceId: null,
      camera: null,
      geometrys: [],
      materials: [],
      lights: [],
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
    this.WIDTH = this.$refs.canvas.clientWidth;
    this.HEIGHT = this.$refs.canvas.clientHeight;
    const geometry = this.background();
    const vertic = this.vertics(10000, 1000, geometry);
    this.group.add(vertic);
    this.animate(vertic);
  },
  methods: {
    background() {
      // this.camera = new THREE.OrthographicCamera(
      //   -1000,
      //   1000,
      //   1000,
      //   -800,
      //   -1000,
      //   1000
      // );
      this.camera = new THREE.PerspectiveCamera(
        40,
        this.WIDTH / this.HEIGHT,
        1,
        10000
      );
      this.camera.position.z = 2500;
      this.scene = new THREE.Scene();
      this.group = new THREE.Group();
      this.group.add(this.light(350, -350, 500));
      const geometry = new THREE.BoxBufferGeometry(1500, 1000, 900);
      const material = new THREE.LineBasicMaterial({
        color: "red",
        lineWidth: 10
      });
      const edges = new THREE.EdgesGeometry(geometry);
      this.materials.push(geometry);
      this.materials.push(edges);
      this.geometrys.push(material);
      const ls = new THREE.LineSegments(edges, material);
      this.group.add(ls);
      this.group.rotation.x = -(Math.PI / 180) * 75;
      this.group.rotation.z = -(Math.PI / 180) * 30;
      this.scene.add(this.group);
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
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.mouseButtons = {
      //   LEFT: THREE.MOUSE.ROTATE,
      //   MIDDLE: THREE.MOUSE.DOLLY,
      //   RIGHT: THREE.MOUSE.PAN
      // }
      return ls;
    },
    vertics(amount, radius, obj) {
      obj.geometry.computeBoundingBox();
      var box = obj.geometry.boundingBox.clone();
      const vertex = new THREE.Vector3(); //基础粒子对象
      const color = new THREE.Color(0xffffff); //基础颜色对象
      const positions = new Float32Array(amount * 3); //粒子矩阵
      const colors = new Float32Array(amount * 3); //着色矩阵
      const sizes = new Float32Array(amount); //

      for (var i = 0; i < amount; i++) {
        vertex.x = (Math.random() * 2 - 1) * radius;
        vertex.y = (Math.random() * 2 - 1) * radius;
        vertex.z = (Math.random() * 2 - 1) * radius;
        if (!box.containsPoint(vertex)) {
          continue;
        }
        vertex.toArray(positions, i * 3);
        if (vertex.x < 0) {
          color.setHSL(0.5 + 0.1 * (i / amount), 0.7, 0.5);
        } else {
          color.setHSL(0.0 + 0.1 * (i / amount), 0.9, 0.5);
        }
        color.toArray(colors, i * 3);
        sizes[i] = 100;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute(
        "customColor",
        new THREE.BufferAttribute(colors, 3)
      );
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      const material = new THREE.PointsMaterial({
        vertexColors: true,
        uniforms: {
          color: { value: new THREE.Color("red") },
          pointTexture: {
            value: new THREE.TextureLoader().load(this.png)
          }
        },
        vertexShader: document.getElementById("vertexshader").textContent,
        fragmentShader: document.getElementById("fragmentshader").textContent,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      });
      return new THREE.Points(geometry, material);
    },
    light(x, y, z) {
      const spotLight = new THREE.DirectionalLight(0xffffff);
      spotLight.position.set(x, y, z);
      this.lights.push(spotLight);
      return spotLight;
    },
    floor(x, y, z, color) {
      const geometry = new THREE.BoxBufferGeometry(x, y, z);
      const material = new THREE.MeshLambertMaterial({ color: color });
      this.materials.push(material);
      this.geometrys.push(material);
      return new THREE.Mesh(geometry, material);
    },
    animate(vertic) {
      const position = vertic.position;
      if (position.x <= 0) {
        this.moveDirect = true;
      } else if (position.x >= 350) {
        this.moveDirect = false;
      }
      let x = 0;
      if (this.moveDirect) {
        x = 1;
      } else {
        x = -1;
      }
      vertic.translateX(x);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.instanceId = window.requestAnimationFrame(() => {
        this.animate(vertic);
      });
    }
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this.instanceId);
    this.geometrys.forEach(item => {
      item.dispose();
    });

    this.materials.forEach(item => {
      item.dispose();
    });
  }
};
</script>

<style scoped></style>
