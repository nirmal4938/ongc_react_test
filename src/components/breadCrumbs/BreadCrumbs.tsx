import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RightArrowIcon } from "../svgIcons";
import { RoutesPath } from "@/router/routes/Routes";
interface IBreadCrumbs {
  title: string;
  link: string;
}

const BreadCrumbs = () => {
  const { pathname } = useLocation();
  const [breadCrumbs, setBreadCrumbs] = useState<IBreadCrumbs[]>([]);

  useEffect(() => {
    getBreadCrumbDetails();
  }, [pathname]);

  const getBreadCrumbDetails = async () => {
    const newBreadCrumbs: IBreadCrumbs[] = [];
    const validIdRegex = /^(?=.*\d.*\d)[!@#$%^&*(),.?":{}|<>a-zA-Z0-9-]+$/;
    const pathArr = pathname?.split("/");

    if (!pathArr[0]) {
      pathArr?.splice(0, 1);
    }
    if (pathArr.length > 1 && validIdRegex.test(pathArr[pathArr.length - 1])) {
      pathArr?.splice(pathArr?.length - 1);
    }
    const urlPath = pathArr?.join("/");

    const breadCrumb = RoutesPath?.filter((value) => {
      if (value?.path && value?.path?.includes(":")) {
        const routePathFilterArr = value?.path?.split("/");
        if (!routePathFilterArr[0]) {
          routePathFilterArr?.splice(0, 1);
        }
        return (
          value?.path?.includes(urlPath) &&
          routePathFilterArr
            ?.splice(0, routePathFilterArr?.length - 1)
            ?.join("/") == urlPath
        );
      }
      return value?.path?.includes(urlPath) && pathname === value?.path;
    });

    if (breadCrumb?.length > 0) {
      const breadCrumbNameArr = breadCrumb[0]?.breadCrumbName?.split("/") ?? [];
      if (breadCrumbNameArr?.length === 3) {
        newBreadCrumbs.push(
          { title: breadCrumbNameArr[0], link: `/#!` },
          { title: breadCrumbNameArr[1], link: `/${pathArr[0]}/${pathArr[1]}` },
          { title: breadCrumbNameArr[2], link: `/${pathArr[2]}` }
        );
      } else if (breadCrumbNameArr?.length === 2) {
        newBreadCrumbs.push(
          { title: breadCrumbNameArr[0], link: `/#!` },
          { title: breadCrumbNameArr[1], link: `/${pathArr[0]}/${pathArr[1]}` }
        );
      } else {
        newBreadCrumbs.push({ title: breadCrumbNameArr[0], link: `/#!` });
      }
      setBreadCrumbs(newBreadCrumbs);
    }
  };

  return (
    <>
      <div className="bg-primaryRed/10 max-w-[calc(100%_-_130px)] rounded-full">
        <ul className="flex flex-wrap [&>*:nth-last-child(2)]:rounded-r-full">
          {breadCrumbs?.map((value: IBreadCrumbs, inx: number) => {
            const isLastBreadCrumb = inx === breadCrumbs.length - 1;
            return (
              <li
                key={`breadcrumb_${value.title}`}
                className="cursor-pointer group first:rounded-l-full pr-5 py-3 pl-6 bg-white last:bg-transparent last:cursor-auto font-semibold last:font-bold text-black/60 last:text-primaryRed relative capitalize"
              >
                <span className="group-first:hidden p-1 absolute w-4 h-4 flex items-center justify-center rounded-full top-1/2 -translate-y-1/2 bg-primaryRed text-white -left-[9px] text-black/60">
                  <RightArrowIcon className="w-full h-full" />
                </span>
                {isLastBreadCrumb ? (
                  value.title
                ) : (
                  <Link to={value.link}>{value.title}</Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default BreadCrumbs;
