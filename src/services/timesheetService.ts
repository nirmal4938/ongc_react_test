import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/timesheet";

export const GetAllTimesheet = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetTimesheetDataById = (id: string | number) => {
  return axiosGet(`${prefix}/${id}`);
};

export const GetDropdownDetails = (id: string | number, query?: string) => {
  return axiosGet(`${prefix}/getDropdownDetails/${id}${query || ""}`);
};

export const GetTimesheetSummary = (query: string) => {
  return axiosGet(`${prefix}/pdf-datas${query}`);
};

export const AddTimesheetData = (id: string | number) => {
  return axiosPost(`${prefix}/${id}`, null);
};

export const EditTimesheetData = (data: object, id: string | number) => {
  return axiosPut(`${prefix}/${id}`, data);
};

export const DeleteTimesheet = (id: number | string) => {
  return axiosDelete(`${prefix}/` + id);
};

export const ApproveTimesheet = (data: {
  timesheetIds: number[];
  status: string;
  startDate?: Date | string;
  endDate?: Date | string;
}) => {
  return axiosPut(`${prefix}/approve`, data);
};

export const GetTimesheetReliquatAdjustmentDate = (
  id: number,
  query: string
) => {
  return axiosGet(`${prefix}/get-reliquat-adjustment-date/` + id + `${query}`);
};
