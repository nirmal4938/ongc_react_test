import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/clients";

export const GetAllClient = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetClientSearchDropdownData = (query: string) => {
  return axiosGet(`${prefix}/get-clients-for-search-dropdown/${query}`);
};

export const GetClientData = (query: string) => {
  return axiosGet(`${prefix}/get-client-data/${query}`);
};

export const GetClientDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddClientData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditClientData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteClient = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};

export const UpdateClientStatus = (id: string, data: object) => {
  return axiosPut(`${prefix}/status/${id}`, data);
};

export const GetClientDataBySlug = (slug: string) => {
  return axiosGet(`${prefix}/get-slug-data/${slug}`);
};

export const getClientFonction = (clientId: string) => {
  return axiosGet(`/clients/get-all-fonction/${clientId}`);
};
