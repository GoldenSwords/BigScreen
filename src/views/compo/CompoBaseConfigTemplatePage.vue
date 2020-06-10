<template>
  <el-container style="width: 100%;height: 100%;">
    <el-main style="width: 100%;height: 100%;">
      <el-button @click="add">新增</el-button>
      <el-button>清除日期过滤器</el-button>
      <el-button>清除所有过滤器</el-button>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="序号" prop="id"></el-table-column>
        <el-table-column label="配置项名称" prop="name"></el-table-column>
        <el-table-column label="配置项映射" prop="key"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
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
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :visible.sync="addModal" width="50%">
        <template slot="title">
          <el-menu
            :collapse="true"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
          >
            <el-submenu index="1">
              <template slot="title">{{
                operation === "add" ? "新增" : "编辑"
              }}</template>
              <template v-for="(item, index) in rootSelectData">
                <el-menu-item :index="'' + index" :key="index">{{
                  item.name
                }}</el-menu-item>
              </template>
            </el-submenu>
          </el-menu>
        </template>
        <el-row slot="title">
          <el-col :span="12">
            <el-input
              v-model="option.key"
              placeholder="参数键值"
              size="mini"
            ></el-input>
          </el-col>
          <el-col :span="12">
            <el-input
              v-model="option.name"
              placeholder="参数名称"
              size="mini"
            ></el-input>
          </el-col>
        </el-row>
        <template v-for="item in selectData">
          <l-view
            v-if="item"
            :item="item"
            :key="item._uuid ? item._uuid : item.id"
            @delele="delConfig"
            @callback="callback"
          ></l-view>
        </template>
        <div slot="footer" style="text-align: center;">
          <el-button-group>
            <el-button
              v-if="operation === 'add'"
              type="primary"
              size="mini"
              @click="save"
              >提交</el-button
            >
            <el-button
              v-if="operation !== 'add'"
              type="success"
              size="mini"
              @click="handleUpdate"
              >修改</el-button
            >
            <el-button @click="clearForm" size="mini">取消</el-button>
          </el-button-group>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { generateUUID, dateFormat } from "@/plugins/util/util";
import {
  DelConfigTemplateInst, // 移除基础配置实例
  AddComponentConfigTemplate, // 新增模板
  getComponentBaseConfigTemplateList, // 配置模板列表
  BaseTypeList, // 基础项列表
  getComponentConfigTemplateDetailByConfigId, // 配置项模板详情
  updateComponentConfigTemplate, // 更新配置项模板
  delComponentConfigTemplate // 删除配置项模板
} from "@/api/baseCompo";
import LView from "@/views/compo/base/LView";

export default {
  name: "CompoBaseConfig",
  components: { LView },
  props: {},
  data() {
    return {
      dateFormat: null,
      rootSelectData: [], // 基础项
      selectData: [], // 激活项
      selectDataCatch: [],
      activeIndex: 0,
      addModal: false,
      dialogVisible: false,
      loading: false,
      tableData: [],
      search: "",
      activeRow: {},
      activeData: [],
      maxTempId: 0,
      option: {
        name: "配置项",
        key: "Option"
      },
      resultOptions: {},
      result: {},
      operation: "add",
      columnsConfig: {
        column: "",
        name: ""
      }
    };
  },
  computed: {},
  created() {},
  beforeMount() {
    this.dateFormat = dateFormat;
    BaseTypeList().then(resp => {
      this.rootSelectData = resp.data.msg;
    });
  },
  mounted() {
    this.listTable();
  },
  methods: {
    add() {
      this.clearForm();
      this.addModal = true;
      this.operation = "add";
    },
    closeDialog() {
      this.addModal = false;
      this.clearForm();
    },
    // 查询配置项列表
    listTable() {
      getComponentBaseConfigTemplateList().then(resp => {
        this.loading = false;
        this.tableData = resp.data.msg;
      });
    },
    // 新增配置项
    save() {
      this.option.child = this.selectData;
      AddComponentConfigTemplate(JSON.stringify(this.option)).then(resp => {
        if (resp.data.status) {
          this.listTable();
          this.closeDialog();
        } else {
          this.$message({ message: resp.data.msg });
        }
      });
    },
    // 重置
    clearForm() {
      this.selectData.splice(0, this.selectData.length);
      this.option.key = "";
      this.option.name = "";
      this.addModal = false;
    },
    // 配置项回调函数
    callback(val) {
      let i = 0;
      if (val._uuid) {
        for (i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i]._uuid === val._uuid) {
            this.selectData[i].model = val.model;
            this.selectData[i].name = val.name;
            this.selectData[i].key = val.key;
            this.selectData[i].disabled = val.disabled;
          }
        }
      } else {
        for (i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].id === val.id) {
            this.selectData[i].model = val.model;
            this.selectData[i].name = val.name;
            this.selectData[i].key = val.key;
            this.selectData[i].disabled = val.disabled;
          }
        }
      }
    },
    // 打印调试
    print() {
      console.log(JSON.stringify(this.selectData));
    },
    // 新增中-移除配置项
    delSelect(id) {
      const index = this.selectData.findIndex(select => {
        return select.id === id;
      });
      if (index !== -1) {
        this.selectData.splice(index, 1);
      }
    },
    // 选择基础配置项
    handleSelect(key) {
      const obj = JSON.parse(JSON.stringify(this.rootSelectData[key]));
      delete obj.id;
      obj._uuid = generateUUID();
      obj.disabled = !!obj.disabled;
      this.selectData.push(obj);
    },
    handleEdit(index, row) {
      //模板详情
      getComponentConfigTemplateDetailByConfigId(row.id).then(resp => {
        this.option.key = resp.data.msg.key;
        this.option.id = row.id;
        this.option.name = resp.data.msg.name;
        this.selectData = [].concat(resp.data.msg.child);
        this.addModal = true;
        this.operation = "edit";
      });
    },
    // 更新模板
    handleUpdate() {
      this.option.child = this.selectData;
      //更新
      updateComponentConfigTemplate(JSON.stringify(this.option)).then(resp => {
        if (resp.data.status) {
          this.listTable();
          this.closeDialog();
        } else {
          this.$message({ message: resp.data.msg });
        }
      });
    },
    //删除模板
    handleDelete(index, row) {
      delComponentConfigTemplate(JSON.stringify(row)).then(resp => {
        if (resp.data.status) {
          this.listTable();
          this.closeDialog();
        } else {
          this.$message({ message: resp.data.msg });
        }
      });
    },
    delConfig(item) {
      if (item.id !== undefined) {
        DelConfigTemplateInst(JSON.stringify(item)).then(resp => {
          this.selectData.splice(
            this.selectData.findIndex(obs => {
              return item.id === obs.id;
            }),
            1
          );
          if (!resp.data.status) {
            this.$message({ message: resp.data.msg });
          }
        });
      } else {
        this.selectData.splice(
          this.selectData.findIndex(obs => {
            return item._uuid === obs._uuid;
          }),
          1
        );
      }
    },
    handleClose() {}
  }
};
</script>

<style scoped></style>
