import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ActiveTabSelector,
  AdminSidebarSelector,
  hideAdminSidebar,
  setActiveTab,
  showAdminSidebar,
} from "@/redux/slices/adminSidebarSlice";

import { SidebarTriggerArrow } from "@/components/svgIcons";
import { Link, useLocation } from "react-router-dom";
import { MenuList } from "@/constants/DropdownConstants";
import { usePermission } from "@/context/PermissionProvider";
import {
  DefaultRoles,
  FeaturesNameEnum,
  shouldDashboardRenderMenuItem,
  shouldEmployeeRenderMenuItem,
} from "@/utils/commonConstants";
import { RoutesPath } from "@/router/routes/Routes";
import LinkContent from "@/components/leftSideBar/LinkContent";
import { userSelector } from "@/redux/slices/userSlice";
import { IMenuList } from "@/interface/leftSideBar/leftSideBar";

const AdminSideBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isCheckEmployee } = usePermission();
  const { getPermissions } = usePermission();
  const [toggle, setToggle] = useState<null | string>(null);
  const AdminSideBarVar = useSelector(AdminSidebarSelector);
  const activeTab = useSelector(ActiveTabSelector);
  const user = useSelector(userSelector);
  const [menuList, setMenuList] = useState<IMenuList[]>([]);

  useEffect(() => {
    if (RoutesPath) {
      RoutesPath.forEach((element) => {
        if (element.path === location.pathname) {
          dispatch(setActiveTab(element.path));
        }
      });
    }
    if (user?.roleData?.name !== DefaultRoles.Admin) {
      const filteredMenuList = MenuList.filter((e) => e.name !== "Setup");
      setMenuList(filteredMenuList);
    } else {
      setMenuList(MenuList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleSubMenuCss = (name: string) => {
    let result = "";
    if (toggle === name) {
      return result;
    } else if (AdminSideBarVar) {
      result = "hidden";
      return result;
    } else {
      return result;
    }
  };

  function renderSubMenuLink(el: {
    id: string;
    name: string;
    link: string;
    featureName?: FeaturesNameEnum[];
    permission?: string[];
  }) {
    const hasPermission = checkPermission(el);
    const isActive = activeTab === el.link;

    function checkPermission(el: {
      id: string;
      name: string;
      link: string;
      featureName?: FeaturesNameEnum[];
      permission?: string[];
    }) {
      if (!el.featureName || !el.permission) {
        return true;
      }

      return el.featureName.some(
        (val) =>
          el?.permission &&
          el?.permission.some((accessPermission) =>
            getPermissions(val, accessPermission)
          )
      );
    }

    function getLinkClassName(isActive: boolean) {
      return `block py-2 font-semibold transition-all duration-300 ${
        isActive ? "text-primaryRed" : "text-grayDark hover:text-black"
      } ${
        AdminSideBarVar
          ? ""
          : "hover:bg-primaryRed hover:text-white rounded-lg px-2"
      }`;
    }

    function handleLinkClick(link: string) {
      dispatch(setActiveTab(link));
    }

    return (
      (el.featureName === undefined || hasPermission) && (
        <li className="" key={el?.id}>
          <Link
            className={getLinkClassName(isActive)}
            to={el.link}
            onClick={() => handleLinkClick(el.link)}
          >
            {isCheckEmployee &&
            el.id === "timesheetsUpdate" &&
            el.name === "Modify"
              ? "Review"
              : el.name}
          </Link>
        </li>
      )
    );
  }

  const calculateLinkClassName = (name: string) => {
    const linkClassParts = ["relative", "px-3", "cursor-pointer"];

    if (AdminSideBarVar) {
      linkClassParts.push("py-2", "items-center", "flex");
    } else {
      linkClassParts.push(
        "inline-flex",
        "py-3",
        "justify-center",
        "rounded-md",
        "group-sidebar",
        "group/sidebar",
        "hover:bg-primaryRed",
        "hover:text-white",
        "transition-all",
        "duration-300"
      );

      if (activeTab === name) {
        linkClassParts.push("bg-primaryRed/10");
      }

      if (activeTab !== name) {
        linkClassParts.push("bg-black/5", "hover:text-black");
      }
    }

    return linkClassParts.join(" ");
  };

  return (
    <>
      <div
        className={`w-full z-2 bg-white rounded-20 sticky  select-none transition-all duration-300 h-[calc(100%_-_16px)] top-4 ${
          AdminSideBarVar ? " max-w-[250px] " : "max-w-[80px] "
        }`}
        // h-[calc(100%_-_16px)]
      >
        <div className="">
          <span
            onClick={() => {
              if (AdminSideBarVar) dispatch(hideAdminSidebar());
              else dispatch(showAdminSidebar());
            }}
            className="sidebar__trigger w-6 h-6 p-[7px] rounded-full absolute -right-3 top-9 bg-primaryRed hover:bg-primaryRed/70 cursor-pointer inline-flex items-center justify-center active:scale-110 transition-all duration-300"
          >
            <SidebarTriggerArrow
              className={`w-full h-full transition-all duration-300 ${
                AdminSideBarVar ? "" : "rotate-180"
              }`}
            />
          </span>
          <Link
            to={`${isCheckEmployee ? "/timesheet/summary" : "/"}`}
            className={`logo-wrapper block p-4 ${
              AdminSideBarVar ? "mb-9 " : "mb-4"
            }`}
          >
            <img
              src={`/assets/images/${
                AdminSideBarVar ? "lred-main-logo.png" : "favicon.ico"
              }`}
              width={127.85}
              height={45.87}
              alt="sidebarLogo"
            />
          </Link>
          {/*  overflow-auto */}
          <div
            className={`menu-list overflow-auto noscroll ${
              AdminSideBarVar
                ? " max-h-[calc(100dvh_-_165px)]"
                : " max-h-[calc(100dvh_-_125px)]"
            }`}
          >
            <ul className="px-10px grid gap-5 pb-4">
              {menuList
                ?.filter((menu) =>
                  shouldDashboardRenderMenuItem(
                    menu,
                    "Dashboard",
                    isCheckEmployee
                  )
                )
                .map((e) => {
                  return (
                    <Fragment key={e.id}>
                      {((e.featureName &&
                        e.permission &&
                        e.featureName?.find((val) =>
                          e?.permission?.find((accessPermission) =>
                            getPermissions(val, accessPermission)
                          )
                        )) ||
                        e.featureName === undefined) && (
                        <div key={e?.id}>
                          <li
                            className={`group ${
                              AdminSideBarVar ? "max-w-[200px]" : "text-center"
                            }`}
                          >
                            <Link
                              to={e.link}
                              onClick={() => {
                                if (toggle !== e.name && e.subMenu)
                                  setToggle(e.name);
                                else setToggle(null);
                                !e.subMenu && dispatch(setActiveTab(e.link));
                              }}
                              className={calculateLinkClassName(e.name)}
                            >
                              <LinkContent
                                e={e}
                                AdminSideBarVar={AdminSideBarVar}
                                activeTab={activeTab}
                                toggle={toggle}
                                setToggle={setToggle}
                              />
                            </Link>
                            {e.subMenu ? (
                              <div
                                className={
                                  `
                        ${
                          AdminSideBarVar
                            ? ""
                            : "absolute top-auto left-[calc(100%_+_15px)] w-[220px] text-left bg-white rounded-lg shadow-lg z-3 px-2.5 py-2 -translate-x-2 -translate-y-10 group-hover:translate-x-0 pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 before:absolute before:-left-8 before:top-0 before:w-10 before:h-10 transition-all duration-300"
                        }
                        ` + `${handleSubMenuCss(e?.name)}`
                                }
                              >
                                <ul
                                  className={` ${
                                    AdminSideBarVar ? "pl-10" : ""
                                  } `}
                                >
                                  {e?.subMenuList
                                    ?.filter((submenu) => {
                                      if (
                                        user?.roleData?.name ===
                                        DefaultRoles.Admin
                                      ) {
                                        return shouldEmployeeRenderMenuItem(
                                          e,
                                          submenu,
                                          isCheckEmployee
                                        );
                                      } else {
                                        return (
                                          shouldEmployeeRenderMenuItem(
                                            e,
                                            submenu,
                                            isCheckEmployee
                                          ) && submenu.name !== "Bonus Types"
                                        );
                                      }
                                    })
                                    ?.map(
                                      (el: {
                                        id: string;
                                        name: string;
                                        link: string;
                                        featureName?: FeaturesNameEnum[];
                                        permission?: string[];
                                      }) => renderSubMenuLink(el)
                                    )}
                                </ul>
                              </div>
                            ) : null}
                          </li>
                        </div>
                      )}
                    </Fragment>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdminSideBar;
