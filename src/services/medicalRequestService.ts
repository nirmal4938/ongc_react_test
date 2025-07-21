import { axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/medical-request";

export const GetAllMedicalRequest = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllMedicalExpiryData = (query: string) => {
  return axiosGet(`${prefix}/medical-expiry${query}`);
};

export const GetMedicalRequestDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddMedicalRequestData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const UpdateMedicalRequestStatusById = (id: string) => {
  return axiosPut(`${prefix}/status/${id}`, {});
};
