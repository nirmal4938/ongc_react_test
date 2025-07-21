import { axiosGet } from "../axios/axios";

const prefix = "/dashboard";

export const GetAllDashboardData = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllDashboardUsersAccountsData = (query: string) => {
  return axiosGet(`${prefix}/user-accounts${query}`);
};

export const GetAllEmployeeDetails = (query: string) => {
  return axiosGet(`${prefix}/employee-data${query}`);
};
export const GetDashboardTransportData = (query: string) => {
  return axiosGet(`${prefix}/transport-data${query}`);
};
