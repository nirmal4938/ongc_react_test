import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { useDispatch, useSelector } from "react-redux";
import { GroupOption, Option } from "@/interface/customSelect/customSelect";
import {
  activeEmployeeDataSelector,
  activeEmployeeSelector,
  setActiveEmployee,
} from "@/redux/slices/employeeSlice";
import GroupSelectComponent from "@/components/formComponents/customSelect/GroupSelect";
import TextField from "@/components/formComponents/textField/TextField";
import { IReliquatAdjustmentData } from "@/interface/reliquatAdjustment/reliquatAdjustmentInterface";
import {
  activeClientSelector,
  clientDataSelector,
} from "@/redux/slices/clientSlice";
import { ReliquatAdjustmentValidationSchema } from "@/validations/reliquatAdjustment/reliquatAdjustmentValidation";
import { GetTimesheetReliquatAdjustmentDate } from "@/services/timesheetService";
import moment from "moment";
import {
  AddReliquatAdjustmentData,
  EditReliquatAdjustmentData,
  GetReliquatAdjustmentDataById,
} from "@/services/reliquatAdjustmentService";
import { setEmployeeDropdownOptions } from "@/helpers/Utils";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import ClientDropdown from "@/components/dropdown/ClientDropdown";
import { socketSelector } from "@/redux/slices/socketSlice";
import generateDataModal from "@/components/generateModal/generateModal";

interface AddUpdateReliquatAdjustmentProps {
  id?: string;
  employeeId?: number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateReliquatAdjustment = ({
  id,
  employeeId,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateReliquatAdjustmentProps) => {
  const activeClient = useSelector(activeClientSelector);
  const clientDetails = useSelector(clientDataSelector);
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const defaultInitialValues: IReliquatAdjustmentData = {
    clientId: activeClient ? Number(activeClient) : null,
    employeeId:employeeId ? employeeId : null,
    startDate: null,
    adjustment: null,
  };
  const [reliquatAdjustmentData, setReliquatAdjustmentData] =
    useState(defaultInitialValues);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const dispatch = useDispatch();
  const activeEmployeeData = useSelector(activeEmployeeDataSelector);
  const activeEmployee=useSelector(activeEmployeeSelector)
  const socket = useSelector(socketSelector);
  const [activeLocalClient, setActiveLocalClient] = useState<string | number>(
    activeClient
  );
  const [employeeOptions, setEmployeeOptions] = useState<GroupOption[]>([]);
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);
  const [generatemodal, setGenerateModal] = useState<boolean>(false);
  const [dateList, setDateList] = useState<Option[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    setGenerateModal(true);
    if (id) {
      delete values.clientId;
      delete values.employeeId;
      const response = await EditReliquatAdjustmentData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddReliquatAdjustmentData(values);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setGenerateModal(false);
    setGenerateModalData(null);
    setLoader(false);
  };

  useEffect(() => {
    if (clientDetails) {
      const resp: Option[] | Option = [];
      for (const i in clientDetails) {
        if (clientDetails[i]?.loginUserData?.name) {
          resp.push({
            label: String(clientDetails[i]?.loginUserData?.name),
            value: String(clientDetails[i]?.id),
          });
        }
      }
      resp && setClientOptions(resp);
    }
  }, [clientDetails]);

  useEffect(() => {
    if (activeLocalClient) {
      fetchTimesheetDate(Number(activeLocalClient));
      fetchAllDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocalClient,activeEmployee]);

  const fetchAllDetails = async () => {
    if (Number(activeLocalClient) > 0) {
      setEmployeeOptions(
        await setEmployeeDropdownOptions(Number(activeLocalClient))
      );
    }
  };

  async function fetchTimesheetDate(id: number) {
    if(activeEmployee!==0){
      const response = await GetTimesheetReliquatAdjustmentDate(
        id,
        `?type=adjustment&employeeId=${activeEmployee}`
      );
      if (response?.data?.responseData) {
        const result = response?.data?.responseData;
        setDateList(
          result?.map((value: string) => {
            return { label: moment(value).format("DD-MM-YYYY"), value: value };
          })
        );
      }
    }
  }

  socket?.on("generate-modal-data", (data) => {
    setGenerateModalData(data);
  });
  useEffect(() => {
    if (id) {
      fetchReliquatAdjustmentData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchReliquatAdjustmentData(id: string) {
    dispatch(showLoader());
    const response = await GetReliquatAdjustmentDataById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setReliquatAdjustmentData({
        clientId: resultData.clientId,
        employeeId: resultData.employeeId,
        startDate: moment(resultData.startDate).format("YYYY-MM-DD"),
        adjustment: resultData.adjustment,
      });
    }
    dispatch(hideLoader());
  }

 
  useEffect(() => {
    if (employeeOptions?.length > 0 && !activeEmployee) {
      const activeEmployeeId = Number(employeeOptions[0]?.options[0]?.value);
      dispatch(setActiveEmployee(activeEmployeeId));
      setReliquatAdjustmentData({
        ...defaultInitialValues,
        employeeId: activeEmployeeId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeOptions]);

  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <>
      {openModal && (
        <Modal
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
          width="max-w-[870px]"
          title={`${id ? "Edit" : "Add"} Reliquat Adjustment`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={reliquatAdjustmentData}
            enableReinitialize={true}
            validationSchema={ReliquatAdjustmentValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card title="Select Employee" parentClass="mb-5 last:mb-0">
                  <>
                    <div className="grid grid-cols-2 gap-5">
                      {id ? (
                        <TextField
                          name="displayClient"
                          parentClass=""
                          type="text"
                          label="Select Client"
                          isCompulsory={true}
                          smallFiled={true}
                          disabled={true}
                          value={
                            clientOptions?.length > 0
                              ? clientOptions?.find(
                                  (a) => a.value == values?.clientId
                                )?.label
                              : ""
                          }
                        />
                      ) : (
                        <ClientDropdown
                        label="Select Client"
                        isCompulsory={true}
                        isUpdateGlobal={false}
                        updateFunction={(newValue) => {
                          setActiveLocalClient(newValue);
                          dispatch(setActiveEmployee(0));
                        }}
                      />
                      )}
                      <GroupSelectComponent
                       options={employeeOptions ? employeeOptions : []}
                       selectedValue={employeeId ? employeeId : null}
                        onChange={(e: Option | Option[]) => {
                          dispatch(setActiveEmployee((e as Option).value));
                          setFieldValue("employeeId", (e as Option).value);
                        }}
                        name="employeeId"
                        isMulti={false}
                        placeholder="Select Employee"
                        label="Select Employee"
                        className="bg-white"
                        parentClass=""
                        isCompulsory={true}
                      />
                    </div>
                  </>
                </Card>
                {activeEmployee != 0 && employeeOptions && employeeOptions?.length > 0 &&(
                  <>
                    <Card title="Employee" parentClass="mb-5 last:mb-0">
                      <>
                        <div className="flex gap-5 justify-center">
                          <div className="flex text-sm/18px w-1/3 gap-5 justify-center">
                            <span className="font-bold pr-10px">Name</span>
                            <span className="font-medium ">
                              {activeEmployeeData?.employeeNumber +
                                " " +
                                activeEmployeeData?.loginUserData?.lastName +
                                " " +
                                activeEmployeeData?.loginUserData?.firstName}
                            </span>
                          </div>
                          <div className="flex text-sm/18px w-1/3 gap-5 justify-center">
                            <span className="font-bold inline-block pr-10px mb-2 ">
                              Reliquat
                            </span>
                            <span className="font-medium inline-block">
                              {activeEmployeeData?.empReliquatCalculation
                                 &&
                                activeEmployeeData?.empReliquatCalculation}
                            </span>
                          </div>
                          <div className="flex text-sm/18px w-1/3 gap-5 justify-center">
                            <span className="font-bold inline-block pr-10px">
                              Matricule
                            </span>
                            <span className="font-medium inline-block">
                              {activeEmployeeData?.employeeNumber}
                            </span>
                          </div>
                        </div>
                      </>
                    </Card>
                    <Card title="Adjustment" parentClass="mb-5 last:mb-0">
                      <>
                        <div className="grid grid-cols-2 gap-5">
                          <SelectComponent
                            options={dateList}
                            isMulti={false}
                            name="startDate"
                            selectedValue={values?.startDate}
                            onChange={(option: Option | Option[]) => {
                              setFieldValue(
                                "startDate",
                                (option as Option).value
                              );
                            }}
                            placeholder="Select Date"
                            label="Timesheet Start Date"
                            className="bg-white"
                            isCompulsory={true}
                            parentClass=""
                          />
                          <TextField
                            type="number"
                            label="Adjustment"
                            name="adjustment"
                            parentClass={"mb-6"}
                            smallFiled={true}
                            isCompulsory={true}
                            placeholder="Adjustment"
                          />
                        </div>
                      </>
                    </Card>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </Modal>
      )}
      {generatemodal &&
        generateModalData &&
        generateDataModal(generateModalData)}
    </>
  );
};

export default AddUpdateReliquatAdjustment;
