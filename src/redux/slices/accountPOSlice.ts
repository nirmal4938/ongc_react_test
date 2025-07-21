import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface AccountPODateType {
  clientId: number | string;
  position: string;
  startDate: string;
  endDate: string;
}

const initialState = {
  clientId: 0,
  position: "",
  startDate: "",
  endDate: "",
};

export const AccountPOSlice = createSlice({
  name: "accountPO",
  initialState,
  reducers: {
    setActiveAccountPODateDropdown: (
      state,
      action: PayloadAction<AccountPODateType>
    ) => {
      state.clientId = +action.payload.clientId;
      state.position = action.payload.position;
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const accountPODateSelector = (state: {
  accountPO: AccountPODateType;
}) => state.accountPO;

const { actions, reducer } = AccountPOSlice;

export const { setActiveAccountPODateDropdown } = actions;

export const setAccountPODate = (accountPODate: AccountPODateType) => {
  setActiveAccountPODateDropdown(accountPODate);
};

export default reducer;
