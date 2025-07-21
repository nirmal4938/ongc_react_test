import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IAdminSideBarType {
  toggle: boolean;
  activeTab: string;
}

const initialState = {
  toggle: true,
  activeTab: "",
};

export const AdminSideBarSlice = createSlice({
  name: "AdminSideBar",
  initialState,
  reducers: {
    showAdminSidebar: (state: IAdminSideBarType) => {
      state.toggle = true;
    },
    hideAdminSidebar: (state: IAdminSideBarType) => {
      state.toggle = false;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = String(action.payload);
    },
  },
});

export const AdminSidebarSelector = (state: {
  AdminSideBar: IAdminSideBarType;
}) => {
  return state.AdminSideBar.toggle;
};

export const ActiveTabSelector = (state: { AdminSideBar: IAdminSideBarType }) =>
  state.AdminSideBar.activeTab;

const { actions, reducer } = AdminSideBarSlice;

export const { showAdminSidebar, hideAdminSidebar, setActiveTab } = actions;

export default reducer;
