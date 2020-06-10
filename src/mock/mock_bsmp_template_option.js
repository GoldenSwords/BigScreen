import Mock from "mockjs";
import store from "@/store";
export default ({ mock }) => {
  if (!mock) return;
  Mock.mock("/optionListTemplate", "get", () => {
    return store.getters.optionList_t();
  });
  Mock.mock("/optionDetailTemplate", "get", opt => {
    return store.getters.optionDetail_t(JSON.parse(opt.body));
  });
  Mock.mock("/addOptionTemplate", "get", opt => {
    return store.getters.addOption_t(JSON.parse(opt.body));
  });
  Mock.mock("/delOptionTemplate", "get", opt => {
    return store.getters.delOption_t(JSON.parse(opt.body));
  });
  Mock.mock("/updateOptionTemplate", "get", opt => {
    return store.getters.updateOption_t(JSON.parse(opt.body));
  });
};
