import { axiosGet } from "../axios/axios";

const prefix = "/reliquat-calculation";

export const GetAllReliquatCalculations = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetAllReliquatCalculationsV2 = (query: string) => {
  return axiosGet(`/reliquat-calculation-v2${query}`);
};

export const GetEmployeeReliquat = (query: string) => {
  return axiosGet(`/reliquat-calculation-v2/get-employee-reliquat${query}`);
};
