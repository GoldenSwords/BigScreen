const Session = {
  state: {
    expiration: 10000,
    storage: {}
  },
  mutations: {
    setLocalStorage(state, parms) {
      localStorage.setItem(parms.key, parms.value);
      console.log(1);
      // state.storage[parms.key] = parms.value;
    }
  },
  actions: {
    setStorage(ctx, parms) {
      ctx.commit("setLocalStorage", parms);
    },
    getStorage(ctx, name) {
      // ctx, name
      const obj = localStorage.getItem(name);
      let res;
      try {
        res = JSON.parse(obj);
      } catch (e) {
        res = obj;
      }
      return new Promise(resolve => {
        resolve(res);
      });
    }
  },
  getters: {}
};
export default Session;
