<template>
  <div ref="map" style="width: 100%;height: 100%"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
export default {
  name: "map",
  mounted() {
    this._init();
  },
  data() {
    return {
      map: null
    };
  },
  methods: {
    _init() {
      this.map = L.map(this.$refs.map, {
        center: [51.505, -0.09],
        zoom: 13
      });
      L.circle([51.508, -0.11], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 500
      }).addTo(this.map);
      L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
      ]).addTo(this.map);
    }
  }
};
</script>

<style scoped></style>
