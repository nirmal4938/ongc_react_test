import { axiosDelete, axiosGet, axiosPut } from "../axios/axios";

const prefix = "/approve-deleted-file";

export const GetAllApproveDeletedFile = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const DeleteApproveDeletedFile = (query: string) => {
  return axiosDelete(`${prefix}/delete-file` + query);
};

export const RestoreApproveDeletedFile = (query: string,data:object) => {
  return axiosPut(`${prefix}/restore-file` + query,data);
};
