import { IClientData } from "@/interface/client/clientInterface";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import { IUserData } from "@/interface/user/userInterface";
import {
  activeClientDataSelector,
  activeClientSelector,
  setActiveClient,
  setClientData,
} from "@/redux/slices/clientSlice";
import {
  activeEmployeeSelector,
  setActiveEmployee,
  setActiveEmployeeData,
} from "@/redux/slices/employeeSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  removeToken,
  setRoleFeatureData,
  setToken,
  setUser,
  userSelector,
  roleFeatureDataSelector,
} from "@/redux/slices/userSlice";
import { GetClientData } from "@/services/clientService";
import { GetEmployeeDetailById } from "@/services/employeeService";
import { GetUserRolePermission } from "@/services/userService";
import { DefaultRoles, FeaturesNameEnum } from "@/utils/commonConstants";
import moment from "moment";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const PermissionContext = createContext<{
  user: null | IUserData;
  role: string | null;
  getPermissions: (
    featureName: FeaturesNameEnum,
    permissionName: string
  ) => boolean;
  isCheckEmployee: boolean;
  loader: boolean;
  logOut: () => void;
  pageState: { state: string | null; value: any };
  setPageState: Dispatch<
    SetStateAction<{ state: string | null; value: object }>
  >;
}>({
  user: null,
  role: null,
  loader: true,
  getPermissions: () => true,
  isCheckEmployee: false,
  logOut: () => null,
  pageState: { state: null, value: {} },
  setPageState: () => null,
});

export const PermissionProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const activeEmployee = useSelector(activeEmployeeSelector);
  const featureData = useSelector(roleFeatureDataSelector);
  const activeClient = useSelector(activeClientSelector);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogOut, setIsLogOut] = useState(false);
  const [pageStateData, setPageStateData] = useState<{
    state: string | null;
    value: object;
  }>({
    state: null,
    value: {},
  });
  const activeClientDataSelectorValue: IClientData | null = useSelector(
    activeClientDataSelector
  );

  useEffect(() => {
    // if (user?.roleData?.name == DefaultRoles.Employee && activeEmployee)
    if (user && activeEmployee) getEmployeeDetails(Number(activeEmployee));
    else dispatch(setActiveEmployeeData({} as IEmployeeData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeEmployee]);

  const getEmployeeDetails = async (id: number) => {
    dispatch(showLoader());
    const response = await GetEmployeeDetailById(id);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      dispatch(setActiveEmployeeData(resultData));
    }
    dispatch(hideLoader());
  };

  useEffect(() => {
    if (user) {
      const userId =
        user?.clientId && user?.clientId !== null
          ? "clientId=" + user?.clientId
          : "clientId=";
      const queryString = "?" + userId;
      fetchRolePermissionData(queryString);
      fetchClientData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRolePermissionData = async (query: string) => {
    setLoading(true);
    const response = await GetUserRolePermission(query);
    if (response?.data?.response_type === "success") {
      dispatch(setRoleFeatureData(response.data.responseData));
    }
    setLoading(false);
  };

  const fetchClientData = async () => {
    const response = await GetClientData("");
    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      dispatch(setClientData(result.data));
      result.data.length > 0 &&
        !activeClient &&
        dispatch(setActiveClient(result.data[0]?.id ?? 0));
    }
  };
  const getPermissions = useCallback(
    (featureName: string, permissionName: string) => {
      const isEmployeeOrTimesheet = [
        "Employee",
        "Timesheet Schedule",
        "Timesheet Summary",
      ].includes(featureName);

      const isCreateOrUpdateOrDelete = ["create", "update", "delete"].includes(
        permissionName
      );

      if (
        isEmployeeOrTimesheet &&
        moment().isAfter(activeClientDataSelectorValue?.endDate) &&
        Number(activeClientDataSelectorValue?.autoUpdateEndDate) === 0 &&
        isCreateOrUpdateOrDelete
      ) {
        return false;
      }

      return (featureData?.[featureName]?.find(
        (item: string) => item == permissionName
      ) ?? false) as boolean;
    },
    [featureData, activeClientDataSelectorValue]
  );

  const isCheckEmployee = user?.roleData?.name === DefaultRoles.Employee;

  useEffect(() => {
    if (isLogOut) {
      dispatch(removeToken());
      dispatch(setToken(null));
      dispatch(setUser(null));
      dispatch(setActiveClient(0));
      dispatch(setActiveEmployee(0));
      dispatch(setClientData([]));
      dispatch(setRoleFeatureData({}));
      setIsLogOut(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogOut, pathname]);

  const logOut = useCallback(() => {
    setLoading(true);
    navigate("/login");
    setIsLogOut(true);
  }, [navigate]);

  const params = useMemo(() => {
    return {
      loader: (user?.roleData?.name && loading) as boolean,
      user: user,
      role: user?.roleData ? user?.roleData?.name : null,
      getPermissions,
      logOut: logOut,
      isCheckEmployee: isCheckEmployee,
      pageState: pageStateData,
      setPageState: setPageStateData,
    };
  }, [
    user,
    loading,
    isCheckEmployee,
    getPermissions,
    logOut,
    pageStateData,
    setPageStateData,
  ]);

  return (
    <PermissionContext.Provider value={params}>
      {children}
    </PermissionContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePermission = () => useContext(PermissionContext);

export default PermissionContext;
