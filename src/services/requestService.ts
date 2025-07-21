import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/request";

export const GetAllRequestDocument = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetRequestDocumentDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddRequestDocumentData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const UpdateRequestDocumentStatusById = (id: string, data: object) => {
  return axiosPut(`${prefix}/status/${id}`, data);
};

export const DeleteRequestDocument = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
