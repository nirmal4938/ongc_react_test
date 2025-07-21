import { transportSummaryEnum } from "@/enum/transport";
import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/transport";

export const GetAllSummaryData = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetTransportData = (query: string) => {
  return axiosGet(`${prefix}/get-transport-data${query}`);
};

export const AddSummaryData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};
export const UpdateSummaryData = (data: object, id: number) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteModelById = (id: number) => {
  return axiosDelete(`${prefix}/${id}/${transportSummaryEnum.Model}`);
};

export const DeleteTypeById = (id: number) => {
  return axiosDelete(`${prefix}/${id}/${transportSummaryEnum.Type}`);
};
export const DeletePositionById = (id: number) => {
  return axiosDelete(`${prefix}/${id}/${transportSummaryEnum.Position}`);
};

//for capacity
export const GetAllCapacityData = (query: string) => {
  return axiosGet(`/transport-capacity${query}`);
};

export const GetTransportCapacityData = (query: string) => {
  return axiosGet(`/transport-capacity/get-transport-capacity-data${query}`);
};

export const AddCapacity = (data: object) => {
  return axiosPost(`/transport-capacity`, data);
};

export const UpdateCapacityData = (data: object, id: number) => {
  return axiosPut(`/transport-capacity/${id}`, data);
};
export const DeleteCapacityById = (id: number) => {
  return axiosDelete(`/transport-capacity/${id}/`);
};
