import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/transport-driver";

export const GetAllDriverData = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllAvailableDriverData = (query: string) => {
  return axiosGet(`${prefix}/available-driver${query}`);
};

export const UpdateDriverData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const AddDriverData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const GetDriverDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const DeleteDriverById = (id: number) => {
  return axiosDelete(`${prefix}/${id}`);
};

export const GetAllDriverDocumentById = (query: string) => {
  return axiosGet(`/transport-driver-document${query}`);
};
export const AddDriverDocumentData = (data: object) => {
  return axiosPost(`/transport-driver-document`, data);
};

export const UpdateDriverDocumentByDocumentId = (data: object, id: string) => {
  return axiosPut(`/transport-driver-document/${id}`, data);
};

export const GetDriverDocumentByDocumentId = (id: string) => {
  return axiosGet(`/transport-driver-document/${id}`);
};

export const DeleteDriverDocumentById = (id: number) => {
  return axiosDelete(`/transport-driver-document/${id}`);
};
