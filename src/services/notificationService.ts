/** @format */

import { axiosGet, axiosPost, axiosPut } from "../axios/axios";
const prefix = "/notification";

export const GetContent = (parameters?: {
  page: number;
  limit: number;
  read?: boolean;
}) => {
  return axiosGet(prefix, parameters);
};

export const MarkAllAsUnread = () => {
  return axiosPut(`${prefix}/all`, {
    isRead: true,
  });
};

export const AddNotification = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const GetAllNotificationsByAdmin = (query: string) => {
  return axiosGet(`${prefix}/all${query}`);
};

export const GetNotificationDetailById = (query: string) => {
  return axiosGet(`${prefix}/all${query}`);
};
