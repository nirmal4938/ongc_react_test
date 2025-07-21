import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import React, { useEffect, useRef, useState } from "react";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { Option } from "@/interface/customSelect/customSelect";
import Radio from "@/components/radio/Radio";
import { GetRequestTypeData } from "@/services/requestTypeService";
import { IRequestTypeData } from "@/interface/requestType/requestTypeInterface";
import TextField from "@/components/formComponents/textField/TextField";
import {
  DeliveryType,
  IRequestDocumentData,
  IRequestSummaryData,
} from "@/interface/requests/RequestDocumentInterface";
import { RequestDocumentValidationSchema } from "@/validations/requests/requestDocumentValidation";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import { AddRequestDocumentData } from "@/services/requestService";

interface AddUpdateMedicalRequestProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddRequestDocument = ({
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateMedicalRequestProps) => {
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
    values.requestDocument = values.requestDocument?.filter(
      (val: { documentType: number }) => val.documentType
    );
    const response = await AddRequestDocumentData(values);
    if (response?.data?.response_type === "success") {
      setOpenModal(false);
      fetchAllData?.();
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
          title="Documents"
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={defaultInitialValues}
            validationSchema={RequestDocumentValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card title="Your Details" parentClass="mb-5 last:mb-0">
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
                          setFieldValue(
                            "emailDocuments",
                            !values.emailDocuments
                          );
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
                          checked={
                            values.deliveryType === DeliveryType.DELIVERY
                          }
                          onChangeHandler={() => {
                            setFieldValue(
                              "deliveryType",
                              DeliveryType.DELIVERY
                            );
                          }}
                          labelClass="!text-black"
                        />
                      </div>
                      <DateComponent
                        smallFiled
                        name="deliveryDate"
                        label={`Date`}
                        value={values?.deliveryDate}
                        minDate={new Date()}
                        isCompulsory={true}
                        onChange={(date) => {
                          setFieldValue("deliveryDate", date);
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
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default AddRequestDocument;
