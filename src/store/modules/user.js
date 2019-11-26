const User = {
  state: {
    userList: [{ id: 1, username: "admin", pwd: "admin" }]
  },
  mutations: {
    increment(state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++;
    }
  },
  actions: {
    incrementIfOddOnRootSum({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit("increment");
      }
    }
  },
  getters: {
    login: state => user => {
      const has = state.userList.findIndex(item => {
        return item.username === user.username;
      });
      const index = state.userList.findIndex(item => {
        return item.username === user.username && item.pwd === user.pwd;
      });
      if (index !== -1) {
        const current = JSON.parse(JSON.stringify(state.userList[index]));
        delete current["pwd"];
        return {
          status: true,
          msg: {
            user: current,
            role: ["admin", "user"],
            rights: []
          }
        };
      }
      return has && index === -1
        ? { status: false, msg: "用户名密码错误!" }
        : { status: false, msg: "用户不存在" };
    }
  }
};
export default User;
