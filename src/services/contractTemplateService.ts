import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/contract-template";

export const GetAllContractTemplate = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetContractTemplateData = (query: string) => {
  return axiosGet(`${prefix}/get-contract-template-data${query}`);
};

export const GetRotationWiseContractTemplateData = (query: string) => {
  return axiosGet(`${prefix}/get-contract-template-rotation-data${query}`);
};

export const GetContractTemplateDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddContractTemplateData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditContractTemplateData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteContractTemplate = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};

export const UpdateContractTemplateStatus = (id: string, data: object) => {
  return axiosPut(`${prefix}/status/${id}`, data);
};
