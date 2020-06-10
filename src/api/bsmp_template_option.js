import mock from "@/mock/mock_bsmp_template_option";
import axios from "axios/index";
export const apiAll = opt => {
  console.log(opt);
  return axios({
    url: opt.api,
    data: opt.option,
    method: opt.method
  });
};
export const optionList = opt => {
  return axios.get("/optionListTemplate", {
    data: opt
  });
};
export const optionDetail = opt => {
  return axios.get("/optionDetailTemplate", {
    data: opt
  });
};
export const addOption = opt => {
  return axios.get("/addOptionTemplate", {
    data: opt
  });
};
export const delOption = opt => {
  return axios.get("/delOptionTemplate", {
    data: opt
  });
};
export const updateOption = opt => {
  return axios.get("/updateOptionTemplate", {
    data: opt
  });
};
mock({ mock: true });
