const Menu = {
  state: {
    dictList: []
  },
  mutations: {},
  actions: {},
  getters: {
    dictadd: () => {
      return { status: true, msg: "成功" };
    },
    dictupdate: () => {
      return { status: true, msg: "成功" };
    },
    dictdel: () => {
      return { status: true, msg: "成功" };
    },
    dictone: state => item => {
      const data = state.dictList.find(dict => {
        let count = 0;
        let has = 0;
        for (const i in item) {
          count++;
          if (dict[i] === item[i]) {
            has++;
          }
        }
        return has === count;
      });
      return data.id
        ? { status: true, msg: data }
        : { status: false, msg: "未找到匹配字典" };
    },
    dictall: state => {
      return { status: true, msg: state.dictList };
    }
  }
};
export default Menu;
