import { axiosGet, axiosPut, axiosPost } from "@/axios/axios";

const prefix = "/account/PO";
export const GetAllSegmentData = (query: string) => {
  return axiosGet(`${prefix}/getAccountPOData${query}`);
};

export const GetAllPOSummaryData = (id: string | number, query: string) => {
  return axiosGet(`${prefix}/${id}${query}`);
};

export const GetAllAccountPODetails = (id: string | number, query: string) => {
  return axiosGet(`${prefix}/employee/${id}${query}`);
};

// export const GenerateAccountSummaryData = (query: string) => {
//   return axiosGet(`${prefix}/account-detail${query}`);
// };
export const UpdatePaymentStatus = (data: {
  ids: number[];
  clientId: string | number;
}) => {
  return axiosPut(`${prefix}`, data);
};

export const generateInvoice = (empId: number, data: object) => {
  return axiosPost(`/xero/generateInvoice/${empId}`, data);
};
