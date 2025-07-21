import { Outlet } from "react-router-dom";
import Header from "./wrapper/Header";
import LeftSideBar from "@/defaultLayout/leftSideBar/LeftSideBar";
import { useSelector } from "react-redux";
import { AdminSidebarSelector } from "@/redux/slices/adminSidebarSlice";
import SiteLoader from "@/components/SiteLoder/siteLoader";

const LayOut: React.FC = () => {
  const AdminSideBarVar = useSelector(AdminSidebarSelector);
  return (
    <>
      <div className={`flex p-4 pt-0 bg-offWhite h-dvh overflow-auto`}>
        <LeftSideBar />
        {/*  px-30px  */}
        <div
          className={`w-full transition-all duration-300  px-15px ${
            AdminSideBarVar
              ? " max-w-[calc(100%_-_250px)] "
              : "max-w-[calc(100%_-_80px)]"
          }`}
        >
          <div className="main-wrapper test">
            <Header />
            <div className="site-content">
              <SiteLoader />
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LayOut;
