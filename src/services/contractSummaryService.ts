import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/employee-contract";

export const GetAllContractSummary = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllEndContractEmployeeList = (query: string) => {
  return axiosGet(`${prefix}/employee-contract-end${query}`);
};

export const GetEmployeeContractNumber = () => {
  return axiosGet(`${prefix}/get-contract-number`);
};

export const GetContractSummaryDataById = (id: string, query?: string) => {
  return axiosGet(`${prefix}/${id}/${query}`);
};

export const AddContractSummaryData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const EditEndContractList = (data:{
  employeeId: number[]|undefined;
  endDate: string;
}) => {
  return axiosPut(`${prefix}/update-contract-end`,data);
};

export const EditContractSummaryData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteContractSummary = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
