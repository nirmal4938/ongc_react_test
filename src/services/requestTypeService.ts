import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/request-type";

export const GetAllRequestType = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetRequestTypeData = () => {
  return axiosGet(`${prefix}/get-request-type-data`);
};

export const GetRequestTypeDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddRequestTypeData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditRequestTypeData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const ChangeRequestTypeStatus = (data: object, id: string) => {
  return axiosPut(`${prefix}/status/${id}`, data);
};

export const DeleteRequestType = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
