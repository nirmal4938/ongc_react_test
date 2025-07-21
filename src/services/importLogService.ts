import { axiosGet, axiosPost } from "../axios/axios";

const prefix = "/import-log";

export const GetAllImportLogs = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetLogsById = (id: string| number) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddImportEmployeeData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};
