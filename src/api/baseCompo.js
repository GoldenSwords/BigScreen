import mock from "@/mock";
import axios from "axios";
//基础配置
//获取配置项模板
export const getComponentBaseConfigTemplateList = opt => {
  return axios.get("/getComponentBaseConfigTemplateList", {
    data: opt
  });
};
export const BaseCompoList = opt => {
  return axios.get("/BaseCompoList", {
    data: opt
  });
};
export const BaseCompoRelations = opt => {
  return axios.get("/BaseCompoRelations", {
    data: opt
  });
};
export const BaseType = opt => {
  return axios.get("/BaseType", {
    data: opt
  });
};
export const findBaseCompCachcade = opt => {
  return axios.get("/findBaseCompCachcade", {
    data: opt
  });
};
export const componentsList = opt => {
  return axios.get("/componentsList", {
    data: opt
  });
};
export const getBaseCompoDetail = opt => {
  return axios.get("/getBaseCompoDetail", {
    data: opt
  });
};
//基础配置
//组件模板列表
export const componentsTemplateList = opt => {
  return axios.get("/componentsTemplateList", {
    data: opt
  });
};
//组件详情
export const componentsTemplateDetail = opt => {
  return axios.get("/componentsTemplateDetail", {
    data: opt
  });
};
//获取配置选项组件
export const BaseTypeList = opt => {
  return axios.get("/BaseTypeList", {
    data: opt
  });
};
//配置项模板详情
export const getComponentConfigTemplateDetail = opt => {
  return axios.get("/getComponentConfigTemplateDetail", {
    data: opt
  });
};
//删除配置项模板
export const delComponentConfigTemplate = opt => {
  return axios.get("/delComponentConfigTemplate", {
    data: opt
  });
};
//更新配置项模板
export const updateComponentConfigTemplate = opt => {
  return axios.get("/updateComponentConfigTemplate", {
    data: opt
  });
};
//更新模板
export const AddComponentConfigTemplate = opt => {
  return axios.get("/AddComponentConfigTemplate", {
    data: opt
  });
};
//移除基础配置实例
export const DelConfigTemplateInst = opt => {
  return axios.get("/DelConfigTemplateInst", {
    data: opt
  });
};
//新增组件模板
export const saveCompoTemplate = opt => {
  return axios.get("/saveCompoTemplate", {
    data: opt
  });
};
//组件模块列表
export const getCompoTempList = opt => {
  return axios.get("/getCompoTempList", {
    data: opt
  });
};
//组件面板列表
export const getPanelTemplateList = opt => {
  return axios.get("/getPanelTemplateList", {
    data: opt
  });
};
//插件列表
export const PluginsDataList = opt => {
  return axios.get("/PluginsDataList", {
    data: opt
  });
};
mock({ mock: true });
