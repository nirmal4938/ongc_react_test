import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface EmployeeDropdownType {
  employeeSearchDropdownData: null | [];
}

const initialState = {
  employeeSearchDropdownData: [],
};

export const EmployeeDropdownSlice = createSlice({
  name: "employeeSearchDropdown",
  initialState,
  reducers: {
    setEmployeeSearchDropdown: (state, action: PayloadAction<[]>) => {
      state.employeeSearchDropdownData = action.payload;
    },
  },
});

export const employeeSearchDropdownSelector = (state: {
  employeeSearchDropdown: EmployeeDropdownType;
}) => state.employeeSearchDropdown;

const { actions, reducer } = EmployeeDropdownSlice;

export const { setEmployeeSearchDropdown } = actions;

export const setEmployeeSearchOptions = (employeeSearchOptionData: []) => {
  setEmployeeSearchDropdown(employeeSearchOptionData);
};

export default reducer;
