<template>
  <el-row style="padding: 5px 0">
    <template v-if="!use">
      <el-col :span="10" style="text-align: center;">
        <component
          :is="item.code"
          :disabled="config.disabled"
          :value="item.model"
          @callback="callback"
        ></component>
      </el-col>
      <el-col :span="5">
        <el-input
          v-model="config.key"
          @change="doUpdate"
          placeholder="键值"
          size="mini"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-input
          v-model="config.name"
          @change="doUpdate"
          placeholder="名称"
          size="mini"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button-group>
          <el-button
            @click="doDisable"
            type="primary"
            size="mini"
            icon="el-icon-lock"
          ></el-button>
          <el-button
            @click="doDelete"
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </el-button-group>
      </el-col>
    </template>
    <template v-else>
      <el-col :span="12">
        <el-input
          :disabled="use"
          v-model="config.name"
          @change="doUpdate"
          placeholder="名称"
          size="mini"
        ></el-input>
      </el-col>
      <el-col :span="12">
        <component
          :is="item.code"
          :disabled="config.disabled"
          :value="item.model"
          @callback="callback"
        ></component>
      </el-col>
    </template>
  </el-row>
</template>

<script>
const compss = (function(arr) {
  let components = {};
  arr.forEach(layer => {
    components[layer] = () => import("@/views/compo/base/" + layer + ".vue");
  });
  return components;
})(["LInput", "LNumber", "LTextarea", "LColor"]);
export default {
  name: "LView",
  props: {
    item: Object,
    use: Boolean
  },
  data() {
    return {
      config: {
        id: 1,
        name: "数字",
        key: "method",
        component: "views/compo/base/LInput",
        model: 1,
        type: "Number",
        code: "LInput",
        compId: 1
      }
    };
  },
  beforeMount() {
    this.config = JSON.parse(JSON.stringify(this.item));
  },
  components: { ...compss },
  methods: {
    callback(val) {
      this.config.model = val;
      this.doUpdate();
    },
    doUpdate() {
      if (
        this.config.name &&
        this.config.name.length > 0 &&
        this.config.key &&
        this.config.key.length > 0
      ) {
        this.$emit("callback", {
          name: this.config.name,
          key: this.config.key,
          model: this.config.model,
          disabled: this.config.disabled,
          _uuid: this.config._uuid
          // id: this.config.id
        });
      }
    },
    doDisable() {
      this.config.disabled = !this.config.disabled;
    },
    doDelete() {
      this.$emit("delele", this.item);
    }
  }
};
</script>

<style scoped></style>
