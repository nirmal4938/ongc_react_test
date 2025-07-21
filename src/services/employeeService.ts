import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/employee";

export const GetAllEmployee = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllEmployeeSuggestiveDropdownData = (query: string) => {
  return axiosGet(`${prefix}/get-employee-option/${query}`);
};

export const GetEmployeeData = (query: string) => {
  return axiosGet(`${prefix}/get-employee-data/${query}`);
};

export const GetSegmentDropdownData = (query: string) => {
  return axiosGet(`${prefix}/get-segment-dropdown/${query}`);
};

export const GetEmployeeDataBySlug = (slug: string) => {
  return axiosGet(`${prefix}/get-slug-data/${slug}`);
};

export const GetEmployeeDataById = (id: string | number) => {
  return axiosGet(`${prefix}/${id}`);
};

export const GetEmployeeDetailById = (id: string | number) => {
  return axiosGet(`${prefix}/get-employee-detail/${id}`);
};

export const GetAllReliquatEmployee = (query: string) => {
  return axiosGet(`${prefix}/reliquat-employee/${query}`);
};

export const AddEmployeeData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const TerminateEmployeeData = (data: object, id: string | number) => {
  return axiosPut(`${prefix}/employee-terminate/${id}`, data);
};

export const ReActivateEmployeeData = (data: object, id: string | number) => {
  return axiosPut(`${prefix}/re-Activate-employee/${id}`, data);
};

export const EditEmployeeDraftData = (data: object, id: string | number) => {
  return axiosPut(`${prefix}/updateDraft/${id}`, data);
};

export const EditEmployeeData = (data: object, id: string | number) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteEmployee = (id: number | string, query?: string) => {
  return axiosDelete(`${prefix}/${query}` + id);
};

export const GetExportDataBySlug = (slug: string) => {
  return axiosGet(`${prefix}/get-slug-data/${slug}`);
};

export const UpdateEmployeeStatus = (
  id: string | number,
  data: { status: boolean }
) => {
  return axiosPut(`${prefix}/status/${id}`, data);
};

export const GetEmployeeCustomBonus = (data: object) => {
  return axiosPost(`${prefix}/get-custom-bonus`, data);
};

export const GetSlugByUserId = (clientId: number) => {
  return axiosGet(`${prefix}/get-slug-by-userId/${clientId}`);
};
