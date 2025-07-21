import { createSlice } from "@reduxjs/toolkit";

export interface IModalType {
  [x: string]: number;
}

const initialState = {
  currentPage: 1,
};

export const currentPageSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    currentPageCount: (state: IModalType, action: { payload: number }) => {
      state.currentPage = action.payload;
    },
  },
});

export const currentPageSelector = (state: { currentPage: IModalType }) => {
  return state.currentPage.currentPage;
};

const { actions, reducer } = currentPageSlice;

export const { currentPageCount } = actions;

export default reducer;
