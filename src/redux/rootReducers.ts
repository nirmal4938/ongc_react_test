import AdminSideBarReducer from "./slices/adminSidebarSlice";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import toastReducer from "./slices/toastSlice";
import currentPageReducer from "./slices/paginationSlice";
import clientReducer from "./slices/clientSlice";
import segmentReducer from "./slices/segmentSlice";
import socketReducer from "./slices/socketSlice";
import summaryCurrentPageReducer from "./slices/summaryPaginationSlice";
import employeeReducer from "./slices/employeeSlice";
import errorCategory from "./slices/errorCategoriesSlice";
import siteLoaderReducer from "@/redux/slices/siteLoaderSlice";
import accountPODateReducer from "@/redux/slices/accountPOSlice";
import employeeSearchDropdownReducer from "@/redux/slices/employeeSearchDropdownSlice";

const persistConfig = {
  key: "LRED",
  storage,
  whitelist: ["user", "client", "employee", "AdminSideBar"],
};

const rootReducer = combineReducers({
  siteLoader: siteLoaderReducer,
  user: userReducer,
  socket: socketReducer,
  AdminSideBar: AdminSideBarReducer,
  toast: toastReducer,
  currentPage: currentPageReducer,
  accountPO: accountPODateReducer,
  client: clientReducer,
  error: errorCategory,
  segment: segmentReducer,
  summaryPage: summaryCurrentPageReducer,
  employee: employeeReducer,
  employeeSearchDropdown: employeeSearchDropdownReducer,
});

export default persistReducer(persistConfig, rootReducer);
