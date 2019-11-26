<template>
  <div>
    <el-container>
      <el-main>
        <!--<component :is="'inputs'"></component>-->
        <el-table :data="data" border style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          ></el-table-column>
        </el-table>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
          <span>s</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-main>
      <el-footer>
        <el-button-group>
          <el-button
            :icon="'el-icon-circle-plus'"
            type="success"
            @click="dialogVisible = true"
          ></el-button>
        </el-button-group>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "dictConfig",
  data() {
    return {
      dialogVisible: false,
      data: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      comps: [
        {
          name: "inputs",
          source: "components/collects/inputs"
        }
      ]
    };
  },
  beforeMount() {
    // this.comps.forEach(item => {
    //   const component = registerComponent(item)
    //   console.log(component)
    //   debugger
    // })
  }
};
</script>

<style scoped></style>
