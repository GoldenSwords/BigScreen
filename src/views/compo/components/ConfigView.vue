<template>
  <div>
    <div>
      <el-dropdown v-show="pluginData.length !== 0" @command="handleCommand">
        <span class="el-dropdown-link">
          插件配置<i class="el-icon-circle-plus"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="item.id"
            v-for="item in pluginData"
            :key="item.id"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <l-view-many
      :options="configData"
      :use="true"
      @callback="callback"
    ></l-view-many>

    <div v-for="(item, index) in pluginsSelect" :key="index">
      <l-view-many
        :key="index"
        prefix="插件-"
        :options="item"
        :use="true"
        @callback="callback"
      ></l-view-many>
    </div>
  </div>
</template>

<script>
import {
  PluginsDataDetailByCompId,
  PluginsDataDetailById
} from "@/api/baseCompo";
import LViewMany from "@/views/compo/base/LViewMany";
import event from "@/plugins/event";
export default {
  name: "ConfigView",
  components: { LViewMany },
  props: {},
  data() {
    return {
      uuid: null,
      configData: null,
      pluginsSelect: [],
      pluginsDetail: {},
      pluginData: [],
      isRoot: true
    };
  },
  beforeMount() {
    //加载配置项
    event.$on("updateConfig", (compid, config, uuid, root) => {
      this.pluginData.splice(0, this.pluginData.length);
      this.pluginsSelect.splice(0, this.pluginsSelect.length);
      PluginsDataDetailByCompId(JSON.stringify(compid)).then(resp => {
        this.pluginData = resp.data.msg;
      });
      this.configData = config;
      this.uuid = uuid;
      this.isRoot = root && root === "root";
    });
  },
  methods: {
    handleCommand(command) {
      PluginsDataDetailById(JSON.stringify(command)).then(resp => {
        if (resp.data.msg.length !== 0) {
          this.pluginsSelect.push(resp.data.msg);
        } else {
          this.$message({ message: "当前插件未配置", type: "warning" });
        }
      });
    },
    callback(val) {
      this.$emit("callback", val, this.uuid);
    }
  }
};
</script>

<style scoped></style>
