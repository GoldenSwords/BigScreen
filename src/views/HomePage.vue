<template>
  <el-container>
    <el-header>头部</el-header>
    <el-container>
      <el-aside width="200px">
        <template v-for="(item, index) in menuTree">
          <router-link :to="item.path" :key="index"
            ><el-button>{{ item.menuName }}</el-button></router-link
          >
          <template v-for="(i, x) in item.children">
            <router-link :to="i.path" :key="x + '-'"
              ><el-button>{{ i.menuName }}</el-button></router-link
            >
          </template>
        </template>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { menuAll } from "@/api/menu";
import { mapState } from "vuex";
import { formatRoutes } from "@/plugins/util/util";
export default {
  name: "HomePage",
  computed: {
    ...mapState({
      menuTree: state => state.Menu.menuTree
    })
  },
  data() {
    return {};
  },
  beforeMount() {},
  mounted() {
    menuAll().then(resp => {
      this.$router.addRoutes(formatRoutes(resp.data.msg));
    });
  },
  methods: {}
};
</script>

<style scoped></style>
