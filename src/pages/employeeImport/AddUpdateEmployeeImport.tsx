import { Form, Formik, FormikValues } from "formik";
import Button from "@/components/formComponents/button/Button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FileInput from "@/components/formComponents/fileInput/FileInput";
import { EmployeeImportValidationSchema } from "@/validations/employeeFiles/EmployeeValidation";
import { AddImportEmployeeData } from "@/services/importLogService";
import { useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { GetRotationData } from "@/services/rotationService";
import { Option } from "@/components/formComponents/customSelect/type";
import { GetAllBonusType } from "@/services/bonusTypeService";
import { socketSelector } from "@/redux/slices/socketSlice";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";
import { usePermission } from "@/context/PermissionProvider";

const AddUpdateEmployeeImport = () => {
  const { getPermissions } = usePermission();
  const navigate = useNavigate();
  const activeClient = useSelector(activeClientSelector);

  const socket = useSelector(socketSelector);

  const { pathname } = useLocation();
  const defaultInitialValues: { employeeFile: string | null } = {
    employeeFile: null,
  };
  const [employeeImportData] = useState<{ employeeFile: string | null }>(
    defaultInitialValues
  );
  const [percentageValue, setPercentageValue] = useState<
    | {
        count: number;
        type: string;
        message: string;
      }[]
    | undefined
  >([]);
  const [rotationDataList, setRotationDataList] = useState<Option[]>();
  const [bonusDataList, setBonusDataList] = useState<Option[]>();
  const [loader, setLoader] = useState<boolean>(false);
  const [removeIcon, setRemoveIcon] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    setRemoveIcon(true);

    const formData = new FormData();
    formData.append("clientId", activeClient.toString());
    formData.append("employeeFile", values?.employeeFile);

    const response = await AddImportEmployeeData(formData);

    if (response?.data?.response_type === "success") {
      // navigate("/employee/import-logs");
    }
    setRemoveIcon(false);
    setLoader(false);
  };

  const getAllRotationData = async () => {
    const response = await GetRotationData();
    if (response?.data?.responseData) {
      const rotationData = response?.data?.responseData?.data.map(
        (data: { id: number; name: string }) => ({
          label: data?.name,
          value: data.id,
        })
      );
      setRotationDataList(rotationData);
    }
  };

  const getAllBonusData = async () => {
    if (getPermissions(FeaturesNameEnum.BonusType, PermissionEnum.View)) {
      const response = await GetAllBonusType("");
      if (response?.data?.responseData) {
        const bonusData = response?.data?.responseData?.data.map(
          (data: { id: number; code: string }) => ({
            label: data?.code,
            value: data.id,
          })
        );
        setBonusDataList(bonusData);
      }
    }
  };

  const handleDownload = async () => {
    const response = await fetch("/assets/document/masterEmployeeSheet.xlsx");
    const excelBuffer = await response.arrayBuffer();

    const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(excelBuffer);

    const worksheet: ExcelJS.Worksheet|undefined = workbook.getWorksheet(1);

    const startRow = 2;
    const endRow: number | number[] = 10000;

    const headers = ["L", "Y", "AB", "AE", "AH"];

    const dataValidation: ExcelJS.DataValidation = {
      type: "list",
      formulae: [`"${rotationDataList?.map((item) => item.label)?.join(",")}"`],
      allowBlank: false,
      prompt: "Choose a rotation:",
      promptTitle: "Select one of the rotation",
      error: "Invalid selection",
    };

    const dataValidation2: ExcelJS.DataValidation = {
      type: "list",
      formulae: [`"${bonusDataList?.map((item) => item.label)?.join(",")}"`],
      allowBlank: false,
      prompt: "Choose a bonus:",
      promptTitle: "Select one of the bonus",
      error: "Invalid selection",
    };

    for (let row = startRow; row <= endRow; row++) {
      for (const header of headers) {
        const cell: ExcelJS.Cell|undefined = worksheet?.getCell(header + row);
        if (header == "L" && cell) {
          cell.dataValidation = dataValidation;
        } else {
          if(cell)
          cell.dataValidation = dataValidation2;
        }
      }
    }

    const updatedExcelBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([updatedExcelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "MasterEmployeeSheet.xlsx");
  };

  socket?.on("import-data-count", (data) => {
    setPercentageValue((prev) => {
      if (!prev?.some((dat) => dat.message === data.message)) {
        return prev ? [...prev, data] : [data];
      } else {
        return prev;
      }
    });
  });

  useEffect(() => {
    getAllRotationData();
    getAllBonusData();
  }, [socket, percentageValue]);

  return (
    <>
      <Formik
        initialValues={employeeImportData}
        enableReinitialize={true}
        validationSchema={EmployeeImportValidationSchema()}
        onSubmit={OnSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <div className="bg-primaryRed/10 text-center font-semibold py-15px px-3 rounded-lg text-dark text-base/5 mb-5">
                Employee Master List Version 2 Excel data File
              </div>
              <div className="bg-primaryRed/[0.03] p-4 rounded-lg">
                <div className="flex items-center justify-center">
                  <FileInput
                    setValue={formik.setFieldValue}
                    acceptTypes=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    name="employeeFile"
                    value={
                      formik.values?.employeeFile
                        ? formik.values?.employeeFile
                        : null
                    }
                    removeDisabled={removeIcon}
                    isImage={false}
                    parentClass="max-w-[180px] md:max-w-[200px] xl:max-w-[900px] w-full"
                  />
                </div>

                {percentageValue && percentageValue.length > 0 && (
                  <div className="mt-8">
                    <div className="max-w-[300px] h-2 bg-black/10 rounded-full mx-auto w-full overflow-hidden">
                      <div
                        className="bg-primaryRed h-full transition-all duration-300 rounded-full"
                        style={{ width: `${percentageValue[0]?.count}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-primaryRed font-semibold my-1">
                      {percentageValue[0]?.count}%
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap justify-center 1400:flex-nowrap gap-x-2 mt-4">
                  <Button
                    variant={"primary"}
                    type="submit"
                    parentClass=""
                    loader={loader}
                  >
                    {pathname.includes("edit") ? "Save" : "Import"}
                  </Button>
                  <Button
                    variant={"gray"}
                    type="button"
                    parentClass=""
                    onClickHandler={() => {
                      setPercentageValue([]), navigate("/employee/import-logs");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-center font-medium text-sm mt-5">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload();
                    }}
                    className="inline-block underline mr-1 cursor-pointer text-primaryRed hover:text-blue-700"
                  >
                    Download Sample
                  </span>
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 mt-4 grid gap-1 shadow-md">
                <div className=" max-h-[210px] overflow-auto">
                  {percentageValue &&
                    percentageValue.length > 0 &&
                    percentageValue.map((data) => (
                      <>
                        {data.message !== "" && (
                          <p className="font-medium text-sm">
                            <span
                              className={`inline-block ${
                                data.type === "error"
                                  ? "text-primaryRed"
                                  : "text-black"
                              } font-mono`}
                            >
                              {data?.message}
                            </span>
                          </p>
                        )}
                      </>
                    ))}
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AddUpdateEmployeeImport;
