<template>
  <el-container style="width: 100%;height: 100%;">
    <el-main style="width: 100%;height: 100%;">
      <el-row style="height: 30px;line-height: 30px;">
        <el-col :span="4">配置项</el-col>
        <el-col :span="20">
          <el-select
            v-model="select"
            size="mini"
            multiple
            collapse-tags
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in selectDataFiled.configDataList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="height: calc(100% - 90px);overflow: auto;" class="LScroll">
        <el-col :span="4">扩展项</el-col>
        <el-col :span="20">
          <el-select
            v-model="pluginData"
            size="mini"
            multiple
            collapse-tags
            placeholder="请选择"
            style="width: 100%;"
            @change="pluginChange"
          >
            <el-option
              v-for="item in plugins"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="height: 30px;line-height: 30px;text-align: center;">
        <el-col :span="24">
          <el-button-group>
            <el-button type="primary" size="mini" @click="saveConfig"
              >确认</el-button
            >
            <el-button type="default" size="mini" @click="clearForm"
              >取消</el-button
            >
          </el-button-group>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { BaseCompoList, saveCompoTemplate } from "@/api/baseCompo";
export default {
  name: "CompoBaseConfigView",
  components: {},
  props: {
    typeset: Array,
    config: Object,
    plugins: Array,
    selectDataFiled: Object
  },
  data() {
    return {
      typevalue: null,
      pluginData: [],
      // plugins: [
      //   { id: 1, name: "扩展1" },
      //   { id: 2, name: "扩展2" },
      //   { id: 3, name: "扩展3" }
      // ],
      lineHeight: 30,
      select: [],
      compsDataList: [],
      selectData: [],
      configTemp: {}
    };
  },
  watch: {
    config(val) {
      this.pluginData.splice(0, this.pluginData.length);
      this.configTemp = JSON.parse(JSON.stringify(this.config));
      this.typevalue = this.configTemp.type;
      this.select = val.config ? val.config : [];
      this.config.plugin.forEach(plugin => {
        this.pluginData.push(
          this.plugins.find(item => {
            return item.id === plugin;
          }).id
        );
      });
    }
  },
  computed: {},
  created() {},
  beforeMount() {
    this.configTemp = JSON.parse(JSON.stringify(this.config));
    this.select = this.configTemp.config ? this.configTemp.config : [];
    this.typevalue = this.configTemp.type;
    BaseCompoList().then(resp => {
      this.compsDataList = resp.data.msg;
    });
    this.config.plugin.forEach(plugin => {
      this.pluginData.push(
        this.plugins.find(item => {
          return item.id === plugin;
        }).id
      );
    });
  },
  mounted() {},
  methods: {
    clearForm() {
      this.select.splice(0, this.select.length);
      this.pluginData.splice(0, this.pluginData.length);
      this.$emit("close");
    },
    saveConfig() {
      this.configTemp.type = this.typevalue;
      this.configTemp.plugin = this.pluginData;
      this.configTemp.config = this.select;
      saveCompoTemplate(JSON.stringify(this.configTemp));
      this.clearForm();
    },
    pluginChange(val) {
      let count = 0;
      this.pluginData.forEach(item => {
        if (item.code === val) {
          count++;
        }
      });
      if (count > 1) {
        this.$message({
          message: "扩展项重复配置",
          type: "warning"
        });
      }
    },
    // 配置项回调函数
    callback() {},
    change() {}
  }
};
</script>

<style scoped></style>
