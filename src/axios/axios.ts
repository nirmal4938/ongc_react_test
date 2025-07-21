/** @format */

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

import { Store } from "redux";
import { VITE_APP_API_URL } from "./../config/index";
import { ToastShow } from "@/redux/slices/toastSlice";
import { removeToken, setUser } from "@/redux/slices/userSlice";
import { setActiveClient, setClientData } from "@/redux/slices/clientSlice";

const setupAxios = (store: Store) => {
  axios.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    const storeData = store.getState();

    const authToken = storeData.user.token;
    const activeClient = storeData.client.activeClient;

    if (authToken) {
      request.headers.Authorization = `jwt ${authToken}`;
      request.headers.ClientId = activeClient;
    }
    return request;
  });
  axios.interceptors.response.use(
    (res) => {
      const toast = res?.data?.toast;
      if (toast) {
        store.dispatch(
          ToastShow({ message: res.data.message, type: res.data.response_type })
        );
      }
      return res;
    },
    (e) => {
      const toast = e.response?.data?.toast;
      if (toast) {
        store.dispatch(
          ToastShow({
            message: e.response.data.message,
            type: e.response.data.response_type,
          })
        );
      }
      const storeData = store.getState();
      if (storeData.user.token !== null) {
        if (e?.response?.status === 401 || e?.response?.status === 403) {
          if (e.response.message) {
            store.dispatch(
              ToastShow({
                message: e.response.message,
                type: e.response.data.response_type,
              })
            );
          }
          store.dispatch(removeToken());
          store.dispatch(setUser(null));
          store.dispatch(setClientData([]));
          store.dispatch(setActiveClient(0));
          localStorage.clear()
          window.location.href = "/login";
        } 
        // else if (e?.response?.status === 403) {
        //   window.location.href = "/admin/user-profile";
        // }
      }

      return e.response;
    }
  );
};

export default setupAxios;

export function axiosGet<T>(url: string, data: T | null = null) {
  return axios.get(`${VITE_APP_API_URL}${url}`, {
    params: data,
  });
}

export function axiosPost<T>(
  url: string,
  data: T | object,
  headers?: AxiosRequestConfig
) {
  return axios.post(`${VITE_APP_API_URL}${url}`, data, headers ? headers : {});
}

export const axiosConfig = (
  method: string,
  url: string,
  config: AxiosRequestConfig,
  data: object
) => {
  return axios({
    method: method,
    url: `${VITE_APP_API_URL}${url}`,
    ...config,
    data,
  });
};

export const axiosPatch = (url: string, data: object) => {
  return axios.patch(`${VITE_APP_API_URL}${url}`, data);
};

export const axiosPut = (url: string, data: object) => {
  return axios.put(`${VITE_APP_API_URL}${url}`, data);
};

export const axiosDelete = (url: string) => {
  return axios.delete(`${VITE_APP_API_URL}${url}`);
};
