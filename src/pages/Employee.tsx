import Button from "@/components/formComponents/button/Button";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { CrossIcon, ExcelIcon } from "@/components/svgIcons";

const Employee = () => {
  return (
    <>
      <div className="grid gap-5">
        <div className="">
          <SelectComponent
            options={[]}
            isMulti={false}
            placeholder="Groupement Berkine SH/AAC"
            // label="Folder"
            // className="bg-white"
            parentClass="max-w-[300px]"
          />
        </div>
        <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-center">
          <h4 className="text-base/5 text-black font-semibold">
            Employee Master List Version 2 Excel data File
          </h4>
        </div>

        <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
          <div className=" max-w-[800px] mx-auto">
            <div className="inner relative ">
              <input type="file" id="inputFile" hidden />
              <label
                htmlFor="inputFile"
                className="flex flex-col items-center justify-center w-full h-28 bg-white border border-dashed border-black/30 rounded-md cursor-pointer active:scale-95 transition-all duration-300"
              >
                <span className="inline-block text-base/5 font-semibold pointer-events-none">
                  Select file
                </span>
                <span className="inline-block text-base/5 text-black/50 font-semibold pointer-events-none mt-2">
                  Drop files here to upload
                </span>
              </label>
            </div>

            <div className="grid gap-3 mt-4">
              <div className="flex w-full items-center border-b border-solid border-black/05 pb-3 last:border-none last:pb-0">
                <div className="relative w-14 h-14 bg-white rounded-md p-2.5">
                  <ExcelIcon className="w-full h-full" />
                </div>
                <p className="text-sm/5 font-semibold max-w-[calc(100%_-_100px)] w-full mx-auto">
                  Lorem ipsum dolor sit amet.
                </p>
                <span className="icon ml-auto select-none inline-block w-5 h-5 bg-red hover:bg-tomatoRed text-white p-1.5 rounded-full cursor-pointer">
                  <CrossIcon className="w-full h-full" />
                </span>
              </div>
            </div>

            <div className="flex gap-5 justify-center mt-5">
              <Button variant={"primaryBorder"}>Cancel</Button>
              <Button variant={"primary"}>import</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Employee;
