import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/message";

export const GetAllMessage = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};
export const GetAllSalaryMessageEmployeeSuggestiveDropdownData = (query: string) => {
  return axiosGet(`${prefix}/get-salary-message-employee-option/${query}`);
};

export const GetAllSalaryMessage = (query: string) => {
  return axiosGet(`${prefix}/get-salary-message${query}`);
};
export const GetMessageDataById = (id: string) => {
  return axiosGet(`${prefix}/${id}`);
};

export const AddMessageData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};
export const AddSalaryMessageData = (data: object) => {
  return axiosPost(`${prefix}/add-salary-message`, data);
};


export const EditMessageData = (data: object, id: string) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteMessage = (id: number) => {
  return axiosDelete(`${prefix}/` + id);
};
