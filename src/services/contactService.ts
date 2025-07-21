import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/contacts";

export const GetAllContact = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetContactData = (query: string) => {
  return axiosGet(`${prefix}/get-contact-data${query}`);
};

export const GetContactDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddContactData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditContactData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteContact = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
export const GetContactDataBySlug = (slug: string) => {
  return axiosGet(`${prefix}/get-slug-data/${slug}`);
};
