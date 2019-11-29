<template>
  <canvas
    ref="canvas"
    style="width: 100%;height: 100%;display: block;"
  ></canvas>
</template>

<script>
/**
 * 台风3D示例
 * */
import * as THREE from "three";
export default {
  name: "ThreeStorm",
  data() {
    return {
      flowIndex: 0,
      WIDTH: 0,
      HEIGHT: 0,
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
    this.init();
  },
  methods: {
    init() {
      this.WIDTH = this.$refs.canvas.clientWidth;
      this.HEIGHT = this.$refs.canvas.clientHeight;
      this.camera = new THREE.OrthographicCamera(
        -this.WIDTH / 2,
        this.WIDTH / 2,
        this.HEIGHT / 2,
        -this.HEIGHT / 2,
        -500,
        500
      );
      this.scene = new THREE.Scene();
      this.camera.position.set(0, 0, 1);
      this.group = new THREE.Group();
      const group = this.group;
      group.add(this.light(350, -350, 500));
      group.add(this.floor(700, 700, 10, "rgb(119, 119, 119)"));
      group.add(
        this.cylinder(312, -280, 10, { x: 20, y: 20, z: 40, color: "red" })
      );
      const path1 = this.curve(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(300, -280, 20),
          new THREE.Vector3(282, -280, 20),
          new THREE.Vector3(278, -280, 20),
          new THREE.Vector3(260, -260, 20)
        ]),
        3,
        "rgb(159, 254, 95)"
      );
      group.add(path1);
      group.add(
        this.sphere(260, -260, 20, {
          x: 5,
          y: 5,
          z: 10,
          color: "rgb(119, 119, 119)"
        })
      );
      const path2 = this.curve(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(260, -260, 20),
          new THREE.Vector3(230, -230, 20),
          new THREE.Vector3(210, -260, 20)
        ]),
        3,
        "rgb(159, 254, 95)"
      );
      group.add(path2);

      group.add(
        this.cylinder(202, -260, 10, { x: 20, y: 20, z: 40, color: "red" })
      );
      this.flowIndex = this.flowIndex >= 200 ? 0 : this.flowIndex + 1;
      group.rotation.x = -(Math.PI / 180) * 70;
      group.rotation.z = -(Math.PI / 180) * 30;
      this.scene.add(group);
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
    cylinder(px, py, pz, { x, y, z, color }) {
      const geometry = new THREE.CylinderBufferGeometry(x, y, z, 32);
      const material = new THREE.MeshLambertMaterial({ color: color });
      this.materials.push(material);
      this.geometrys.push(geometry);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(px, py, pz);
      mesh.rotation.x = (Math.PI / 180) * 90;
      const edges = new THREE.EdgesGeometry(geometry);
      const lm = new THREE.LineBasicMaterial({
        color: "rgba(255,100,0,.2)",
        transparent: true,
        opacity: 0.3
      });
      const line = new THREE.LineSegments(edges, lm);
      line.position.set(px, py, pz);
      line.rotation.x = (Math.PI / 180) * 90;
      this.materials.push(lm);
      this.geometrys.push(edges);
      this.group.add(line);
      return mesh;
    },
    sphere(px, py, pz, { x, y, z, color }) {
      const geometry = new THREE.SphereBufferGeometry(x, y, z);
      const material = new THREE.MeshLambertMaterial({ color: color });
      this.materials.push(material);
      this.geometrys.push(geometry);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(px, py, pz);
      return mesh;
    },
    curve(path, radius, color) {
      const geometry = new THREE.TubeBufferGeometry(
        path,
        100,
        radius,
        20,
        false
      );
      const material = new THREE.MeshLambertMaterial({ color: color });
      this.materials.push(material);
      this.geometrys.push(geometry);
      return new THREE.Mesh(geometry, material);
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
    animate() {
      this.renderer.render(this.scene, this.camera);
      this.instanceId = window.requestAnimationFrame(() => {
        this.animate();
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
