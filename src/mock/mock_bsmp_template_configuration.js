import Mock from "mockjs";
import store from "@/store";
export default ({ mock }) => {
  if (!mock) return;
  Mock.mock("/configurationList", "get", opt => {
    return store.getters.configurationList_t(opt.body);
  });
  Mock.mock("/configurationType", "get", opt => {
    return store.getters.configurationType_t(opt.body);
  });
};
