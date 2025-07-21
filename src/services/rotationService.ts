import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/rotation";

export const GetAllRotation = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetRotationData = () => {
  return axiosGet(`${prefix}/get-rotation-data`);
};

export const GetRotationDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddRotationData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditRotationData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteRotation = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
