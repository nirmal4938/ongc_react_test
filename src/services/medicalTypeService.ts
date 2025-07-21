import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/medical-type";

export const GetAllMedicalType = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetMedicalTypeData = () => {
  return axiosGet(`${prefix}/get-medical-type-data`);
};

export const GetMedicalTypeDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddMedicalTypeData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditMedicalTypeData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteMedicalType = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
