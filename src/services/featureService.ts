import { axiosGet } from "../axios/axios";

const prefix = "/feature";

export const GetAllFeature = () => {
  return axiosGet(`${prefix}`);
};
