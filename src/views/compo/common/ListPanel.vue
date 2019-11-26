<template>
  <div
    style="width: 100%;height: 100%;"
    @click="click"
    @contextmenu="contextmenu"
  >
    <span
      v-show="pickShow"
      class="panelBorder"
      style="position: absolute;z-index: 1;"
      :style="{
        left: left + 'px',
        top: top + 'px'
      }"
    >
      <ul class="panelBox">
        <li
          v-for="item in selectedData"
          :key="item.id"
          @click.stop="addPanel(item)"
        >
          {{ item.name }}
        </li>
      </ul>
    </span>
  </div>
</template>

<script>
import events from "@/plugins/event";
export default {
  name: "ListPanel",
  beforeMount() {
    events.$on("silent", this.silent);
  },
  data() {
    return {
      selectedData: [],
      left: 0,
      top: 0,
      pickShow: false
    };
  },
  methods: {
    addPanel() {},
    silent() {
      this.pickShow = false;
    },
    contextmenu(e) {
      console.log(e);
    },
    click(e) {
      console.log(e);
    }
  }
};
</script>

<style scoped>
.panelBorder {
  background-color: rgb(4, 4, 4);
  padding: 5px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  width: 80px;
}
.panelBox {
  list-style: none;
  margin: 0;
  padding: 0;
}
.panelBox li {
  padding: 0 5px;
}
.panelBox li {
  cursor: pointer;
  border-top: 1px solid #6f6f6f;
}
.panelBox li:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.panelBox li:first-child {
  border-top: 0;
}
</style>
