import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/reliquat-payment";

export const GetAllReliquatPayment = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetReliquatPaymentDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddReliquatPaymentData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditReliquatPaymentData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteReliquatPayment = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
