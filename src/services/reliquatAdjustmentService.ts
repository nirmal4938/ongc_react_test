import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/reliquat-adjustment";

export const GetAllReliquatAdjustment = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetReliquatAdjustmentDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddReliquatAdjustmentData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditReliquatAdjustmentData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteReliquatAdjustment = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
