<template>
  <el-container style="width: 100%;height: 100%;">
    <el-header style="border-bottom: 1px solid rgb(246, 246, 246);line-height: 60px;">
      <v-header></v-header>
    </el-header>
    <el-container style="width: 100%;height: calc(100% - 60px)">
      <el-aside width="200px" style="box-sizing: border-box;border-right: 1px solid rgb(246, 246, 246);position: relative">
        <v-menu :data="menuTree"></v-menu>
        <!--<menu-item :data="menuTree"></menu-item>-->
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
import VHeader from '@/components/VHeader'
import { menuAll } from '@/api/menu'
import { formatRoutes } from '@/plugins/util/util'
import { mapState } from 'vuex'
import VMenu from '@/components/VMenu'
export default {
  name: 'iframes',
  components: { VMenu, VHeader },
  computed: {
    ...mapState({
      menuTree: state => state.Menu.menuTree
    })
  },
  mounted () {
    menuAll().then(resp => {
      this.$router.addRoutes(formatRoutes(resp.data.msg))
    })
  }
}
</script>

<style scoped>
  .content{
    width: calc(100%);
    height: calc(100%);
    background: #fff;
    padding: 20px;
    box-shadow: 0 0 1px #f6f6f6;
    box-sizing: border-box;
  }
</style>
