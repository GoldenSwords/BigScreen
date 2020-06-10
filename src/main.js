import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { loadScript } from "./plugins/util/util.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import echarts from "echarts";
import "@/assets/style/common.css";
import "@/plugins/system/VDrag.js";
// import "@/assets/font/iconfont.css";
//导入必须的样式表
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
Vue.use(ElementUI);
loadScript("https://at.alicdn.com/t/font_1728791_dvxdqpnzgth.js", () => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#app");
});
