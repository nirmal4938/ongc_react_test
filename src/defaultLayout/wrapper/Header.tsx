import {
  ArrowDownIcon,
  LockIocn,
  LogoutIocn,
  RoundUserIcon,
  SingleUserIocn,
} from "@/components/svgIcons";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userSelector } from "@/redux/slices/userSlice";
import ChangePassword from "@/pages/auth/ChangePassword";
import { useEffect, useRef, useState } from "react";
import BreadCrumbs from "@/components/breadCrumbs/BreadCrumbs";
import ClientDropdown from "@/components/dropdown/ClientDropdown";
import { pathWiseClientDropDownAvailable } from "@/constants/DropdownConstants";
import { usePermission } from "@/context/PermissionProvider";
import { DefaultRoles } from "@/utils/commonConstants";
import { GetSlugByUserId } from "@/services/employeeService";
import { activeClientSelector } from "@/redux/slices/clientSlice";

const Header = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logOut } = usePermission();
  const activeClient = useSelector(activeClientSelector);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] =
    useState<boolean>(false);
  const user = useSelector(userSelector);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      divRef.current &&
      event.target &&
      !divRef.current?.contains(event.target as Node)
    ) {
      setShowProfile(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <header className="mb-6 sticky top-0 bg-offWhite z-3 px-15px items-center">
        <div className="flex justify-between items-center py-4 border-b border-solid border-black/10 gap-x-4">
          <BreadCrumbs />
          {pathWiseClientDropDownAvailable.includes(location.pathname) && (
            <div className="ml-auto">
              {user?.roleData.name &&
                ![DefaultRoles.Client].includes(
                  user?.roleData.name as DefaultRoles
                ) && <ClientDropdown />}
            </div>
          )}
          <div
            className="account"
            ref={divRef}
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="relative after:content-[''] after:h-2 after:block after:w-full after:absolute after:top-full">
              <div className="flex items-center cursor-pointer text-primaryRed">
                <span className="w-8 h-8">
                  <RoundUserIcon className="w-full h-full" />
                </span>
                <span className="text-current text-xl/26px ml-2 mr-1 font-medium">
                  {user?.loginUserData?.name}
                </span>
                <span className="w-10px h-auto">
                  <ArrowDownIcon className="w-full h-full" />
                </span>
              </div>
              <div
                className={`bg-white rounded-10 shadow-menu absolute top-[calc(100%_+_8px)] min-w-[200px] right-0 transition-all duration-500 z-2 ${
                  showProfile ? `` : `hidden`
                }`}
              >
                <span className="absolute -top-2 right-5 border-r-[8px] border-b-[8px] border-l-[8px] border-transparent border-b-white"></span>
                <ul className="py-2">
                  <li
                    className="flex items-center relative px-5 cursor-pointer hover:bg-gray-100 before:absolute before:content-[''] before:w-10/12 before:left-0 before:right-0 before:mx-auto before:h-px before:bg-gray-200 before:top-full last:before:hidden"
                    onClick={async () => {
                      if (activeClient) {
                        let slug = await GetSlugByUserId(Number(activeClient));
                        slug = slug?.data?.responseData?.slug;
                        if (slug) navigate(`/profile/${slug}`);
                      }
                    }}
                  >
                    <span className="w-5 h-5 text-themeColor mr-3">
                      <SingleUserIocn className="w-full h-full" />
                    </span>
                    <span className="inline-block w-full whitespace-nowrap font-semibold max-w-[calc(100%_-_32px)] leading-40px text-sm text-black">
                      {user?.loginUserData?.email}
                    </span>
                  </li>
                  <li
                    className="flex items-center relative px-5 cursor-pointer hover:bg-gray-100 before:absolute before:content-[''] before:w-10/12 before:left-0 before:right-0 before:mx-auto before:h-px before:bg-gray-200 before:top-full last:before:hidden"
                    onClick={() => setOpenChangePasswordModal(true)}
                  >
                    <span className="w-5 h-5 text-themeColor mr-3">
                      <LockIocn className="w-full h-full" />
                    </span>
                    <span className="inline-block w-full whitespace-nowrap font-semibold max-w-[calc(100%_-_32px)] leading-40px text-sm text-black">
                      Change Password
                    </span>
                  </li>
                  <li className="flex items-center relative px-5 cursor-pointer hover:bg-gray-100 before:absolute before:content-[''] before:w-10/12 before:left-0 before:right-0 before:mx-auto before:h-px before:bg-gray-200 before:top-full last:before:hidden">
                    <span className="w-5 h-5 text-themeColor mr-3">
                      <LogoutIocn className="w-full h-full" />
                    </span>
                    <span
                      className="inline-block w-full whitespace-nowrap font-semibold max-w-[calc(100%_-_32px)] leading-40px text-sm text-black"
                      onClick={logOut}
                    >
                      Log off
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <ChangePassword
          openModal={openChangePasswordModal}
          closeModal={() => setOpenChangePasswordModal(false)}
        />
      </header>
    </>
  );
};

export default Header;
