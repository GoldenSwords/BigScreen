<template>
  <el-container style="width: 100%;height: 100%;">
    <el-main style="width: 100%;height: 100%;">
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column label="扩展名称" prop="name"></el-table-column>
        <el-table-column
          label="应用文件"
          prop="component"
          width="300"
        ></el-table-column>
        <el-table-column label="使用状态" prop="status">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === 0 ? 'danger' : 'success'">{{
              scope.row.status === 0 ? "未使用" : "使用中"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="映射键值" prop="key">
          <template slot-scope="scope">
            <el-tag type="primary">{{ scope.row.key }}</el-tag>
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
    </el-main>
  </el-container>
</template>

<script>
import { PluginsDataList } from "@/api/baseCompo";
export default {
  name: "PluginConfig",
  data() {
    return {
      loading: false,
      tableData: [],
      search: ""
    };
  },
  beforeMount() {
    this.listTable();
  },
  methods: {
    listTable() {
      PluginsDataList().then(resp => {
        this.tableData = resp.data.msg;
      });
    },
    handleEdit() {},
    handleDelete() {}
  }
};
</script>

<style scoped></style>
