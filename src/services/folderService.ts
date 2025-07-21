import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/folder";

export const GetAllFolder = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetFolderData = () => {
  return axiosGet(`${prefix}/get-folder-data`);
};

export const GetFolderDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddFolderData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditFolderData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteFolder = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};

export const GetFileCountData = (id: string) => {
  return axiosGet(`${prefix}/get-file-count/${id}`);
};
