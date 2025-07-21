import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/employee-file";

export const GetAllEmployeeFile = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetEmployeeFileDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddEmployeeFileData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditEmployeeFileData = (data: object, id: number) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteEmployeeFile = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};

export const GetEmployeeFilePathData = (data: object) => {
  return axiosPost(`${prefix}/generate-file-path`, data);
};
