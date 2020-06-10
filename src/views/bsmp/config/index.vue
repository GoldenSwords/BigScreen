<template>
  <el-container>
    <el-main>
      <el-button @click="handleAdd" size="mini" type="success">新增</el-button>
      <el-table :data="tableList" style="width: 100%" v-loading="loading">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="映射字段" prop="key"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
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
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
        <template slot="title">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              配置项<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in selectOptions"
                :key="item.id"
                :command="item.id"
                >{{ item.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <el-form label-width="60px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="名称">
                <el-input v-model="activeRow.name" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="映射">
                <el-input v-model="activeRow.key" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型">
                <el-select v-model="activeRow.type" size="mini">
                  <el-option
                    v-for="(item, index) in selectTypes"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="item in activeOptions" :key="item.id">
            <el-col :span="4">
              <el-button-group>
                <el-button
                  icon="el-icon-s-tools"
                  size="mini"
                  type="primary"
                  @click="editOption(item)"
                ></el-button>
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="delOption(item)"
                ></el-button>
              </el-button-group>
            </el-col>
            <el-col :span="4">
              <el-input v-model="item.key" size="mini"></el-input>
            </el-col>
            <el-col :span="16">
              <l-view
                :row="item"
                :componentPath="item.component"
                :option="item.opts"
              ></l-view>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="text-align: center;">
          <el-button size="mini" @click="cancleO">取消</el-button>
          <el-button size="mini" type="success" @click="handleSave"
            >保存</el-button
          >
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogEditVisible" width="40%">
        <el-input
          ref="optionStr"
          type="textarea"
          :autosize="true"
          v-model="activeOptionStr"
        >
        </el-input>
        <div slot="footer" style="text-align: center;">
          <el-button size="mini" @click="cancle">取消</el-button>
          <el-button size="mini" type="success" @click="handleConfirm"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { generateUUID } from "@/plugins/util/util";
import {
  configurationList,
  configurationType
} from "@/api/bsmp_template_configuration";
import { optionList, optionDetail } from "@/api/bsmp_template_option";
import LView from "@/views/bsmp/base/LView";
export default {
  name: "BsmpConfig",
  components: { LView },
  data() {
    return {
      selectOptions: [],
      selectTypes: [],
      select: "",
      search: "",
      activeRow: {},
      activeOption: {},
      activeOptions: [],
      activeOptionStr: "",
      dialogVisible: false,
      dialogEditVisible: false,
      loading: false,
      tableList: []
    };
  },
  mounted() {
    this.base();
  },
  methods: {
    //TODO 配置项ID 重复问题
    delOption(target) {
      this.activeOptions.splice(
        this.activeOptions.findIndex(item => {
          return item === target;
        }),
        1
      );
    },
    editOption(item) {
      this.activeOption = item;
      this.activeOptionStr = item
        ? item.opts
          ? JSON.stringify(item.opts)
          : ""
        : "";
      this.dialogEditVisible = true;
    },
    base() {
      configurationType().then(resp => {
        this.selectTypes = resp.data.data;
      });
      optionList().then(resp => {
        this.selectOptions = resp.data.data;
      });
      this.list();
    },
    list() {
      configurationList().then(resp => {
        this.tableList = resp.data.data;
      });
    },
    clearForm() {
      this.activeOptions.splice(0, this.activeOptions.length);
    },
    handleAdd() {
      this.dialogVisible = true;
      this.activeRow = {};
      this.clearForm();
    },
    handleEdit(row) {
      this.clearForm();
      this.dialogVisible = true;
      this.activeRow = JSON.parse(JSON.stringify(row));
    },
    handleDelete() {},
    handleCommand(command) {
      optionDetail(JSON.stringify(command)).then(resp => {
        const qte = JSON.parse(JSON.stringify(resp.data.data));
        qte.id = generateUUID();
        this.activeOptions.push(qte);
      });
    },
    cancleO() {
      this.dialogVisible = false;
    },
    handleSave() {
      this.cancleO();
    },
    cancle() {
      this.dialogEditVisible = false;
    },
    handleConfirm() {
      try {
        this.$refs.optionStr.blur();
        const item = this.activeOptions.find(item => {
          return item === this.activeOption;
        });
        item.opts = JSON.parse(this.activeOptionStr);
        this.cancle();
      } catch (e) {
        this.$message(e);
      }
    }
  }
};
</script>

<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
