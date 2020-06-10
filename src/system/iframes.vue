<template>
  <el-container style="width: 100%;height: 100%;">
    <el-header
      style="border-bottom: 1px solid rgb(246, 246, 246);line-height: 60px;"
    >
      <v-header></v-header>
    </el-header>
    <el-container style="width: 100%;height: calc(100% - 60px)">
      <el-aside
        :width="!toggle ? `200px` : `60px`"
        style="box-sizing: border-box;border-right: 1px solid rgb(246, 246, 246);position: relative;transition: 1s;"
      >
        <v-menu :data="menuTree" @toggle="toggleFun"></v-menu>
      </el-aside>
      <el-main style="background-color: rgb(243, 246, 251)">
        <div class="content">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import event from "@/plugins/event";
import VHeader from "./VHeader";
import { menuAll } from "@/api/menu";
import { formatRoutes } from "@/plugins/util/util";
import { mapState } from "vuex";
import VMenu from "./VMenu";
export default {
  name: "iframes",
  components: { VMenu, VHeader },
  computed: {
    ...mapState({
      menuTree: state => state.Menu.menuTree
    })
  },
  data() {
    return {
      toggle: false
    };
  },
  mounted() {
    menuAll().then(resp => {
      this.$router.addRoutes(formatRoutes(resp.data.msg));
    });
  },
  methods: {
    toggleFun(val) {
      this.toggle = val;
      event.$emit("resize");
    }
  }
};
</script>

<style scoped>
.content {
  width: calc(100%);
  height: calc(100%);
  position: relative;
  background: #fff;
  padding: 20px;
  box-shadow: 0 0 1px #f6f6f6;
  box-sizing: border-box;
}
</style>
