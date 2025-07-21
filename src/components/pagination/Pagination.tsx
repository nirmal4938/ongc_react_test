import { useEffect, useState } from "react";
import {
  DoubleLeftArrowIcon,
  DoubleRightArrowIcon,
  LeftArrowIcon,
  RightArrowIcon,
} from "../svgIcons";
import { useDispatch } from "react-redux";
import { currentPageCount } from "@/redux/slices/paginationSlice";
import { transportSummaryEnum } from "@/enum/transport";
import {
  transportCapacityCurrentPageCount,
  transportModelCurrentPageCount,
  transportPositionCurrentPageCount,
  transportTypeCurrentPageCount,
} from "@/redux/slices/summaryPaginationSlice";
import { usePermission } from "@/context/PermissionProvider";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  dataPerPage: number;
  dataCount?: number;
  parentClass?: string;
  setLimit: (number: number) => void;
  summaryTableType?: transportSummaryEnum;
  paginationModule?: string;
  disableMassPaginate?: boolean;
  disableMassRecord?: boolean;
}
const Pagination = ({
  parentClass,
  currentPage,
  totalPages,
  dataPerPage,
  dataCount,
  setLimit,
  paginationModule,
  summaryTableType,
  disableMassPaginate = false,
  disableMassRecord = false,
}: PaginationProps) => {
  const dispatch = useDispatch();
  const { pageState, setPageState } = usePermission();
  const [defaultPerPageData] = useState<number>(dataPerPage);
  const [pageNumber, setPageNumber] = useState<number[]>([]);
  const [limitData, setLimitData] = useState<number>();

  function generatePaginationNumbers(
    tpage: number, // Total Page
    cpage: number, // Current Page
    dpages: number // Limit ( Per Page Data)
  ) {
    const paginationNumbers = [];
    let startPage = Math.max(1, cpage - Math.floor(dpages / 2));
    const endPage = Math.min(startPage + dpages - 1, tpage);

    if (cpage > endPage) {
      dispatch(currentPageCount(endPage));
    }
    while (startPage <= endPage) {
      paginationNumbers.push(startPage);
      startPage++;
    }
    return paginationNumbers;
  }

  useEffect(() => {
    setLimitData(dataPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limitData]);

  useEffect(() => {
    setPageNumber(
      generatePaginationNumbers(totalPages, currentPage, dataPerPage)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalPages]);

  const handlePageChange = (value: number, action?: string) => {
    let dispatchFunction;
    if (summaryTableType === transportSummaryEnum.Model) {
      dispatchFunction = transportModelCurrentPageCount;
    } else if (summaryTableType === transportSummaryEnum.Type) {
      dispatchFunction = transportTypeCurrentPageCount;
    } else if (summaryTableType === transportSummaryEnum.Position) {
      dispatchFunction = transportPositionCurrentPageCount;
    } else if (summaryTableType === transportSummaryEnum.Capacity) {
      dispatchFunction = transportCapacityCurrentPageCount;
    } else {
      dispatchFunction = currentPageCount;
    }

    let updatevalue = value;
    if (action === "" || action === null || action === undefined) {
      dispatch(dispatchFunction(value));
    } else if (action === "increment") {
      dispatch(dispatchFunction(value + 1));
      updatevalue = value + 1;
    } else if (action === "decrement") {
      dispatch(dispatchFunction(value - 1));
      updatevalue = value - 1;
    } else {
      dispatch(dispatchFunction(value));
    }

    if (
      dispatchFunction == currentPageCount &&
      pageState &&
      pageState?.state === paginationModule
    ) {
      setPageState({
        state: paginationModule,
        value: { ...pageState.value, page: updatevalue },
      });
    }
  };

  return (
    <>
      <div className={`${parentClass ?? ""} mt-3`}>
        <div className="flex gap-50px justify-end items-center">
          {totalPages >= 1 && (
            <ul className="flex gap-1 items-center">
              {!disableMassPaginate && (
                <li className="first:mr-2 last:ml-2 h-fit">
                  <span
                    className={`inline-flex items-center justify-center w-35px h-35px text-black/50 ${
                      currentPage !== 1
                        ? "cursor-pointer hover:bg-black/10"
                        : ""
                    } rounded-md transition-all duration-300 select-none active:scale-90 p-2`}
                    onClick={() =>
                      currentPage > 1 && handlePageChange(1, "start")
                    }
                  >
                    <DoubleLeftArrowIcon className="w-full h-full" />
                  </span>
                </li>
              )}
              <li className="first:mr-2 last:ml-2 h-fit">
                <span
                  className={`inline-flex items-center justify-center w-30px h-30px text-black/50 ${
                    currentPage > 1 ? "cursor-pointer hover:bg-black/10" : ""
                  } rounded-md transition-all duration-300 select-none active:scale-90 p-2`}
                  onClick={() =>
                    currentPage > 1 &&
                    handlePageChange(currentPage, "decrement")
                  }
                >
                  <LeftArrowIcon className="w-full h-full" />
                </span>
              </li>
              {pageNumber?.map((num: number) => {
                return (
                  <li
                    key={num}
                    className="first:mr-2 last:ml-2 h-fit"
                    onClick={() => handlePageChange(num)}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-30px h-30px ${
                        num === currentPage
                          ? "text-white bg-primaryRed"
                          : "text-black/50 hover:bg-black/10"
                      } rounded-md cursor-pointer transition-all duration-300 select-none active:scale-90 font-semibold`}
                    >
                      {num}
                    </span>
                  </li>
                );
              })}
              <li className="first:mr-2 last:ml-2 h-fit">
                <span
                  className={`inline-flex items-center justify-center w-30px h-30px text-black/50 ${
                    currentPage < totalPages
                      ? "cursor-pointer hover:bg-black/10"
                      : ""
                  } rounded-md transition-all duration-300 select-none active:scale-90 p-2`}
                  onClick={() =>
                    currentPage < totalPages &&
                    handlePageChange(currentPage, "increment")
                  }
                >
                  <RightArrowIcon className="w-full h-full" />
                </span>
              </li>
              {!disableMassPaginate && (
                <li className="first:mr-2 last:ml-2 h-fit">
                  <span
                    className={`inline-flex items-center justify-center w-35px h-35px text-black/50 ${
                      currentPage !== totalPages
                        ? "cursor-pointer hover:bg-black/10"
                        : ""
                    } rounded-md transition-all duration-300 select-none active:scale-90 p-2`}
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(totalPages, "end")
                    }
                  >
                    <DoubleRightArrowIcon className="w-full h-full" />
                  </span>
                </li>
              )}
            </ul>
          )}
          {!summaryTableType &&
            dataCount &&
            limitData &&
            limitData < dataCount && (
              <div className="flex items-center gap-10px">
                <label
                  htmlFor=""
                  className="text-base/5 text-black/50 font-semibold"
                >
                  Show
                </label>
                <select
                  name=""
                  id=""
                  className="px-15px py-2.5 w-24 text-13px/4 bg-transparent text-black border border-solid border-black/20 rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setLimit(Number(e.target.value));
                    dispatch(currentPageCount(1));
                  }}
                  defaultValue={
                    dataPerPage && defaultPerPageData == dataPerPage
                      ? dataPerPage
                      : 10
                  }
                >
                  <option
                    value={
                      dataPerPage && defaultPerPageData == dataPerPage
                        ? dataPerPage
                        : 10
                    }
                  >
                    {dataPerPage && defaultPerPageData == dataPerPage
                      ? dataPerPage
                      : 10}
                  </option>
                  {dataCount >= 10 && <option value={20}>20</option>}
                  {!disableMassRecord && dataCount >= 20 && (
                    <option value={50}>50</option>
                  )}
                  {!disableMassRecord && dataCount >= 50 && (
                    <option value={100}>100</option>
                  )}
                  {!disableMassRecord && dataCount >= 100 && (
                    <option value={dataCount}>All</option>
                  )}
                </select>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Pagination;
