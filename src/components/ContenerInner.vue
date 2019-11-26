<template>
    <el-container style="width: 100%;height: 100%;">
      <div>{{menu}}</div>
      <div>
        <slot></slot>
      </div>
    </el-container>
</template>

<script>
export default {
  name: 'ContenerInner',
  props: {
    menu: String
  }
}
</script>

<style scoped>

</style>
