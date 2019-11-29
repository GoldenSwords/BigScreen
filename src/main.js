import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import echarts from "echarts";
import "@/assets/style/common.css";
//导入Cesium源码中的Viewer组件，注意这里是用的Viewer组件的方式加载，而不是加载整个Cesium
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
//我们刚才所说的如何让Cesium知道静态资源在哪里的API
// import buildModuleUrl from "cesium/Source/Core/buildModuleUrl";
//导入必须的样式表
import "cesium/Source/Widgets/widgets.css";
Vue.prototype.$echarts = echarts;
Vue.prototype.$Viewer = Viewer;
Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
