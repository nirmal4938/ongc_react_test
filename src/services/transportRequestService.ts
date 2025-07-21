import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/transport-request";

export const GetAllRequestData = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetRequestDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddRequestData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const DeleteRequestById = (id: number) => {
  return axiosDelete(`${prefix}/${id}`);
};

export const GetAllRequestVehicleData = (query: string) => {
  return axiosGet(`/transport-request-vehicle${query}`);
};

export const AddRequestVehicleData = (data: object) => {
  return axiosPost(`/transport-request-vehicle`, data);
};

export const DeleteRequestVehicleById = (id: number, query: string) => {
  return axiosDelete(`/transport-request-vehicle/${id}${query}`);
};

export const UpdateRequestVehicleData = (data: object, id: string) => {
  return axiosPut(`/transport-request-vehicle/${id}`, data);
};

export const GetRequestVehicleDetailById = (id: string) => {
  return axiosGet(`/transport-request-vehicle/${id}`);
};
