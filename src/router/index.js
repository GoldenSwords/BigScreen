import Vue from "vue";
import Router from "vue-router";
import { getStore } from "@/plugins/util/store";
// import store from '@/store'
import Login from "@/views/Login.vue";
import HomePage from "@/system/iframes.vue";
import Welcome from "@/views/Welcome.vue";
import NotFound from "@/views/404.vue";
import ThreeStorm from "@/views/cesium/Clean";
import DragPage from "@/components/DragPage";
// import store from '@/store'

Vue.use(Router);
const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomePage,
      redirect: "/Welcome",
      beforeEnter(to, from, next) {
        console.log("HW", to, from, next);
        const login = getStore({ name: "login" });
        if (login) {
          next();
        } else {
          next("/Login");
        }
      },
      children: [
        {
          path: "/Welcome",
          name: "Welcome",
          component: Welcome
        }
      ]
    },
    {
      path: "/Login",
      name: "Login",
      component: Login
    },
    {
      path: "/Logins",
      name: "Logins",
      component: ThreeStorm
    },
    {
      path: "/View",
      name: "View",
      component: DragPage
    },
    {
      path: "*",
      name: "/404",
      component: NotFound
    }
  ]
});
const access = ["/", "/Login", "/View"];
router.beforeEach((to, from, next) => {
  console.log(to.fullPath);
  access.includes(to.fullPath)
    ? next()
    : getStore({ name: "login" })
    ? next()
    : next("/Login");
});
export default router;
