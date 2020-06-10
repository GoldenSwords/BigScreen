<template>
  <el-container>
    <el-main>
      <el-button @click="handleAdd" size="mini" type="success">新增</el-button>
      <el-table :data="tableList" style="width: 100%" v-loading="loading">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="映射字段" prop="key"></el-table-column>
        <el-table-column label="组件路径" prop="component"></el-table-column>
        <el-table-column label="使用状态" prop="status">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status === 0"
              type="success"
              disable-transitions
              >空闲中</el-tag
            >
            <el-tag v-else type="danger" disable-transitions>已实例</el-tag>
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
            <el-button size="mini" @click="handleEdit(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :visible.sync="modal"
        :show-close="false"
        width="50%"
        :close-on-click-modal="false"
      >
        <el-row>
          <el-col :span="24">
            <l-view
              ref="lview"
              :row="targetRow"
              :componentPath="componentStr"
              :option="componentOption"
              @callback="callback"
            ></l-view>
            <!--<component :is="componentObj" :option="componentOption"></component>-->
          </el-col>
          <el-col :span="24">
            <el-input
              type="textarea"
              :rows="10"
              v-model="componentOptionStr"
              @change="changeOption"
            ></el-input>
          </el-col>
        </el-row>
        <div slot="footer" style="text-align: center;">
          <el-button-group>
            <el-button type="primary" size="mini" @click="confirm"
              >确认</el-button
            >
            <el-button size="mini" @click="cancle">取消</el-button>
          </el-button-group>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
/**
 * 基础配置
 * */
import LView from "@/views/bsmp/base/LView";
import {
  updateOption,
  delOption,
  addOption,
  optionDetail,
  optionList
} from "@/api/bsmp_template_option";
export default {
  name: "BsmpOption",
  components: { LView },
  data() {
    return {
      targetRow: null,
      modal: false,
      loading: false,
      tableList: [],
      search: "",
      form: {},
      componentStr: null,
      componentOption: null,
      componentOptionStr: null
    };
  },
  beforeMount() {},
  mounted() {
    this.list();
  },
  methods: {
    changeOption(val) {
      try {
        this.componentOption = JSON.parse(val);
      } catch (e) {
        console.log(e);
      }
    },
    cancle() {
      this.modal = false;
    },
    confirm() {
      this.modal = false;
    },
    list() {
      this.loading = true;
      optionList().then(resp => {
        if (resp.data.status) {
          console.log(resp.data);
          this.tableList = resp.data.data;
        }
        this.loading = false;
      });
    },
    update() {
      updateOption(JSON.stringify(this.form)).then(resp => {
        if (resp.data.status) {
          this.list();
        }
        this.$message(resp.data.msg);
      });
    },
    del(row) {
      delOption(JSON.stringify(row.id)).then(resp => {
        if (resp.data.status) {
          this.list();
        }
        this.$message(resp.data.msg);
      });
    },
    detail() {
      optionDetail(JSON.stringify(this.form)).then(resp => {
        if (resp.data.status) {
          this.form = resp.data.data;
        }
        this.$message(resp.data.msg);
      });
    },
    add() {
      addOption(JSON.stringify(this.form)).then(resp => {
        if (resp.data.status) {
          this.list();
        }
        this.$message(resp.data.msg);
      });
    },
    handleAdd() {
      this.modal = true;
    },
    handleEdit(row) {
      this.modal = true;
      this.targetRow = row;
      this.componentStr = row.component;
      this.componentOption = row.opts;
      this.componentOptionStr = JSON.stringify(row.opts);
    },
    handleDelete(row) {
      this.$confirm("此操作将永久删除配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.del(row);
      });
    },
    callback(val) {
      this.componentOptionStr = JSON.stringify(val);
    }
  }
};
</script>

<style scoped></style>
