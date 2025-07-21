import { setActiveTab } from "@/redux/slices/adminSidebarSlice";
import { ArrowDownIcon } from "../svgIcons";
import { useDispatch } from "react-redux";
import { IMenuList } from "@/interface/leftSideBar/leftSideBar";

const LinkContent = ({
  e,
  AdminSideBarVar,
  activeTab,
  toggle,
  setToggle,
}: {
  e: IMenuList;
  AdminSideBarVar: boolean;
  activeTab: string;
  toggle: string | null;
  setToggle: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const dispatch = useDispatch();
  const isActive =
    activeTab === e.link ||
    (e.subMenu &&
      e.subMenuList?.some((sub: { link: string }) => sub.link === activeTab));

  return (
    <>
      {e.icon && (
        <span
          className={`icon block ${
            isActive
              ? "text-primaryRed group-hover/sidebar:!text-white"
              : "text-grayDark group-hover/sidebar:!text-white"
          }
            ${AdminSideBarVar ? "mr-2" : ""}
          `}
        >
          {<e.icon />}
        </span>
      )}
      {AdminSideBarVar ? (
        <>
          <span
            className={`text-lg/26px font-bold ${
              isActive ? "text-primaryRed" : "text-grayDark"
            }`}
          >
            {e.name}
          </span>
          {e.subMenu && (
            <span
              className={`down-icon flex ml-auto text-grayDark w-6 h-6 justify-center rounded items-center hover:bg-grayDark/10`}
              onClick={() => {
                if (toggle !== e.name && e.subMenu) setToggle(e.name);
                else setToggle(null);
                !e.subMenu && dispatch(setActiveTab(e.link));
              }}
            >
              <ArrowDownIcon
                className={`${toggle === e.name ? "" : "-rotate-90"}`}
              />
            </span>
          )}
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default LinkContent;
