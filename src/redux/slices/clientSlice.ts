import { IClientData } from "@/interface/client/clientInterface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IClientType {
  clientData: IClientData[];
  count: number;
  activeClient: string | number;
  userActiveClient: string | number;
}

const initialState = {
  clientData: [],
  count: 0,
  activeClient: 0,
  userActiveClient: 0,
};

export const ClientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientData: (state, action: PayloadAction<[]>) => {
      state.clientData = action.payload;
    },
    setClientCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setActiveClient: (state, action: PayloadAction<string | number>) => {
      state.activeClient = Number(action.payload);
    },
    setUserActiveClient: (state, action: PayloadAction<string | number>) => {
      state.userActiveClient = Number(action.payload);
    },
  },
});

export const clientDataSelector = (state: { client: IClientType }) =>
  state.client.clientData;

export const clientCountSelector = (state: { client: IClientType }) =>
  state.client.count;

export const activeClientSelector = (state: { client: IClientType }) =>
  state.client.activeClient;

export const userActiveClientSelector = (state: { client: IClientType }) =>
  state.client.userActiveClient;

export const activeClientDataSelector = (state: { client: IClientType }) => {
  return state.client.clientData?.find(
    (a: IClientData) => a.id == state.client.activeClient
  ) || null;
};

const { actions, reducer } = ClientSlice;

export const {
  setClientData,
  setClientCount,
  setActiveClient,
  setUserActiveClient,
} = actions;
export const setclientData = (data: []) => {
  setClientData(data);
};
export const setclientCount = (count: number) => {
  setClientCount(count);
};
export const setactiveClient = (activeClient: string | number) => {
  setActiveClient(activeClient);
};

export const setuseractiveClient = (userActiveClient: string | number) => {
  setUserActiveClient(userActiveClient);
};

export default reducer;
