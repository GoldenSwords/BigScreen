<template>
  <div>
    <el-select
      v-if="!option.multiple"
      style="width: 100%;"
      v-model="selectSingle"
      :disabled="option.disabled"
      :placeholder="option.placeholder"
      @change="change"
      size="mini"
    >
      <el-option
        v-for="item in option.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      v-if="option.multiple"
      style="width: 100%;"
      v-model="selectMutiple"
      multiple
      :disabled="option.disabled"
      :placeholder="option.placeholder"
      @change="change"
      size="mini"
    >
      <el-option
        v-for="item in option.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "LSelect",
  props: {
    option: Object
  },
  data() {
    return {
      selectMutiple: [],
      selectSingle: "",
      options: [
        {
          value: 0,
          label: "静态模式"
        },
        {
          value: 1,
          label: "切换模式"
        },
        {
          value: 2,
          label: "轮播模式"
        }
      ]
    };
  },
  watch: {
    option(val) {
      console.log(val);
      if (val.multiple) {
        this.selectMutiple = val.value;
      } else {
        this.selectSingle = val.value;
      }
    }
  },
  beforeMount() {
    console.log(this.option);
    if (this.option.multiple) {
      this.selectMutiple = this.option.value;
    } else {
      this.selectSingle = this.option.value;
    }
  },
  methods: {
    change(val) {
      const vals = JSON.parse(JSON.stringify(this.option));
      vals.value = val;
      this.$emit("callback", vals);
    }
  }
};
</script>

<style scoped></style>
