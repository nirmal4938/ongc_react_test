import { IEmployeeData } from "@/interface/employee/employeeInterface";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IEmployeeType {
  employeeData: null | [];
  activeEmployee: number | null;
  activeEmployeeData: null | IEmployeeData;
}

const initialState = {
  employeeData: [],
  activeEmployee: 0,
  activeEmployeeData: {},
};

export const EmployeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setEmployeeData: (state, action: PayloadAction<[]>) => {
      state.employeeData = action.payload;
    },
    setActiveEmployee: (state, action: PayloadAction<number | string>) => {
      state.activeEmployee = Number(action.payload);
    },
    setActiveEmployeeData: (state, action: PayloadAction<IEmployeeData>) => {
      state.activeEmployeeData = action.payload;
    },
  },
});

export const employeeDataSelector = (state: { employee: IEmployeeType }) =>
  state.employee.employeeData;

export const activeEmployeeSelector = (state: { employee: IEmployeeType }) =>
  state.employee.activeEmployee;

export const activeEmployeeDataSelector = (state: {
  employee: IEmployeeType;
}) => state.employee.activeEmployeeData;

const { actions, reducer } = EmployeeSlice;

export const { setEmployeeData, setActiveEmployee, setActiveEmployeeData } =
  actions;

export default reducer;
