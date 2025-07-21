import React, { useEffect, useRef, useState } from "react";
import { IRequestTypeData } from "@/interface/requestType/requestTypeInterface";
import { AddRequestDocumentData } from "@/services/requestService";
import { useNavigate } from "react-router-dom";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import {
  DeliveryType,
  IRequestDocumentData,
  IRequestSummaryData,
} from "@/interface/requests/RequestDocumentInterface";
import "react-datepicker/dist/react-datepicker.css";
import { GetRequestTypeData } from "@/services/requestTypeService";
import { Option } from "@/components/formComponents/customSelect/type";
import { RequestDocumentValidationSchema } from "@/validations/requests/requestDocumentValidation";
import TextField from "@/components/formComponents/textField/TextField";
import Card from "@/components/card/Card";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import Radio from "@/components/radio/Radio";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import Button from "@/components/formComponents/button/Button";
import moment from "moment";
import { useSelector } from "react-redux";
import { tokenSelector } from "@/redux/slices/userSlice";
import { activeClientSelector } from "@/redux/slices/clientSlice";
const AddRequest = () => {
  const navigate = useNavigate();
  const activeClient = useSelector(activeClientSelector);
  const token = useSelector(tokenSelector);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const defaultInitialValues: IRequestSummaryData = {
    name: "",
    contractNumber: "",
    mobileNumber: "",
    email: "",
    emailDocuments: false,
    deliveryType: DeliveryType.COLLECTION,
    deliveryDate: new Date(),
    requestDocument: [
      {
        documentType: null,
        otherInfo: "",
      },
    ],
  };

  const [requestTypeList, setRequestTypeList] = useState<Option[]>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const reqDoc = values.requestDocument;
    values.clientId = +activeClient;
    values.deliveryDate = moment(
      moment(values.deliveryDate).format("DD-MM-YYYY"),
      "DD-MM-YYYY"
    ).toDate();
    values.requestDocument = values.requestDocument?.filter(
      (val: { documentType: number }) => val.documentType
    );
    const response = await AddRequestDocumentData(values);
    if (response?.data?.response_type === "success") {
      window.location.href = "https://www.lred.com/";
    } else {
      values.requestDocument = reqDoc;
    }
    setLoader(false);
  };

  async function fetchAllRequestType() {
    const response = await GetRequestTypeData();

    if (response?.data?.responseData) {
      const result = response?.data?.responseData;
      setRequestTypeList(
        result?.data
          ?.map((value: IRequestTypeData) => {
            if (value.isActive) return { label: value?.name, value: value?.id };
          })
          .filter((value: Option) => value)
      );
    }
  }

  useEffect(() => {
    fetchAllRequestType();
  }, []);

  return (
    <div
      className={`${
        !token && "min-h-dvh"
      } bg-offWhite p-8 md:p-12 lg:p-16 xl:p-20 2xl:p-50px flex 1200:items-center`}
    >
      <div className="max-w-[1545px] mx-auto w-full">
        <Formik
          initialValues={defaultInitialValues}
          validationSchema={RequestDocumentValidationSchema()}
          onSubmit={OnSubmit}
          innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Card title="Add Request" parentClass="mb-5 last:mb-0">
                <>
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      smallFiled
                      name="name"
                      type="text"
                      label={"Name"}
                      placeholder={"Enter Name"}
                      isCompulsory={true}
                    />
                    <TextField
                      smallFiled
                      name="contractNumber"
                      type="text"
                      label={"Contract Number"}
                      placeholder={"Enter Contract Number"}
                      isCompulsory={true}
                    />
                    <TextField
                      smallFiled
                      name="email"
                      type="text"
                      label={"Email"}
                      placeholder={"Enter Email"}
                      isCompulsory={true}
                    />
                    <TextField
                      smallFiled
                      name="mobileNumber"
                      type="text"
                      label={"Mobile Number"}
                      placeholder={"Enter Mobile Number"}
                      isCompulsory={true}
                    />
                    <CheckBox
                      id="emailDocuments"
                      label="Email Document"
                      checked={values.emailDocuments}
                      value={values.emailDocuments ? "true" : "false"}
                      onChangeHandler={() => {
                        setFieldValue("emailDocuments", !values.emailDocuments);
                      }}
                      parentClass="mb-5 last:mb-0 col-span-2"
                      labelClass="!text-black"
                    />
                    <div className="col-span-2 flex max-w-[200px] justify-between">
                      <Radio
                        id="Collection"
                        name="deliveryType"
                        label="Collection"
                        checked={
                          values.deliveryType === DeliveryType.COLLECTION
                        }
                        onChangeHandler={() => {
                          setFieldValue(
                            "deliveryType",
                            DeliveryType.COLLECTION
                          );
                        }}
                        labelClass="!text-black"
                      />
                      <Radio
                        id="Delivery"
                        name="deliveryType"
                        label="Delivery"
                        checked={values.deliveryType === DeliveryType.DELIVERY}
                        onChangeHandler={() => {
                          setFieldValue("deliveryType", DeliveryType.DELIVERY);
                        }}
                        labelClass="!text-black"
                      />
                    </div>

                    <DateComponent
                      smallFiled
                      name="deliveryDate"
                      label={`Date`}
                      value={values?.deliveryDate}
                      isCompulsory={true}
                      onChange={(date) => {
                        setFieldValue(
                          "deliveryDate",
                          moment(
                            moment(date ?? new Date()).format("DD-MM-YYYY"),
                            "DD-MM-YYYY"
                          ).toDate()
                        );
                      }}
                    />
                  </div>
                </>
              </Card>
              <Card title="Required Documents" parentClass="mb-5 last:mb-0">
                <>
                  <div className="grid grid-cols-2 gap-5">
                    {values?.requestDocument?.map(
                      (val: IRequestDocumentData, inx: number) => {
                        return (
                          <React.Fragment key={`card_${val.id}`}>
                            <SelectComponent
                              options={requestTypeList}
                              name="requestDocument[0].documentType"
                              selectedValue={val.documentType}
                              onChange={(option: Option | Option[]) => {
                                const existLength = values.requestDocument
                                  ? values.requestDocument?.length
                                  : 0;
                                const updatedRequestDocumentList =
                                  values.requestDocument
                                    ? values.requestDocument
                                    : [];
                                updatedRequestDocumentList[inx][
                                  "documentType"
                                ] = Number((option as Option).value);
                                if (
                                  (option as Option).value != 0 &&
                                  requestTypeList.length >= existLength &&
                                  !updatedRequestDocumentList?.find(
                                    (val: IRequestDocumentData) =>
                                      val.documentType == 0
                                  )
                                ) {
                                  setFieldValue("requestDocument", [
                                    ...updatedRequestDocumentList,
                                    {
                                      documentType: 0,
                                      otherInfo: "",
                                    },
                                  ]);
                                }
                              }}
                              placeholder="Select Document Type"
                              label="Document Type"
                              className="bg-white"
                              isCompulsory={true}
                              menuPlacement="top"
                            />
                            <TextField
                              smallFiled
                              name={`requestDocument[${inx}]['otherInfo']`}
                              type="text"
                              label={"Other Info (e.g. Month)"}
                              placeholder={"Enter Other Info (e.g. Month)"}
                            />
                          </React.Fragment>
                        );
                      }
                    )}
                  </div>
                </>
              </Card>
              <div className={`flex gap-4 justify-end`}>
                <Button
                  variant={"primaryBorder"}
                  type="button"
                  onClickHandler={() =>
                    !token ? navigate("/login") : navigate("/")
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant={"primary"}
                  onClickHandler={OnSubmit}
                  loader={loader}
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddRequest;
