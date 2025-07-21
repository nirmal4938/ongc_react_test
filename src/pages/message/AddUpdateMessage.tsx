import { Form, Formik, FormikValues } from "formik";
import Button from "@/components/formComponents/button/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetEmployeeData } from "@/services/employeeService";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import { Option } from "@/interface/customSelect/customSelect";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  IInitialMessageData,
  IMessageStatus,
} from "@/interface/message/message";
import ReactQuillComponent from "@/components/formComponents/reactQuillComponent/ReactQuillComponent";
import { GetSegmentData } from "@/services/segmentService";
import { ISegmentData } from "@/interface/segment/segmentInterface";
import {
  AddMessageData,
  EditMessageData,
  GetMessageDataById,
} from "@/services/messageService";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import { MessageValidationSchema } from "@/validations/message/MessageValidation";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { GetAllManager } from "@/services/userService";
import Card from "@/components/card/Card";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";

const AddUpdateMessage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeClient = useSelector(activeClientSelector);
  const dispatch = useDispatch();
  const tempEmp: string[] = [];
  const tempSegment: string[] = [];
  const tempManager: string[] = [];
  const queryString = `?clientId=${activeClient}`;
  const defaultInitialValues: IInitialMessageData = {
    employeeId: [],
    segmentId: [],
    managerId: [],
    allCheck: false,
    message: "",
    isSchedule: false,
    scheduleDate: new Date(),
  };
  const [messageData, setMessageData] =
    useState<IInitialMessageData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<Option[]>();
  const [segmentDataList, setSegmentDataList] = useState<Option[]>();
  const [managerDataList, setManagerDataList] = useState<Option[]>();

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);

    const params = {
      employeeId: values.employeeId,
      segmentId: values.segmentId,
      managerUserId: values.managerId,
      message: values.message,
      clientId: activeClient.toString(),
      status: values.status,
      isSchedule: values.isSchedule,
      scheduleDate: values.scheduleDate,
    };

    if (id) {
      const response = await EditMessageData(params, id);
      if (response?.data?.response_type === "success") {
        navigate("/admin/message");
      }
    } else {
      const response = await AddMessageData(params);
      if (response?.data?.response_type === "success") {
        navigate("/admin/message");
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchAllEmployee(queryString);
    fetchAllSegmentData(queryString);
    fetchAllManagerData(queryString);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);

  useEffect(() => {
    if (id) {
      fetchMessageData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAllManagerData = async (query: string) => {
    const response = await GetAllManager(query);

    if (response?.data?.responseData) {
      const managerDataList = response?.data?.responseData.map(
        (data: { id: number; loginUserData: { name: string } }) => ({
          label: data?.loginUserData?.name,
          value: data.id,
        })
      );
      setManagerDataList(managerDataList);
    }
  };

  const fetchAllEmployee = async (query: string) => {
    const response = await GetEmployeeData(query + `&isActive=true`);

    if (response?.data?.responseData?.data) {
      const employeeDataList = response?.data?.responseData?.data?.map(
        (data: IEmployeeData) => ({
          label:
            data?.loginUserData?.lastName +
            " " +
            data?.loginUserData?.firstName,
          value: data.id,
        })
      );
      setEmployeeData(employeeDataList);
    }
  };
  const fetchAllSegmentData = async (query: string) => {
    const response = await GetSegmentData(query + `&isActive=true`);

    if (response?.data?.responseData?.data) {
      const segmentDataList = response?.data?.responseData?.data?.map(
        (data: ISegmentData) => ({
          label: data?.name,
          value: data.id,
        })
      );
      setSegmentDataList(segmentDataList);
    }
  };
  const fetchMessageData = async (id: string) => {
    dispatch(showLoader());
    const response = await GetMessageDataById(id);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      if (resultData?.length > 0) {
        resultData?.forEach(
          (e: {
            employeeId: string | null;
            segmentId: string | null;
            managerUserId: string | null;
          }) => {
            e.employeeId !== null && tempEmp.push(e.employeeId);
            e.segmentId !== null && tempSegment.push(e.segmentId);
            e.managerUserId !== null && tempManager.push(e.managerUserId);
          }
        );
      }

      setMessageData({
        employeeId: tempEmp,
        segmentId: tempSegment,
        managerId: tempManager,
        message: resultData[0]?.message ? resultData[0]?.message : "",
        isSchedule: resultData[0]?.isSchedule
          ? resultData[0]?.isSchedule
          : false,
        scheduleDate: resultData[0]?.scheduleDate
          ? new Date(resultData[0]?.scheduleDate)
          : null,
      });
    }
    dispatch(hideLoader());
  };

  return (
    <>
      <Card>
        <Formik
          initialValues={messageData}
          enableReinitialize={true}
          validationSchema={MessageValidationSchema()}
          onSubmit={OnSubmit}
        >
          {({
            values,
            setFieldValue,
            setFieldTouched,
            handleSubmit,
            errors,
          }) => (
            <Form>
              <CheckBox
                name={"allCheck"}
                id="selectAll"
                label="Select All (Send message to everyone)"
                checked={
                  values.employeeId &&
                  values.segmentId &&
                  values.managerId &&
                  employeeData &&
                  segmentDataList &&
                  managerDataList &&
                  values.employeeId?.length +
                    values.segmentId?.length +
                    values.managerId?.length ===
                    employeeData.length +
                      segmentDataList.length +
                      managerDataList?.length
                }
                onChangeHandler={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("allCheck", e.target.checked);
                  if (e.target.checked === true) {
                    employeeData &&
                      setFieldValue("employeeId", [
                        ...employeeData.map((e) => e.value),
                      ]);
                    segmentDataList &&
                      setFieldValue("segmentId", [
                        ...segmentDataList.map((e) => e.value),
                      ]);
                    managerDataList &&
                      setFieldValue("managerId", [
                        ...managerDataList.map((e) => e.value),
                      ]);
                  } else {
                    setFieldValue("employeeId", []);
                    setFieldValue("segmentId", []);
                    setFieldValue("managerId", []);
                  }
                }}
              />
              <div className="grid grid-cols-2 gap-4 border border-solid border-black/10 p-4 rounded-md mt-4 bg-white">
                <CustomSelect
                  inputClass={""}
                  name="employeeId"
                  label="Employee"
                  isMulti={true}
                  placeholder=""
                  options={employeeData ?? []}
                  isCompulsory={true}
                  isUseFocus={false}
                  className="bg-white"
                />
                <CustomSelect
                  inputClass={""}
                  name="segmentId"
                  label="Select Segment"
                  isMulti={true}
                  placeholder=""
                  options={segmentDataList ?? []}
                  isCompulsory={false}
                  isUseFocus={true}
                  className="bg-white"
                />
                <CustomSelect
                  inputClass={""}
                  name="managerId"
                  label="Select Manager"
                  isMulti={true}
                  placeholder=""
                  options={managerDataList ?? []}
                  isCompulsory={false}
                  isUseFocus={true}
                  className="bg-white"
                />

                <ReactQuillComponent
                  label={"Message"}
                  key={messageData?.message}
                  value={messageData?.message ? messageData?.message : ""}
                  setFieldValue={setFieldValue}
                  name="message"
                  isCompulsory={true}
                  setFieldTouched={setFieldTouched}
                  parentClass="col-span-2 background-white"
                />
                <CheckBox
                  id="isSchedule"
                  label="Schedule"
                  labelClass="Schedule"
                  checked={values.isSchedule}
                  value={values.isSchedule == true ? "true" : "false"}
                  onChangeHandler={() => {
                    setFieldValue(
                      "isSchedule",
                      values.isSchedule == true ? false : true
                    );
                  }}
                  parentClass="!text-black mr-4 1200:mr-5 1600:mr-10"
                />

                {values.isSchedule && (
                  <DateComponent
                    name="scheduleDate"
                    smallFiled
                    label={"Schedule Date"}
                    timeIntervals={1}
                    showTimeSelect={true}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    value={
                      values?.scheduleDate ? values.scheduleDate : new Date()
                    }
                    placeholder={""}
                    onChange={(date) => {
                      setFieldValue("scheduleDate", date);
                    }}
                  />
                )}
              </div>
              <div className="flex flex-wrap justify-end 1400:flex-nowrap gap-x-2 mt-4">
                <Button
                  type="button"
                  variant={"primary"}
                  parentClass=""
                  onClickHandler={() => {
                    setFieldValue("status", IMessageStatus.SENT);
                    handleSubmit();
                  }}
                  loader={
                    Object.keys(errors).length === 0 &&
                    (values as object as { status: IMessageStatus })?.status ===
                      IMessageStatus.SENT &&
                    loader
                  }
                >
                  Send
                </Button>

                <Button
                  type="submit"
                  variant={"primary"}
                  parentClass=""
                  loader={
                    Object.keys(errors).length === 0 &&
                    (values as object as { status: IMessageStatus })?.status !==
                      IMessageStatus.SENT &&
                    loader
                  }
                  onClickHandler={() => {
                    setFieldValue("status", IMessageStatus.DRAFT);
                  }}
                >
                  Save As Draft
                </Button>

                <Button
                  variant={"gray"}
                  type="button"
                  parentClass=""
                  onClickHandler={() => navigate("/admin/message")}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </>
  );
};

export default AddUpdateMessage;
