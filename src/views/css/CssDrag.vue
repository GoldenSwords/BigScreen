<template>
  <div class="root">
    <div class="left">
      <div
        ref="drag"
        class="border"
        style="border:1px solid red;padding: 10px;width: 10px;height: 10px;"
        draggable
        @dragstart="drag($event, 'drag')"
      ></div>
    </div>
    <div class="right" @drop="ondrop" @dragover="ondropover"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drops: []
    };
  },
  methods: {
    drag(ev, ref) {
      ev.dataTransfer.setData("Ref", ref);
    },
    ondrop(ev) {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("Ref");
      ev.target.appendChild(this.$refs[data].cloneNode(true));
    },
    ondropover(ev) {
      ev.preventDefault();
    }
  }
};
</script>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
}
.left {
  width: 200px;
}
.right {
  flex: 1;
  border: 1px solid black;
  position: relative;
}
</style>
