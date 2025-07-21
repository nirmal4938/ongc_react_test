import SelectComponent from "@/components/formComponents/customSelect/Select";
import TextField from "@/components/formComponents/textField/TextField";
import { Option } from "@/interface/customSelect/customSelect";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { ISegmentData } from "@/interface/segment/segmentInterface";
import { useEffect, useRef, useState } from "react";
import {
  AddSegmentData,
  GetSegmentDataById,
  EditSegmentData,
  GetSegmentSegmentDataForClientTimesheetDataById,
} from "@/services/segmentService";
import { useDispatch, useSelector } from "react-redux";
import {
  clientDataSelector,
  activeClientSelector,
} from "@/redux/slices/clientSlice";
import { userSelector } from "@/redux/slices/userSlice";
import { SegmentValidationSchema } from "@/validations/segment/SegmentValidation";
import { GetContactData } from "@/services/contactService";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import ClientDropdown from "@/components/dropdown/ClientDropdown";

const defaultInitialValues: ISegmentData = {
  code: "",
  name: "",
  costCentre: "",
  fridayBonus: 0,
  saturdayBonus: 0,
  overtime01Bonus: 0,
  overtime02Bonus: 0,
  timeSheetStartDay: 1,
  vatRate: 0,
  xeroFormat: null,
  clientId: null,
  createdBy: 0,
  contactId: null,
};

interface AddUpdateSegmentProps {
  id?: string | number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateSegment = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateSegmentProps) => {
  const user = useSelector(userSelector);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const clientDetails = useSelector(clientDataSelector);
  const activeClient = useSelector(activeClientSelector);
  const [segmentData, setSegmentData] =
    useState<ISegmentData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [contactData, setContactData] = useState<Option[]>([]);
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [activeClientSegment] = useState<string | number>(activeClient);
  const queryString = `?` + `&clientId=${activeClientSegment}`;
  const dispatch = useDispatch();
  useEffect(() => {
    if (activeClientSegment) {
      fetchAllContact(queryString);
      fetchSegmentDataForClientTimesheetData(activeClientSegment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClientSegment]);

  useEffect(() => {
    setSegmentData({ ...segmentData, clientId: Number(activeClient) });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  async function fetchAllContact(query: string) {
    setLoader(true);
    const response = await GetContactData(query);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setContactData(resp);
    }
    setLoader(false);
  }

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("code", values?.code);
    formData.append("name", values?.name);
    formData.append("costCentre", values?.costCentre);
    formData.append("fridayBonus", values?.fridayBonus);
    formData.append("saturdayBonus", values?.saturdayBonus);
    formData.append("overtime01Bonus", values?.overtime01Bonus);
    formData.append("overtime02Bonus", values?.overtime02Bonus);
    formData.append("timeSheetStartDay", values?.timeSheetStartDay);
    formData.append("vatRate", values?.vatRate);
    formData.append("xeroFormat", values?.xeroFormat);
    formData.append("clientId", values?.clientId);
    formData.append("contactId", values?.contactId);
    
    // const segmentData = {
    //   code: values.code,
    //   name: values.name.trim(),
    //   costCentre: values?.costCentre?.trim(),
    //   fridayBonus: values?.fridayBonus,
    //   saturdayBonus: values?.saturdayBonus,
    //   overtime01Bonus: values?.overtime01Bonus,
    //   overtime02Bonus: values?.overtime02Bonus,
    //   vatRate: values.vatRate,
    //   xeroFormat: values.xeroFormat,
    //   clientId: values.clientId,
    //   contactId: values.contactId,
    // };
    if (id) {
      const response = await EditSegmentData(formData, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddSegmentData(formData);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchClientData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchClientData(id: string | number) {
    dispatch(showLoader());
    const response = await GetSegmentDataById(id);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setSegmentData((prevSegmentData) => ({
        ...prevSegmentData,
        id: resultData.id,
        clientId: resultData.clientId,
        contactId: resultData.contactId,
        // timeSheetStartDay: resultData.timeSheetStartDay,
        code: resultData.code,
        name: resultData.name,
        costCentre: resultData.costCentre,
        fridayBonus: resultData.fridayBonus,
        saturdayBonus: resultData.saturdayBonus,
        overtime01Bonus: resultData.overtime01Bonus,
        overtime02Bonus: resultData.overtime02Bonus,
        vatRate: resultData.vatRate,
        xeroFormat: resultData.xeroFormat,
        createdBy: user?.id,
      }));
    
    }
    dispatch(hideLoader());
  }

  async function fetchSegmentDataForClientTimesheetData(id: string | number) {
    dispatch(showLoader());
    const response = await GetSegmentSegmentDataForClientTimesheetDataById(id);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setSegmentData((prevSegmentData) => ({
        ...prevSegmentData,
        timeSheetStartDay: resultData?.timeSheetStartDay,
      }));
    }
    dispatch(hideLoader());
  }

  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <>
      {openModal && (
        <Modal
          width="max-w-[870px]"
          title={`${id ? "Edit" : "Add"} Segments`}
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
          closeModal={() => setOpenModal(false)}
        >
          
          <Formik
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            initialValues={segmentData}
            validationSchema={SegmentValidationSchema()}
            enableReinitialize={true}
            onSubmit={OnSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card title="Client" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    {id ? (
                      <TextField
                        name="displayClient"
                        parentClass=""
                        type="text"
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
                        parentClass="w-100"
                      />
                    )}
                  </div>
                </Card>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="name"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Enter Name"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="code"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Code"}
                      placeholder={"Enter Code"}
                      isCompulsory={true}
                    />
                    <SelectComponent
                      name="contactId"
                      options={contactData}
                      selectedValue={values?.contactId}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("contactId", (option as Option).value);
                      }}
                      placeholder="Select"
                      label="Contact"
                      className="bg-white"
                    />
                    <TextField
                      name="costCentre"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Cost Centre"}
                      placeholder={"Enter Cost Centre"}
                    />
                    {/* <TextField
                      name="timeSheetStartDay"
                      parentClass=""
                      type="number"
                      min={1}
                      max={31}
                      smallFiled={true}
                      label={"Timesheet Start Day"}
                      isCompulsory={true}
                      placeholder={"Enter Other Info (e.g. Day)"}
                    /> */}
                  </div>
                </Card>
                <Card
                  title="Weekend and Overtime Bonuses"
                  parentClass="mb-5 last:mb-0"
                >
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="fridayBonus"
                      parentClass=""
                      type="number"
                      smallFiled={true}
                      label={"Friday Bonus"}
                      placeholder={"Enter Friday Bonus"}
                      min={0}
                    />
                    <TextField
                      name="saturdayBonus"
                      parentClass=""
                      type="number"
                      smallFiled={true}
                      label={"Saturday Bonus"}
                      placeholder={"Enter Saturday Bonus"}
                      min={0}
                    />
                    <TextField
                      name="overtime01Bonus"
                      parentClass=""
                      type="number"
                      smallFiled={true}
                      label={"Overtime O1 Bonus"}
                      placeholder={"Enter Overtime O1 Bonus"}
                      min={0}
                    />
                    <TextField
                      name="overtime02Bonus"
                      parentClass=""
                      type="number"
                      smallFiled={true}
                      label={"Overtime O2 Bonus"}
                      placeholder={"Enter Overtime O2 Bonus"}
                      min={0}
                    />
                  </div>
                </Card>
                <Card title="Accounts" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="vatRate"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"VAT Rate"}
                      placeholder={"Enter VAT Rate"}
                    />
                    <SelectComponent
                      name="xeroFormat"
                      options={[
                        { label: "Invoice By Employee", value: 1 },
                        { label: "Invoice By Segment", value: 2 },
                      ]}
                      selectedValue={values.xeroFormat}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("xeroFormat", (option as Option).value);
                      }}
                      placeholder="Select"
                      label="Xero Format"
                      isCompulsory
                      className="bg-white"
                      menuPlacement="top"
                    />
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default AddUpdateSegment;
