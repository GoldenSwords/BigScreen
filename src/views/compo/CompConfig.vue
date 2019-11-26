<template>
  <el-container style="width: 100%;height: 100%;">
    <el-main style="width: 100%;height: 100%;">
      <el-button @click="add">新增</el-button>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="组件名称" prop="name"></el-table-column>
        <el-table-column label="更新时间" width="220">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{
              dateFormat("yyyy-MM-dd hh:mm:ss", scope.row.updatetime)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot="header">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button-group>
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-s-operation"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                size="mini"
                type="success"
                icon="el-icon-s-tools"
                @click="handleConfig(scope.$index, scope.row)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-remove-outline"
                @click="handleDelete(scope.$index, scope.row)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="configModal" width="50%">
        <template slot="title">预览</template>
        <div :style="{ height: height + 'px' }">
          <el-row style="height: 100%;">
            <el-col style="height: 100%;" :span="12">
              <div style="width: 100%;height: 100%;position: relative;">
                <div
                  style="width: 100%;height: 100%;position: absolute;z-index: 1;"
                  class="mask"
                ></div>
                <component :is="instanceComp"></component>
              </div>
            </el-col>
            <el-col style="height: 100%;" :span="12">
              <compo-base-config-view
                :config="detailTarget"
                :selectDataFiled="selectData"
                :typeset="typeset"
                :plugins="plugins"
                @close="closeModal"
              ></compo-base-config-view>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="addModal" width="50%">
        <template slot="title">{{
          model === "add" ? "新增" : "编辑"
        }}</template>
        <div :style="{ height: height + 'px' }">
          <el-row style="height: 100%;">
            <el-col style="height: 100%;" :span="12">
              <el-form>
                <el-form-item>
                  <el-select
                    v-model="instanceObj.type"
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
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="instanceObj.name"
                    placeholder="组件名称"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="instanceObj.component"
                    placeholder="组件路径 views/..."
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input
                    v-model="instanceObj.code"
                    placeholder="组件标识"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button-group>
                    <el-button @click="doPreview" size="mini" type="primary"
                      >应用</el-button
                    >
                    <el-button @click="save" size="mini" type="success">{{
                      model === "add" ? "提交" : "更新"
                    }}</el-button>
                    <el-button @click="cancle" size="mini" type="default"
                      >取消</el-button
                    >
                  </el-button-group>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="height: 100%;" :span="12">
              <div style="width: 100%;height: 100%;position: relative;">
                <div
                  style="width: 100%;height: 100%;position: absolute;z-index: 1;"
                  class="mask"
                ></div>
                <component :is="viewComp.comp"></component>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { dateFormat, registComponent } from "@/plugins/util/util";
import {
  PluginsDataList,
  componentsTemplateList,
  componentsTemplateDetail,
  getComponentBaseConfigTemplateList,
  saveCompoTemplate
} from "@/api/baseCompo";
import CompoBaseConfigView from "@/views/compo/CompoBaseConfigView";
export default {
  name: "CompConfig",
  components: { CompoBaseConfigView },
  data() {
    return {
      model: "add",
      typeset: [
        { value: 0, lable: "面板" },
        { value: 1, lable: "组件" }
      ],
      height: 0,
      selectData: {
        configDataList: []
      },
      configSelect: null,
      compsInstance: [],
      addModal: false,
      configModal: false,
      search: "",
      dateFormat: null,
      loading: false,
      instanceObj: {
        type: 0,
        component: null,
        code: null,
        name: null
      },
      viewComp: {
        name: "",
        comp: null
      },
      plugins: [],
      detailTarget: {},
      tableData: [{ name: "name" }]
    };
  },
  computed: {
    configData: function() {
      return this.detailTarget.config;
    },
    instanceComp: function() {
      const obj = this.compsInstance.find(item => {
        return item.name === this.detailTarget.code;
      });
      return obj ? obj.comp : undefined;
    }
  },
  beforeMount() {
    this.dateFormat = dateFormat;
    this.listTable();
  },
  mounted() {
    this.height = document.body.clientHeight * 0.5;
    this.getSelectList();
  },
  methods: {
    getSelectList() {
      PluginsDataList().then(resp => {
        this.plugins = resp.data.msg;
      });
      getComponentBaseConfigTemplateList().then(resp => {
        this.selectData.configDataList = resp.data.msg;
      });
    },
    save() {
      saveCompoTemplate(JSON.stringify(this.instanceObj)).then(resp => {
        if (resp.data.status) {
          this.listTable();
          this.closeModal();
        } else {
          this.$message(resp.msg);
        }
      });
    },
    cancle() {
      this.closeModal();
      this.clearModal();
    },
    //预览
    doPreview() {
      this.viewComp.name = this.instanceObj.code;
      if (this.instanceObj.code && this.instanceObj.component) {
        registComponent(this.instanceObj.code, this.instanceObj.component).then(
          resp => {
            this.viewComp.comp = resp.default;
          }
        );
      } else {
        this.$message("请指定code和component");
      }
    },
    listTable() {
      this.compsInstance.splice(0, this.compsInstance.length);
      componentsTemplateList().then(resp => {
        if (resp.data.status) {
          this.tableData = resp.data.msg;
          for (let i = 0; i < this.tableData.length; i++) {
            this.regist(this.tableData[i].code, this.tableData[i].component);
          }
        }
      });
    },
    regist(name, comp) {
      registComponent(name, comp).then(resp => {
        this.compsInstance.push({
          name: name,
          comp: resp.default
        });
      });
    },
    handleDelete() {},
    handleConfig(index, row) {
      componentsTemplateDetail(JSON.stringify(row)).then(resp => {
        this.detailTarget = resp.data.msg;
        this.configModal = true;
      });
    },
    handleEdit(index, row) {
      this.model = "edit";
      componentsTemplateDetail(JSON.stringify(row)).then(resp => {
        this.detailTarget = resp.data.msg;
        for (const i in this.detailTarget) {
          this.instanceObj[i] = this.detailTarget[i];
        }
        this.addModal = true;
        this.doPreview();
      });
    },
    //清空表单数据
    clearModal() {
      this.viewComp.comp = null;
      this.detailTarget = {};
      this.instanceObj.type = 0;
      this.instanceObj.component = null;
      this.instanceObj.code = null;
      this.instanceObj.name = null;
    },
    //关闭模态框
    closeModal() {
      this.configModal = false;
      this.addModal = false;
    },
    // 新增组件
    add() {
      this.model = "add";
      this.clearModal();
      this.addModal = true;
    }
  }
};
</script>

<style scoped></style>
