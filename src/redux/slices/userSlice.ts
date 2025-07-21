import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IUserData } from "../../interface/user/userInterface";

export interface IuserInitialRedux {
  token: null | string;
  user: IUserData | null;
  reset_pass_token?: string;
  featureData?: { [key: string]: string[] };
}

const initialState = {
  token: null,
  user: null,
  featureData: {},
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state: IuserInitialRedux,
      action: PayloadAction<IUserData | null>
    ) => {
      state.user = action.payload;
    },
    setToken: (
      state: IuserInitialRedux,
      action: PayloadAction<string | null>
    ) => {
      state.token = action.payload;
    },
    removeToken: (state: IuserInitialRedux) => {
      state.token = null;
    },
    setRoleFeatureData: (
      state: IuserInitialRedux,
      action: PayloadAction<{ [key: string]: string[] }>
    ) => {
      state.featureData = action.payload;
    },
  },
});

export const userSelector = (state: { user: IuserInitialRedux }) =>
  state.user.user;
export const tokenSelector = (state: { user: IuserInitialRedux }) =>
  state.user.token;
export const resetTokenSelector = (state: { user: IuserInitialRedux }) =>
  state.user.reset_pass_token;
export const roleFeatureDataSelector = (state: {
  user: IuserInitialRedux;
}) => state.user.featureData;

const { actions, reducer } = userSlice;

export const { setUser, setToken, removeToken, setRoleFeatureData } = actions;
export const setuser = (data: IUserData | null) => {
  setUser(data);
};
export const settoken = (data: string) => {
  setToken(data);
};
export const setRoleFeaturePermissionData = (data: {
  [key: string]: string[];
}) => {
  setRoleFeatureData(data);
};
export default reducer;
