import { usePermission } from "@/context/PermissionProvider";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { isCheckEmployee } = usePermission();
  return (
    <>
      <section className="py-24">
        <div className="container">
          <div className="notfound text-center">
            <div className="notfound-404 relative ">
              <h3 className="uppercase font-BinerkaDemo font-bold mb-5">Oops! Page not found</h3>
              <h1 className="sm:text-[200px] text-[160px] leading-none font-BinerkaDemo font-bold text-primaryGold">
                <span className="drop-shadow-[-8px_0_0_#000] text-primaryRed">4</span>
                <span className="drop-shadow-[-8px_0_0_#000] text-primaryRed">0</span>
                <span className="drop-shadow-[-8px_0_0_#000] text-primaryRed">4</span>
              </h1>
            </div>
            <h2 className="text-lg  mb-5 font-BinerkaDemo max-w-[600px] mx-auto font-bold">
              we are sorry, but the page you requested was not found
            </h2>
            <Link className=" inline-flex items-center justify-center py-11px px-15px text-13px/16px font-semibold rounded-md transition-all duration-300 active:scale-95 focus:ring-2 focus:ring-offset-2  border border-solid focus:ring-primaryRed bg-primaryRed hover:bg-primaryRed/80 text-white border-primaryRed" to={`${isCheckEmployee ? "/timesheet/summary" : "/"}`}>Back to homepage</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
