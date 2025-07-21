import { createSlice } from "@reduxjs/toolkit";

export interface ISiteLoaderType {
  toggle: boolean;
}

const initialState = {
  toggle: false,
};

export const siteLoaderSlice = createSlice({
  name: "siteLoader",
  initialState,
  reducers: {
    showLoader: (state: ISiteLoaderType) => {
      state.toggle = true;
    },
    hideLoader: (state: ISiteLoaderType) => {
      state.toggle = false;
    },
  },
});

export const siteLoaderSelector = (state: { siteLoader: ISiteLoaderType }) => {
  return state.siteLoader.toggle;
};

const { actions, reducer } = siteLoaderSlice;

export const { showLoader, hideLoader } = actions;

export default reducer;
