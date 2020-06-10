<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item
      v-for="(item, index) in catchData"
      :title="prefix + item.name + '[' + item.key + ']'"
      :name="index + '_Root'"
      :key="index + '_index'"
    >
      <template v-for="(child, idx) in item.child" :index="idx + '_child'">
        <l-view
          :item="child"
          :key="child.id"
          @callback="callback"
          :use="use"
        ></l-view>
      </template>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import LView from "@/views/compo/base/LView";
export default {
  name: "LViewMany",
  components: { LView },
  props: {
    prefix: {
      type: String,
      default: ""
    },
    options: Array,
    use: Boolean
  },
  data() {
    return {
      activeNames: 0,
      catchData: []
    };
  },
  watch: {
    options(val) {
      this.catchData = JSON.parse(JSON.stringify(val));
    }
  },
  beforeMount() {
    this.catchData = JSON.parse(JSON.stringify(this.options));
  },
  methods: {
    callback(val) {
      this.catchData.forEach(group => {
        group.child.forEach(item => {
          if (item.id === val.id) {
            item.model = val.model;
          }
        });
      });
      this.$emit("callback", this.catchData);
    }
  }
};
</script>

<style scoped></style>
