import mock from "@/mock";
import axios from "axios";

export const menuAll = opt => {
  return axios.get("/menuAll", {
    data: opt
  });
};
mock({ mock: true });
