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
import { IReliquatPaymentData } from "@/interface/reliquatPayment/reliquatPaymentInterface";
import {
  activeClientSelector,
  clientDataSelector,
} from "@/redux/slices/clientSlice";
import { ReliquatPaymentValidationSchema } from "@/validations/reliquatPayment/reliquatPaymentValidation";
import { GetTimesheetReliquatAdjustmentDate } from "@/services/timesheetService";
import moment from "moment";
import {
  AddReliquatPaymentData,
  EditReliquatPaymentData,
  GetReliquatPaymentDataById,
} from "@/services/reliquatPaymentService";
import { setEmployeeDropdownOptions } from "@/helpers/Utils";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import ClientDropdown from "@/components/dropdown/ClientDropdown";
import generateDataModal from "@/components/generateModal/generateModal";
import { socketSelector } from "@/redux/slices/socketSlice";

interface AddUpdateReliquatPaymentProps {
  id?: string;
  employeeId?: number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateReliquatPayment = ({
  id,
  employeeId,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateReliquatPaymentProps) => {
  const activeClient = useSelector(activeClientSelector);
  const socket = useSelector(socketSelector);
  const defaultInitialValues: IReliquatPaymentData = {
    clientId: activeClient ? Number(activeClient) : null,
    employeeId: employeeId ? employeeId : null,
    startDate: null,
    amount: null,
  };
  const [reliquatPaymentData, setReliquatPaymentData] =
    useState(defaultInitialValues);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const dispatch = useDispatch();
  const clientDetails = useSelector(clientDataSelector);
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [activeLocalClient, setActiveLocalClient] = useState<string | number>(
    activeClient
  );
  const activeEmployeeData = useSelector(activeEmployeeDataSelector);
  const activeEmployee=useSelector(activeEmployeeSelector)
  const [employeeOptions, setEmployeeOptions] = useState<GroupOption[]>([]);
  const [dateList, setDateList] = useState<Option[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [generateModalData, setGenerateModalData] = useState<{
    percentage: number;
    type: string;
    message: string;
  } | null>(null);
  const [generatemodal, setGenerateModal] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    setGenerateModal(true);
    if (id) {
      delete values.clientId;
      delete values.employeeId;
      const response = await EditReliquatPaymentData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddReliquatPaymentData(values);
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
  }, [activeLocalClient]);

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
        `?type=payment&employeeId=${activeEmployee}`
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
      fetchReliquatPaymentData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchReliquatPaymentData(id: string) {
    dispatch(showLoader());
    const response = await GetReliquatPaymentDataById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setReliquatPaymentData({
        clientId: resultData.clientId,
        employeeId: resultData.employeeId,
        startDate: moment(resultData.startDate).format("YYYY-MM-DD"),
        amount: resultData.amount,
      });
    }
    dispatch(hideLoader());
  }

  useEffect(() => {
    if (employeeOptions?.length > 0 && !activeEmployee) {
      const activeEmployeeId = Number(employeeOptions[0]?.options[0]?.value);
      dispatch(setActiveEmployee(activeEmployeeId));
      setReliquatPaymentData({
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
          title={`${id ? "Edit" : "Add"} Reliquat Payment`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={reliquatPaymentData}
            enableReinitialize={true}
            validationSchema={ReliquatPaymentValidationSchema()}
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
                {activeEmployee != 0 && employeeOptions && employeeOptions?.length > 0 && (
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
                            <span className="font-bold inline-block pr-10px mb-2">
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
                    <Card title="Payment" parentClass="mb-5 last:mb-0">
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
                            label="Days"
                            name="amount"
                            parentClass={"mb-6"}
                            smallFiled={true}
                            isCompulsory={true}
                            placeholder="Days"
                            min={0}
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

export default AddUpdateReliquatPayment;
