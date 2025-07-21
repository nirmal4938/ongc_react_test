import { axiosGet } from "../axios/axios";

const prefix = "/error-logs";

export const GetAllErrorLog = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetErrorLogDataByCategories = (query: string) => {
  return axiosGet(`${prefix}/categories${query}`);
};
