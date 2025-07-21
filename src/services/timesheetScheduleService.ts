import { axiosGet, axiosPut } from "../axios/axios";

const prefix = "/timesheet-schedule";

export const GetAllTimesheetSchedule = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetTimesheetScheduleDataById = (id: string | number) => {
  return axiosGet(`${prefix}/${id}`);
};

export const UpdateTimesheetSchedule = (data: object) => {
  return axiosPut(`${prefix}`, data);
};
