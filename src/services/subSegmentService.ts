import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/sub-segment";

export const GetAllSubSegment = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetSubSegmentData = (query: string) => {
  return axiosGet(`${prefix}/get-sub-segment-data${query}`);
};

export const GetSubSegmentDataById = (id: string | number) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddSubSegmentData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditSubSegmentData = (data: object, id: string | number) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteSubSegment = (id: number | string) => {
  return axiosDelete(`${prefix}/` + id);
};

export const GetSubSegmentDataBySlug = (slug: string) => {
  return axiosGet(`${prefix}/get-slug-data/${slug}`);
};

export const UpdateSubSegmentStatus = (id: string, data: object) => {
  return axiosPut(`${prefix}/status/${id}`, data);
};
