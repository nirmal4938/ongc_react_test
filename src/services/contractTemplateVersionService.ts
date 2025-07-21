import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/contract-template-version";

export const GetAllContractTemplateVersion = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetContractTemplateVersionData = (query: string) => {
  return axiosGet(`${prefix}/get-contract-template-version-data${query}`);
};

export const GetContractTemplateVersionDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const GetContractTemplateVersionLastItem = (query: string) => {
  return axiosGet(`${prefix}/last-inserted-data${query}`);
};

export const AddContractTemplateVersionData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditContractTemplateVersionData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteContractTemplateVersion = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
