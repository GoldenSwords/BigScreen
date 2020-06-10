<template>
  <div class="qqq" v-drag>
    {{ option.text }}
  </div>
</template>

<script>
export default {
  name: "textComp",
  props: {
    option: Object
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
.qqq {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>
