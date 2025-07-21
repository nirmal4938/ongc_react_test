import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/bonus-type";

export const GetAllBonusType = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetBonusTypeData = () => {
  return axiosGet(`${prefix}/get-bonus-type-data`);
};

export const GetBonusTypeDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddBonusTypeData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditBonusTypeData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteBonusType = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};

export const UpdateBonusTypeStatus = (id: string, data: object) => {
  return axiosPut(`${prefix}/status/${id}`, data);
};
