import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/transport-vehicle";

export const GetAllVehicleData = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllAvailableVehicleData = (query: string) => {
  return axiosGet(`${prefix}/available-vehicle${query}`);
};

export const GetVehicleDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddVehicleData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const UpdateVehicleData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteVehicleById = (id: number) => {
  return axiosDelete(`${prefix}/${id}/`);
};

// for document of the vehicle
export const GetVehicleDocumentById = (query: string) => {
  return axiosGet(`/transport-vehicle-document${query}`);
};

export const AddVehicleDocumentData = (data: object) => {
  return axiosPost(`/transport-vehicle-document`, data);
};

export const GetVehicleDocumentByDocumentId = (id: string) => {
  return axiosGet(`/transport-vehicle-document/${id}`);
};
export const UpdateVehicleDocumentByDocumentId = (data: object, id: string) => {
  return axiosPut(`/transport-vehicle-document/${id}`, data);
};

export const DeleteVehicleDocumentById = (id: number) => {
  return axiosDelete(`/transport-vehicle-document/${id}`);
};
