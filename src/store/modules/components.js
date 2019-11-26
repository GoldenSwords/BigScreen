import { getMax } from "@/plugins/util/util";
const Components = {
  state: {
    /**
     * 配置项基础类型
     * **/
    baseConfig: [
      {
        id: 1,
        name: "Number数字",
        key: "number",
        component: "views/compo/base/LNumber",
        model: 1,
        type: "Number",
        code: "LNumber"
      },
      {
        id: 2,
        name: "Text文本",
        key: "text",
        component: "views/compo/base/LInput",
        model: "1",
        type: "String",
        code: "LInput"
      },
      {
        id: 3,
        name: "Object对象",
        key: "textarea",
        component: "views/compo/base/LTextarea",
        model: {},
        type: "Object",
        code: "LTextarea"
      },
      {
        id: 4,
        name: "Color对象",
        key: "color",
        component: "views/compo/base/LColor",
        model: "",
        type: "Text",
        code: "LColor"
      }
    ],
    /**
     * 配置项基础类型实例
     * **/
    baseListInst: [
      {
        name: "移动速度",
        key: "speed",
        component: "views/compo/base/LNumber",
        model: 1,
        type: "Number",
        code: "LNumber",
        disabled: false,
        pid: 1,
        id: 0
      },
      {
        name: "标题",
        key: "title",
        component: "views/compo/base/LInput",
        model: "我是标题",
        type: "String",
        code: "LInput",
        disabled: false,
        pid: 1,
        id: 1
      },
      {
        name: "内部配置项",
        key: "textarea",
        component: "views/compo/base/LTextarea",
        model: { a: 1, b: 2 },
        type: "Object",
        code: "LTextarea",
        disabled: false,
        pid: 1,
        id: 2
      },
      {
        name: "横坐标",
        key: "x",
        component: "views/compo/base/LNumber",
        model: 100,
        type: "Number",
        code: "LNumber",
        disabled: false,
        pid: 2,
        id: 3
      },
      {
        name: "纵坐标",
        key: "y",
        component: "views/compo/base/LNumber",
        model: 100,
        type: "Number",
        code: "LNumber",
        disabled: false,
        pid: 2,
        id: 4
      },
      {
        name: "宽度",
        key: "width",
        component: "views/compo/base/LNumber",
        model: 100,
        type: "Number",
        code: "LNumber",
        disabled: false,
        pid: 2,
        id: 5
      },
      {
        name: "高度",
        key: "height",
        component: "views/compo/base/LNumber",
        model: 100,
        type: "Number",
        code: "LNumber",
        disabled: false,
        pid: 2,
        id: 6
      },
      {
        name: "背景色",
        key: "color",
        component: "views/compo/base/LColor",
        model: "rgba(255,255,0,1)",
        type: "String",
        code: "LColor",
        disabled: false,
        pid: 2,
        id: 7
      }
    ],
    /**
     * 配置项模板
     * **/
    ComponentBaseConfigTemplateList: [
      {
        name: "配置项一",
        key: "Option",
        updatetime: "2019-11-25T08:23:18.636Z",
        id: 1
      },
      {
        name: "基础配置",
        key: "moveOption",
        updatetime: "2019-11-25T08:23:18.636Z",
        id: 2
      }
    ],
    /**
     * 配置项实例
     * **/
    ComponentBaseConfigTemplateListInst: [],
    /**
     * 扩展项模板
     * **/
    pluginsList: [
      {
        id: 1,
        name: "鼠标事件扩展",
        key: "MouseEvent",
        status: 0,
        component: "plugins/mouse/CompMouse"
      },
      {
        id: 2,
        name: "地图飞线扩展",
        key: "MapFlyLine",
        status: 1,
        component: "plugins/mouse/FlyLines"
      }
    ],
    /**
     * 扩展项实例
     * **/
    pluginsListInst: [],
    /**
     * 扩展-组件 关系组
     * **/
    pluginsCompRelations: [],
    /**
     * 组件模板
     * **/
    componentsList: [
      {
        id: 1,
        type: 1,
        component: "views/compo/components/BaseEchartsMap",
        code: "BaseEchartsMap",
        name: "地图组件",
        updatetime: new Date().toDateString()
      },
      {
        id: 2,
        type: 1,
        component: "views/compo/components/BaseEchartsBar",
        code: "BaseEchartsBar",
        name: "柱状图组件",
        updatetime: new Date().toDateString()
      },
      {
        id: 3,
        type: 0,
        component: "views/compo/panel/BasePanel",
        code: "BasePanel",
        name: "空面板",
        updatetime: new Date().toDateString()
      },
      {
        id: 4,
        type: 0,
        component: "views/compo/panel/ChangePanel",
        code: "BasePanel",
        name: "切换面板",
        updatetime: new Date().toDateString()
      }
    ],
    /**
     * 组件实例
     * **/
    componentsListInst: [],
    /**
     * 组件-配置 关系组
     * **/
    componentsBaseRelations: [
      { configId: 1, componentsId: 1 },
      { configId: 1, componentsId: 2 },
      { configId: 2, componentsId: 3 }
    ]
  },
  mutations: {},
  actions: {},
  getters: {
    //配置项模板管理
    // 获取配置项模板
    getComponentBaseConfigTemplateList: state => () => {
      return {
        status: true,
        msg: state.ComponentBaseConfigTemplateList
      };
    },
    //移除基础配置实例
    DelConfigTemplateInst: state => menu => {
      state.baseListInst.splice(
        state.baseListInst.findIndex(item => {
          return item.id === menu.id;
        }),
        1
      );
      return {
        status: true,
        msg: "success"
      };
    },
    // 删除配置项模板
    delComponentConfigTemplate: state => menu => {
      const index = state.ComponentBaseConfigTemplateList.findIndex(item => {
        return item.id === menu.id;
      });
      state.ComponentBaseConfigTemplateList.splice(index, 1);
      for (let i = 0; i < state.baseListInst.length; i++) {
        if (state.baseListInst[i].pid === menu.id) {
          state.baseListInst.splice(i, 1);
          i--;
        }
      }
      return {
        msg: "success",
        status: true
      };
    },
    // 更新配置项模板
    updateComponentConfigTemplate: state => menu => {
      const obj = JSON.parse(JSON.stringify(menu));
      const child = JSON.parse(JSON.stringify(obj.child));
      obj.updatetime = new Date();
      const index = state.ComponentBaseConfigTemplateList.findIndex(item => {
        return item.id === obj.id;
      });
      state.ComponentBaseConfigTemplateList[index] = obj;
      let bool = false;
      //更新基础配置实例
      child.forEach(item => {
        bool = false;
        item.pid = obj.id;
        for (let i = 0; i < state.baseListInst.length; i++) {
          if (state.baseListInst[i].id === item.id) {
            item.updatetime = new Date();
            state.baseListInst[i] = item;
            bool = true;
          }
        }
        if (!bool) {
          item.id = getMax(state.baseListInst, "id");
          state.baseListInst.push(item);
        }
      });
      return {
        msg: "success",
        status: true
      };
    },
    // 获取配置选项组件
    BaseTypeList: state => menu => {
      return {
        data: menu,
        msg: state.baseConfig,
        status: true
      };
    },
    // 新增实例配置项
    AddComponentConfigTemplate: state => menu => {
      const obj = JSON.parse(JSON.stringify(menu));
      const child = JSON.parse(JSON.stringify(obj.child));
      obj.updatetime = new Date();
      obj.id = getMax(state.ComponentBaseConfigTemplateList, "id");
      delete obj.child;
      delete obj._uuid;
      state.ComponentBaseConfigTemplateList.push(obj);
      child.forEach(item => {
        item.pid = obj.id;
        item._uuid = undefined;
        item.id = getMax(state.baseListInst, "id");
        state.baseListInst.push(item);
      });
      return {
        msg: "success",
        status: true
      };
    },
    //配置项模板详情
    getComponentConfigTemplateDetail: state => id => {
      const obj = state.ComponentBaseConfigTemplateList.find(item => {
        return item.id === Number(id);
      });
      const child = [];
      // 查询对应实例基础配置
      for (let i = 0; i < state.baseListInst.length; i++) {
        if (state.baseListInst[i].pid === id) {
          child.push(state.baseListInst[i]);
        }
      }
      obj.child = child;
      return {
        msg: obj,
        status: true
      };
    },
    //组件管理
    /**
     * 更新组件模板配置
     * **/
    saveCompoTemplate: state => comp => {
      let config = null;
      let plugin = null;
      if (comp.config) {
        config = JSON.parse(JSON.stringify(comp.config.configId));
      }
      if (comp.plugin) {
        plugin = JSON.parse(JSON.stringify(comp.plugin));
      }
      delete comp.config;
      delete comp.plugin;
      comp.updatetime = new Date().toDateString();
      if (comp.id !== undefined) {
        for (let i = 0; i < state.componentsBaseRelations.length; i++) {
          if (state.componentsBaseRelations[i].componentsId === comp.id) {
            state.componentsBaseRelations[i].configId = config;
            break;
          }
        }
        state.componentsList.forEach(item => {
          if (item.id === comp.id) {
            for (const i in comp) {
              item[i] = comp[i];
            }
          }
        });
      } else {
        comp.id = getMax(state.componentsList, "id");
        state.componentsList.push(comp);
      }
      // 更新关系项
      if (config) {
        let cog = state.ComponentBaseConfigTemplateList.find(item => {
          return config === item.id;
        });
        cog = JSON.parse(JSON.stringify(cog));
        // cog.id = getMax(state.ComponentBaseConfigTemplateList, "id");
        // state.ComponentBaseConfigTemplateList.push(cog);
        state.componentsBaseRelations.push({
          componentsId: comp.id,
          configId: cog.id
        });
      }
      console.log(config, plugin);
      return {
        status: true,
        msg: "success"
      };
    },
    /****/
    /**
     * 获取组件列表
     * **/
    componentsTemplateList: state => comp => {
      return {
        data: comp,
        msg: state.componentsList,
        status: true
      };
    },
    /**
     * 组件模块列表
     * **/
    getCompoTempList: state => comp => {
      return {
        data: comp,
        msg: state.componentsList.filter(item => {
          return item.type === 1;
        }),
        status: true
      };
    },
    /**
     * 组件面板列表
     * **/
    getPanelTemplateList: state => comp => {
      const data = state.componentsList.filter(item => {
        return item.type === 0;
      });
      return {
        data: comp,
        msg: data,
        status: true
      };
    },
    /**
     * 获取组件详情
     * **/
    componentsTemplateDetail: state => comp => {
      const id = comp.id;
      const obj = state.componentsList.find(item => {
        return item.id === id;
      });
      for (let i = 0; i < state.componentsBaseRelations.length; i++) {
        if (state.componentsBaseRelations[i].componentsId === id) {
          obj.config = state.componentsBaseRelations[i];
          break;
        }
      }
      const plugin = [];
      for (let i = 0; i < state.pluginsCompRelations.length; i++) {
        if (state.pluginsCompRelations[i].componentsId === id) {
          const pluginObj = JSON.parse(
            JSON.stringify(state.pluginsCompRelations[i])
          );
          for (let i = 0; i < state.componentsBaseRelations.length; i++) {
            if (
              state.componentsBaseRelations[i].componentsId === pluginObj.id
            ) {
              pluginObj.config = state.componentsBaseRelations[i];
              break;
            }
          }
          plugin.push(pluginObj);
        }
      }
      obj.plugin = plugin;
      return {
        msg: obj,
        status: true
      };
    },
    //获取插件列表
    PluginsDataList: state => () => {
      return {
        status: true,
        msg: state.pluginsList
      };
    },

    componentsList: state => id => {
      return {
        data: id,
        msg: state.componentsList,
        status: true
      };
    },
    findBaseCompCachcade: state => id => {
      const obj = state.ComponentBaseConfigTemplateList.find(item => {
        return item.id === Number(id);
      });
      const child = [];
      for (let i = 0; i < state.baseListInst.length; i++) {
        if (state.baseListInst[i].pid === id) {
          child.push(state.baseListInst[i]);
        }
      }
      obj.child = child;
      return {
        msg: obj,
        status: true
      };
    },
    getBaseCompoDetail: state => menu => {
      const obj = state.ComponentBaseConfigTemplateList.find(item => {
        return item.id === menu.id;
      });
      const child = [];
      for (let i = 0; i < state.baseListInst.length; i++) {
        if (state.baseListInst[i].pid === obj.id) {
          child.push(state.baseListInst[i]);
        }
      }
      obj.child = child;
      return {
        msg: obj,
        status: true
      };
    },
    // 查询实例配置
    getBaseCompoList: state => menu => {
      return {
        menu: menu,
        msg: state.ComponentBaseConfigTemplateList,
        status: true
      };
    }
  }
};
export default Components;
