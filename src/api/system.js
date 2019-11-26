import mock from "@/mock";
import axios from "axios";

export const login = opt => {
  return axios.get("/login", {
    data: opt
  });
};
export const loginout = opt => {
  return axios.get("/loginOut", {
    data: opt
  });
};
mock({ mock: true });
