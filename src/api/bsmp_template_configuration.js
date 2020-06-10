import mock from "@/mock/mock_bsmp_template_configuration";
import axios from "axios/index";
export const configurationList = opt => {
  return axios.get("/configurationList", {
    data: opt
  });
};
export const configurationType = opt => {
  return axios.get("/configurationType", {
    data: opt
  });
};
mock({ mock: true });
