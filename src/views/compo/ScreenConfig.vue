<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside
      style="height: 100%;width: 20%;border-radius: 5px;box-shadow: 0 0 2px #b0b1b1;"
    >
      <div
        v-for="item in compsInstance"
        :key="item.id"
        style="height: 30%;margin: 10px;position: relative;"
      >
        <div
          style="width: 100%;height: 100%;position: absolute;z-index: 2;cursor: pointer;"
          @click="targetComponent = item"
        ></div>
        <div
          style="width: 100%;height: 10%;position: absolute;z-index: 1;left: 0;top: 0;color: #fff;font-size: 12px;text-align: left;padding: 5px;"
        >
          {{ item.text }}
        </div>
        <component :is="item.comp"></component>
      </div>
    </el-aside>
    <el-main style="height: 100%;">
      <component :is="targetComponent.comp"></component>
    </el-main>
  </el-container>
</template>

<script>
import { registerComp } from "@/plugins/util/util";
import { componentsTemplateList } from "@/api/baseCompo";
export default {
  name: "ScreenConfig",
  data() {
    return {
      templateCompData: [],
      compsInstance: [],
      targetComponent: {}
    };
  },
  created() {
    this.templateList();
  },
  mounted() {},
  methods: {
    templateList() {
      componentsTemplateList().then(resp => {
        this.templateCompData = resp.data.msg;
        for (let i = 0; i < this.templateCompData.length; i++) {
          this.regist(this.templateCompData[i]);
          registerComp(
            this.templateCompData[i].code,
            this.templateCompData[i].component,
            resp => {
              this.compsInstance.push({
                name: this.templateCompData[i].code,
                text: this.templateCompData[i].name,
                comp: resp.default
              });
            }
          );
        }
      });
    }
    // regist(obj) {
    //   registComponent(obj.code, obj.component).then(resp => {
    //     this.compsInstance.push({
    //       name: obj.code,
    //       text: obj.name,
    //       comp: resp.default
    //     });
    //   });
    // }
  }
};
</script>

<style scoped></style>
