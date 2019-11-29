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
        icon: "el-icon-box",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 2,
        menuName: "系统管理",
        icon: "el-icon-s-tools",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 3,
        menuName: "组件管理",
        icon: "el-icon-s-operation",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 4,
        menuName: "LeafLet",
        icon: "el-icon-map-location",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 5,
        menuName: "Three3D",
        icon: "el-icon-s-promotion",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 6,
        menuName: "Demo",
        icon: "el-icon-s-order",
        path: "/HomePage",
        component: "Root",
        type: 0,
        pid: -1
      },
      {
        id: 7,
        menuName: "3D示例",
        icon: "",
        path: "/ThreeDemo",
        component: "views/three/ThreeDemo",
        type: 0,
        pid: 1
      },
      {
        id: 8,
        menuName: "Three",
        icon: "",
        path: "/baseConfig",
        component: "Layout",
        type: 0,
        pid: 1
      },
      {
        id: 9,
        menuName: "语音",
        icon: "",
        path: "/componentConfig",
        component: "views/componentConfig",
        type: 0,
        pid: 1
      },
      {
        id: 10,
        menuName: "更多产品",
        icon: "",
        path: "/Dict",
        component: "views/baseConfig/dictConfig",
        type: 0,
        pid: 1
      },
      {
        id: 11,
        menuName: "纹理盒子",
        icon: "",
        path: "/ThreeLoader",
        component: "views/three/ThreeLoader",
        type: 0,
        pid: 8
      },
      {
        id: 12,
        menuName: "文本",
        icon: "",
        path: "/ThreeText",
        component: "views/three/ThreeText",
        type: 0,
        pid: 8
      },
      {
        id: 13,
        menuName: "多镜头",
        icon: "",
        path: "/ThreeSenceMany",
        component: "views/three/ThreeSenceMany",
        type: 0,
        pid: 8
      },
      {
        id: 14,
        menuName: "测试",
        icon: "",
        path: "/NumberAnimation",
        component: "views/three/ThreePlane",
        type: 0,
        pid: 8
      },
      {
        id: 15,
        menuName: "数字滚动",
        icon: "",
        path: "/Bar",
        component: "views/demo/NumberAnimationBox",
        type: 0,
        pid: 8
      },
      {
        id: 16,
        menuName: "黑名单",
        icon: "",
        path: "/Bar",
        component: "views/echarts/bar",
        type: 0,
        pid: 8
      },
      {
        id: 16,
        menuName: "菜单管理",
        icon: "",
        path: "/MenuConfig",
        component: "views/baseConfig/MenuConfig",
        type: 0,
        pid: 2
      },
      {
        id: 17,
        menuName: "角色管理",
        icon: "",
        path: "/RoleConfig",
        component: "views/baseConfig/RoleConfig",
        type: 0,
        pid: 2
      },
      {
        id: 18,
        menuName: "基础项管理",
        icon: "",
        path: "/CompoBaseConfig",
        component: "views/compo/CompoBaseConfigTemplatePage",
        type: 0,
        pid: 3
      },
      {
        id: 19,
        menuName: "组件扩展管理",
        icon: "",
        path: "/PluginConfig",
        component: "views/compo/PluginConfig",
        type: 0,
        pid: 3
      },
      {
        id: 20,
        menuName: "组件管理",
        icon: "",
        path: "/CompConfig",
        component: "views/compo/CompConfig",
        type: 0,
        pid: 3
      },
      {
        id: 21,
        menuName: "地图",
        icon: "",
        path: "/map",
        component: "views/leaflet/map",
        type: 0,
        pid: 4
      },
      {
        id: 22,
        menuName: "地球",
        icon: "",
        path: "/ThreeEarth",
        component: "views/three/ThreeEarth",
        type: 0,
        pid: 5
      },
      {
        id: 23,
        menuName: "测试",
        icon: "",
        path: "/Demo",
        component: "views/demo/iframe",
        type: 0,
        pid: 6
      },
      {
        id: 24,
        menuName: "方块",
        icon: "",
        path: "/ThreeCube",
        component: "views/three/ThreeCube",
        type: 0,
        pid: 5
      },
      {
        id: 25,
        menuName: "CanvasDemo",
        icon: "",
        path: "/CanvasDemo",
        component: "views/canvas/CanvasDemo",
        type: 0,
        pid: 6
      },
      {
        id: 26,
        menuName: "大屏管理",
        icon: "",
        path: "/ScreenConfig",
        component: "views/compo/ScreenInstance",
        type: 0,
        pid: 3
      },
      {
        id: 27,
        menuName: "黑名单",
        icon: "",
        path: "/Bar",
        component: "views/echarts/bar",
        type: 0,
        pid: 8
      },
      {
        id: 28,
        menuName: "黑名单",
        icon: "",
        path: "/Bar",
        component: "views/echarts/bar",
        type: 0,
        pid: 8
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
