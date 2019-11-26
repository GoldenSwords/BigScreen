import Mock from "mockjs";
import store from "@/store";
export default ({ mock }) => {
  if (!mock) return;
  Mock.mock("/login", "get", opt => {
    return store.getters.login(JSON.parse(opt.body));
  });
  Mock.mock("/loginOut", "get", () => {
    store.commit("loginOut");
    return { status: true, msg: "success" };
  });
  Mock.mock("/menuAll", "get", opt => {
    return store.getters.menuall(JSON.parse(opt.body));
  });
  Mock.mock("/BaseCompoList", "get", opt => {
    return store.getters.getBaseCompoList(JSON.parse(opt.body));
  });
  Mock.mock("/BaseCompoRelations", "get", opt => {
    return store.getters.BaseCompoRelations(JSON.parse(opt.body));
  });
  Mock.mock("/BaseType", "get", opt => {
    return store.getters.getBaseType(JSON.parse(opt.body));
  });
  Mock.mock("/findBaseCompCachcade", "get", opt => {
    return store.getters.findBaseCompCachcade(JSON.parse(opt.body));
  });
  Mock.mock("/componentsDetail", "get", opt => {
    return store.getters.componentsDetail(JSON.parse(opt.body));
  });
  Mock.mock("/getBaseCompoDetail", "get", opt => {
    return store.getters.getBaseCompoDetail(JSON.parse(opt.body));
  });
  Mock.mock("/saveCompoTemplate", "get", opt => {
    return store.getters.saveCompoTemplate(JSON.parse(opt.body));
  });
  /**
   * 组件
   * **/
  //组件模板列表
  Mock.mock("/componentsTemplateList", "get", opt => {
    return store.getters.componentsTemplateList(JSON.parse(opt.body));
  });
  //组件模板详情
  Mock.mock("/componentsTemplateDetail", "get", opt => {
    return store.getters.componentsTemplateDetail(JSON.parse(opt.body));
  });
  //组件模块列表
  Mock.mock("/getCompoTempList", "get", opt => {
    return store.getters.getCompoTempList(JSON.parse(opt.body));
  });
  //组件面板列表
  Mock.mock("/getPanelTemplateList", "get", opt => {
    return store.getters.getPanelTemplateList(JSON.parse(opt.body));
  });
  /**
   * 配置项
   * **/
  //获取配置项模板
  Mock.mock("/getComponentBaseConfigTemplateList", "get", opt => {
    return store.getters.getComponentBaseConfigTemplateList(
      JSON.parse(opt.body)
    );
  });
  // 基础配置项列表
  Mock.mock("/BaseTypeList", "get", opt => {
    return store.getters.BaseTypeList(JSON.parse(opt.body));
  });
  //删除配置项模板
  Mock.mock("/delComponentConfigTemplate", "get", opt => {
    return store.getters.delComponentConfigTemplate(JSON.parse(opt.body));
  });
  //配置项模板详情
  Mock.mock("/getComponentConfigTemplateDetail", "get", opt => {
    return store.getters.getComponentConfigTemplateDetail(JSON.parse(opt.body));
  });
  //更新配置项模板
  Mock.mock("/updateComponentConfigTemplate", "get", opt => {
    return store.getters.updateComponentConfigTemplate(JSON.parse(opt.body));
  });
  //新增模板
  Mock.mock("/AddComponentConfigTemplate", "get", opt => {
    return store.getters.AddComponentConfigTemplate(JSON.parse(opt.body));
  });
  //移除基础配置
  Mock.mock("/DelConfigTemplateInst", "get", opt => {
    return store.getters.DelConfigTemplateInst(JSON.parse(opt.body));
  });
  //插件列表
  Mock.mock("/PluginsDataList", "get", opt => {
    return store.getters.PluginsDataList(JSON.parse(opt.body));
  });
};
