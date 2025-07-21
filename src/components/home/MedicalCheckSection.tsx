import { Link } from "react-router-dom";
import { IconEye, PlusIcon } from "../svgIcons";
import { usePermission } from "@/context/PermissionProvider";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";

export const MedicalCheckSection = ({ onClick }: { onClick?: () => void }) => (
  <div className="flex flex-wrap">
    <div className="w-1/2">
      <span className="text-base/6 text-gray-500 block font-medium">
        Medical Check
      </span>
    </div>
    <div className="w-1/2">
      <MedicalCheckButtons onClick={onClick} />
    </div>
  </div>
);

const MedicalCheckButtons = ({ onClick }: { onClick?: () => void }) => {
  const { getPermissions } = usePermission();
  return (
    <div className="flex items-center">
      {getPermissions(FeaturesNameEnum.MedicalRequest, PermissionEnum.View) && (
        <div className="flex group relative items-center ml-10 first:ml-0">
          <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
            View
          </span>
          <Link to="/medical/summary">
            <RoundIconButton icon={<IconEye />} />
          </Link>
        </div>
      )}
      {getPermissions(
        FeaturesNameEnum.MedicalRequest,
        PermissionEnum.Create
      ) && (
        <div className="flex group relative items-center ml-10 first:ml-0">
           <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
            Add
          </span>
          <RoundIconButton icon={<PlusIcon />} onClick={onClick} />
        </div>
      )}
    </div>
  );
};

export const RoundIconButton = ({
  icon,
  onClick,
}: {
  icon: JSX.Element;
  onClick?: () => void;
}) => (
  <span
    className="flex items-center justify-center p-2 w-8 h-8 rounded-full text-primaryRed bg-primaryRed/10"
    onClick={onClick}
  >
    {icon}
  </span>
);
