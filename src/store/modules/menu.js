import { makeTree } from "@/plugins/util/util";
const Menu = {
  state: {
    idKey: "id",
    pidKey: "pid",
    childKey: "children",
    menuList: [
      {
        id: 1,
        menuName: "首页",
        icon: "iconfont-#iconcaidan",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 2,
        menuName: "系统管理",
        icon: "iconfont-#icondaping",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 3,
        menuName: "CanvasDemo",
        icon: "",
        path: "/CanvasDemo",
        component: "views/canvas/CanvasDemo",
        type: 0,
        pid: 1
      },
      {
        id: 4,
        menuName: "三维风暴",
        icon: "",
        path: "/ThreeStorm",
        component: "views/three/ThreeStorm",
        type: 0,
        pid: 1
      },
      {
        id: 5,
        menuName: "贝赛尔曲线分析",
        icon: "",
        path: "/CanvasBesselAly",
        component: "views/canvas/CanvasBesselAly",
        type: 0,
        pid: 1
      },
      {
        id: 6,
        menuName: "可编辑流线",
        icon: "",
        path: "/CanvasFlowsheet",
        component: "views/canvas/CanvasFlowsheet",
        type: 0,
        pid: 1
      },
      {
        id: 9,
        menuName: "CSS拖放",
        icon: "",
        path: "/CssDrag",
        component: "views/css/CssDrag",
        type: 0,
        pid: 1
      },
      {
        id: 10,
        menuName: "游戏",
        icon: "iconfont-#iconyouxi",
        path: "/Game",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 11,
        menuName: "扫雷",
        icon: "iconfont-#icondilei1",
        path: "/mineSweeping",
        component: "views/game/mineSweeping",
        type: 0,
        pid: 10
      },
      {
        id: 12,
        menuName: "拖拽框",
        icon: "iconfont-#icondilei1",
        path: "/DragPage",
        component: "components/DragPage",
        type: 0,
        pid: 2
      }
    ],
    menuTree: []
  },
  mutations: {},
  actions: {},
  getters: {
    menuadd: state => menu => {
      let id = -1;
      state.menuList.map(item => {
        id = id <= item.id ? item.id + 1 : id;
      });
      menu.id = id;
      state.menuList.push(menu);
      state.menuTree.splice(0, state.menuTree.length);
      state.menuTree = makeTree(
        state.menuList,
        state.idKey,
        state.pidKey,
        state.childKey
      );
      return { status: true, msg: "成功" };
    },
    menuall: state => menu => {
      if (state.menuTree.length === 0) {
        state.menuTree.splice(0, state.menuTree.length);
        state.menuTree = makeTree(
          state.menuList,
          state.idKey,
          state.pidKey,
          state.childKey
        );
      }
      return { data: menu, status: true, msg: state.menuTree };
    }
  }
};
export default Menu;
