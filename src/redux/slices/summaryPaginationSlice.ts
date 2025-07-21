import { createSlice } from "@reduxjs/toolkit";

export interface IModalType {
  [x: string]: number;
}

const initialState = {
  transportModelCurrentPage: 1,
  transportTypeCurrentPage: 1,
  transportPositionCurrentPage: 1,
  transportCapacityCurrentPage: 1,
};

export const summaryCurrentPageSlice = createSlice({
  name: "summaryPage",
  initialState,
  reducers: {
    transportModelCurrentPageCount: (
      state: IModalType,
      action: { payload: number }
    ) => {
      state.transportModelCurrentPage = action.payload;
    },
    transportTypeCurrentPageCount: (
      state: IModalType,
      action: { payload: number }
    ) => {
      state.transportTypeCurrentPage = action.payload;
    },
    transportPositionCurrentPageCount: (
      state: IModalType,
      action: { payload: number }
    ) => {
      state.transportPositionCurrentPage = action.payload;
    },
    transportCapacityCurrentPageCount: (
      state: IModalType,
      action: { payload: number }
    ) => {
      state.transportCapacityCurrentPage = action.payload;
    },
  },
});

export const currentSummaryModelPageSelector = (state: {
  summaryPage: IModalType;
}) => {
  return state.summaryPage.transportModelCurrentPage;
};
export const currentSummaryTypePageSelector = (state: {
  summaryPage: IModalType;
}) => {
  return state.summaryPage.transportTypeCurrentPage;
};
export const currentSummaryPositionPageSelector = (state: {
  summaryPage: IModalType;
}) => {
  return state.summaryPage.transportPositionCurrentPage;
};
export const currentSummaryCapacityPageSelector = (state: {
  summaryPage: IModalType;
}) => {
  return state.summaryPage.transportCapacityCurrentPage;
};

const { actions, reducer } = summaryCurrentPageSlice;

export const {
  transportModelCurrentPageCount,
  transportTypeCurrentPageCount,
  transportPositionCurrentPageCount,
  transportCapacityCurrentPageCount,
} = actions;

export default reducer;
