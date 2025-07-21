import { axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/employee-leave";

export const GetAllEmployeeLeave = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetEmployeeLeaveDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddEmployeeLeaveData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const UpdateEmployeeLeave = (id: string, data: object) => {
  return axiosPut(`${prefix}/updateLeave/${id}`, data);
};

export const UpdateEmployeeLeaveStatusById = (id: string) => {
  return axiosPut(`${prefix}/status/${id}`, {});
};

export const GetEmployeeLastLeaveDataByEmployeeId = (id: number) => {
  return axiosGet(`${prefix}/lastLeave/${id}`);
};

export const GetEmployeeLeaveDetail = (id: string) => {
  return axiosGet(`${prefix}/pdf-data/${id}`);
};
