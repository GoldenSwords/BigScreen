import { removeStore } from "@/plugins/util/store";
const Login = {
  state: {
    isLogin: false
  },
  mutations: {
    Login(state) {
      state.isLogin = true;
    },
    loginOut(state) {
      state.isLogin = false;
      removeStore({ name: "login" });
    }
  },
  actions: {},
  getters: {
    checkLogin: state => {
      return state.isLogin;
    }
  }
};
export default Login;
