import Vuex from "vuex";
import Vue from "vue";
import User from "@/store/modules/user";
import Base from "@/store/modules/base";
import Menu from "@/store/modules/menu";
import Login from "@/store/modules/login";
import Components from "@/store/modules/components";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Base,
    User,
    Menu,
    Login,
    Components
  }
});

export default store;
