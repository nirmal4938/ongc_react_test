import { useState } from "react";
const Tab = ({
  setTab,
  TabList,
  selectedTabValue,
}: {
  selectedTabValue?: number;
  setTab?: (value: number) => void;
  TabList: { name: string; value: number }[];
}) => {
  const [selectTab, setSelectTab] = useState("tab0");
  return (
    <>
      <div className="tab-wrap">
        <ul className="flex items-center">
          {TabList.map((e, i) => (
            <li className="mr-6 2xl:mr-35px last:mr-0" key={e.value}>
              <span
                className={`inline-block font-semibold cursor-pointer border-b-2 border-solid border-transparent pb-0.5 transition-all duration-300 text-base 2xl:text-lg/22px ${
                  (selectedTabValue != undefined && selectedTabValue != null
                    ? `tab${selectedTabValue}`
                    : selectTab) === `tab${e.value}`
                    ? " border-b-primaryRed text-primaryRed "
                    : " hover:border-b-black/50 text-black/50"
                }`}
                onClick={() => {
                  setTab?.(e.value);
                  setSelectTab(`tab${i}`);
                }}
              >
                {e.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Tab;
