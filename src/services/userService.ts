import { axiosDelete, axiosGet, axiosPost, axiosPut } from "../axios/axios";

const prefix = "/users";

export const GetAllUser = (query: string) => {
  return axiosGet(`${prefix}${query}`);
};

export const GetUserSearchDropdown = (query: string) => {
  return axiosGet(`${prefix}/get-users-for-search-dropdown${query}`);
};

export const GetUserDataById = (id: string, query?: string) => {
  return axiosGet(`${prefix}/${id}${query ? query : ""}`);
};
export const GetMessageUserDataById = (data:object,query?: string,) => {
  return axiosPost(`${prefix}/message-user${query ? query : ""}`,data);
};


export const GetUserDataByRoleId = (id: string, query?: string) => {
  return axiosGet(`${prefix}/${id}${query ? query : ""}`);
};

export const AddUserData = (data: object) => {
  return axiosPost(`${prefix}`, data);
};

export const SendUserResetLink = (data: object) => {
  return axiosPost(`${prefix}/send-link`, data);
};

export const EditUserData = (data: object, id: string, query?: string) => {
  return axiosPut(`${prefix}/${id}${query ? query : ""}`, data);
};

export const ChangeUserStatus = (id: string, query?: string) => {
  return axiosPut(
    `${prefix}/change-user-status/${id}${query ? query : ""}`,
    {}
  );
};

export const DeleteUser = (id: number, query?: string) => {
  return axiosDelete(`${prefix}/${id}${query ? query : ""}`);
};

export const UpdateUserData = (data: object, id: string) => {
  return axiosPut(`${prefix}/update-user-client/${id}`, data);
};

export const UpdateUserSegmentData = (
  data: object,
  id: string,
  query?: string
) => {
  return axiosPut(`${prefix}/update-user-segments/${id}${query ?? ""}`, data);
};

export const DeleteUserClient = (id: number, query?: string) => {
  return axiosDelete(`${prefix}/remove-user-client/${id}${query ?? ""}`);
};

export const DeleteUserSegment = (id: number, query?: string) => {
  return axiosDelete(`${prefix}/remove-user-segment/${id}${query ?? ""}`);
};

export const GetAllManager = (query: string) => {
  return axiosGet(`${prefix}/get-user-by-role-name${query}`);
};

export const GetUserRolePermission = (query: string) => {
  return axiosGet(`${prefix}/role-permission${query}`);
};

export const LoginAsUser = (data: object, query: string) => {
  return axiosPost(`${prefix}/login-as-user${query}`, data);
};
