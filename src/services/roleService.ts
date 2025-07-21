import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/role";

export const GetAllRole = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetRoleData = (query: string) => {
  return axiosGet(`${prefix}/get-role-data/${query}`);
};

export const GetRoleDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddRoleData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditRoleData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteRole = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
