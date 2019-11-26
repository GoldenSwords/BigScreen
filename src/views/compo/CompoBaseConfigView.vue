<template>
  <el-container style="width: 100%;height: 100%;">
    <el-main style="width: 100%;height: 100%;">
      <el-row ref="row" style="height: 30px;line-height: 30px;">
        <el-col :span="4">类型</el-col>
        <el-col :span="20">
          <el-select
            v-model="typevalue"
            size="mini"
            placeholder="请选择"
            style="width: 100%;"
          >
            <el-option
              v-for="item in typeset"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row ref="row" style="height: 30px;line-height: 30px;">
        <el-col :span="4">配置项</el-col>
        <el-col :span="20">
          <el-select
            v-model="select"
            size="mini"
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
          <div v-for="(item, idx) in pluginData" :key="idx">
            <el-select
              v-model="item.code"
              size="mini"
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
          </div>
          <div>
            <el-button
              style="width: 100%;padding-right:30px;"
              icon="el-icon-circle-plus"
              size="mini"
              @click="addPlugin"
            ></el-button>
          </div>
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
      lineHeight: 0,
      select: null,
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
      if (val.config) {
        this.select = val.config.configId;
      } else {
        this.select = null;
        this.selectData.splice(0, this.selectData.length);
      }
    }
  },
  computed: {},
  created() {},
  beforeMount() {
    this.pluginData.splice(0, this.pluginData.length);
    this.configTemp = JSON.parse(JSON.stringify(this.config));
    if (this.configTemp.config) {
      this.select = this.configTemp.config.configId;
    }
    this.typevalue = this.configTemp.type;
    BaseCompoList().then(resp => {
      this.compsDataList = resp.data.msg;
    });
  },
  mounted() {
    this.lineHeight = this.$refs.row.clientHeight;
  },
  methods: {
    clearForm() {
      this.select = null;
      this.pluginData.splice(0, this.pluginData.length);
      this.$emit("close");
    },
    saveConfig() {
      this.configTemp.config = this.configTemp.config
        ? this.configTemp.config
        : {};
      this.configTemp.type = this.typevalue;
      this.configTemp.plugin = this.pluginData;
      this.configTemp.config.configId = this.select;
      saveCompoTemplate(this.configTemp);
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
        this.$message("扩展项已存在");
      }
    },
    addPlugin() {
      this.pluginData.push({});
    },
    // 配置项回调函数
    callback() {},
    change() {}
  }
};
</script>

<style scoped></style>
