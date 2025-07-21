import { axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/account";

export const GetAllAccountSummary = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllAccountSummaryById = (query: string) => {
  return axiosGet(`${prefix}/account-by-id${query}`);
};

export const GenerateAccountSummary = (query: string, data: object) => {
  return axiosPost(`${prefix}${query}`, data);
};

export const UpdateAccountData = (query: string, data: object) => {
  return axiosPut(`${prefix}/update-account${query}`, data);
};
