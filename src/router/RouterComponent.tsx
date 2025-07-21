import { AuthRoutes, RoutesPath } from "./routes/Routes";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { tokenSelector } from "@/redux/slices/userSlice";
import { Suspense, useEffect, useState } from "react";

import AuthLayOut from "@/defaultLayout/authLayout";
import LayOut from "../defaultLayout";
import NotFound from "../pages/notFound/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader } from "@/redux/slices/siteLoaderSlice";
import { usePermission } from "@/context/PermissionProvider";
import SiteLoader from "@/components/SiteLoder/siteLoader";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { GetSlugByUserId } from "@/services/employeeService";
import {
  activeClientSelector,
  setActiveClient,
} from "@/redux/slices/clientSlice";
import { setActiveEmployee } from "@/redux/slices/employeeSlice";

const RouterComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCheckEmployee } = usePermission();
  const { pathname } = useLocation();
  const activeClient = useSelector(activeClientSelector);
  const token = useSelector(tokenSelector);
  const [temp, setTemp] = useState(false);
  const { getPermissions } = usePermission();

  const getData = async () => {
    const pathArr = pathname.split("/");
    if (token && pathname?.startsWith("/employee/reliquat-calculation/")) {
      if (
        pathArr?.length > 0 &&
        pathArr[pathArr?.length - 1] !== "" &&
        pathArr[pathArr?.length - 1]?.includes("_")
      ) {
        const employeeId = pathArr[pathArr?.length - 1]?.split("_")?.[0];
        const clientId = pathArr[pathArr?.length - 1]?.split("_")?.[1];
        dispatch(setActiveClient(Number(clientId)));
        dispatch(setActiveEmployee(Number(employeeId)));
        navigate("/employee/reliquat-calculation");
      }
    }
    if (
      token &&
      pathname !== "/add-request" &&
      AuthRoutes.find((val) => val.path === pathname) &&
      getPermissions(FeaturesNameEnum.Dashboard, PermissionEnum.View)
    ) {
      navigate("/");
    }
    if (
      token &&
      pathname === "/add-request" &&
      AuthRoutes.find((val) => val.path === pathname)
    ) {
      navigate("/add-requests");
    }
    setTemp(!temp);
    if (!token && !AuthRoutes.find((val) => val.path === pathname)) {
      navigate("/login");
    }

    if (
      !isCheckEmployee &&
      token &&
      !AuthRoutes.find((val) => val.path === pathname) &&
      !getPermissions(FeaturesNameEnum.Dashboard, PermissionEnum.View)
    ) {
      navigate("/admin/user-profile");
    }

    if (
      isCheckEmployee &&
      token &&
      !pathname?.startsWith("/employee/reliquat-calculation/") &&
      !pathArr[pathArr?.length - 1]?.includes("_") &&
      !AuthRoutes.find((val) => val.path === pathname)
    ) {
      let slug = await GetSlugByUserId(Number(activeClient));
      slug = slug?.data?.responseData?.slug;
      if (slug !== undefined) {
        navigate(`/employee/summary/profile/${slug}`);
      }
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window) {
      window.addEventListener("popstate", () => {
        dispatch(hideLoader());
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window]);

  return (
    <Suspense fallback={<SiteLoader lazyLoader={true} />}>
      <Routes>
        <Route path="/" element={<LayOut />}>
          {RoutesPath.map((route) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  (isCheckEmployee &&
                    route.name != "Home" &&
                    route.name != "EmployeeSummary") ||
                  !isCheckEmployee ? (
                    <route.element />
                  ) : (
                    <NotFound />
                  )
                }
              />
            );
          })}
        </Route>

        <Route path="/" element={<AuthLayOut />}>
          {!token &&
            AuthRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
        </Route>

        <Route path="*" element={<LayOut />}>
          {token && !AuthRoutes.find((val) => val.path === pathname) && (
            <Route path="*" element={<NotFound />} />
          )}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RouterComponent;
