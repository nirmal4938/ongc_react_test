import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IErrorType {
  errorData: null | [];
  count: number;
  activeError: string | number;
}

const initialState = {
  errorData: [],
  count: 0,
  activeError: ""
};

export const ErrorCategoriesSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setErrorData: (state, action: PayloadAction<[]>) => {
      state.errorData = action.payload;
    },
    setErrorCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
    setActiveError: (state, action: PayloadAction<string>) => {
      state.activeError = action.payload;
    },
  },
});

export const errorDataSelector = (state: { error: IErrorType }) =>
  state.error.errorData;

export const errorCountSelector = (state: { error: IErrorType }) =>
  state.error.count;

export const activeErrorSelector = (state: { error: IErrorType }) => 
  state.error.activeError;

const { actions, reducer } = ErrorCategoriesSlice;

export const { setErrorData, setErrorCount, setActiveError } = actions;
export const seterrorData = (data: []) => {
  setErrorData(data);
};
export const seterrorCount = (count: number) => {
  setErrorCount(count);
};
export const setactiveError = (activeError: string) => {
  setActiveError(activeError);
};

export default reducer;
