import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { countries } from "../../../src/json/country.json";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { IContactData } from "@/interface/contact/contactInterface";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { Option } from "@/interface/customSelect/customSelect";
import { ContactValidationSchema } from "@/validations/contact/ContactValidation";
import {
  AddContactData,
  EditContactData,
  GetContactDataById,
} from "@/services/contactService";
import { useDispatch, useSelector } from "react-redux";
import {
  activeClientSelector,
  clientDataSelector,
  setActiveClient,
} from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import ClientDropdown from "@/components/dropdown/ClientDropdown";

interface AddUpdateContactProps {
  id?: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateContact = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateContactProps) => {
  const countryList: Option[] = countries.map((value) => ({
    label: value.countryName,
    value: value.countryName,
  }));
  const defaultInitialValues: IContactData = {
    name: "",
    email: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
    dueDateDays: "",
    brandingTheme: "",
    clientId: null,
  };
  const dispatch = useDispatch();
  const clientId = useSelector(activeClientSelector);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const clientDetails = useSelector(clientDataSelector);
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [contactData, setContactData] =
    useState<IContactData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [activeClientContract] = useState<string | number>(clientId);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (id) {
      const response = await EditContactData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      values.clientId = clientId;
      if (clientId) {
        const response = await AddContactData(values);
        if (response?.data?.response_type === "success") {
          setOpenModal(false);
          fetchAllData?.();
        }
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchContactData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  async function fetchContactData(id: string) {
    dispatch(showLoader());
    try {
      const response = await GetContactDataById(id);

      if (response?.data?.responseData) {
        const resultData = response?.data?.responseData;
        dispatch(setActiveClient(resultData.clientId));
        setContactData({
          name: resultData.name,
          email: resultData.email,
          address1: resultData.address1,
          address2: resultData.address2,
          address3: resultData.address3,
          address4: resultData.address4,
          city: resultData.city,
          region: resultData.region,
          postalCode: resultData.postalCode,
          country: resultData.country,
          dueDateDays: resultData.dueDateDays,
          brandingTheme: resultData.brandingTheme,
        });
      }
    } catch (error) {
      console.log("error", error);
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
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
          width="max-w-[870px]"
          title={`${id ? "Edit" : "Add"} Contact`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={contactData}
            enableReinitialize={true}
            validationSchema={ContactValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
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
                                (a) => a.value == activeClientContract
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
                <Card title="Overview" parentClass="mb-5 last:mb-0">
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
                      name="email"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Email"}
                      placeholder={"Enter Email"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="address1"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 1"}
                      placeholder={"Enter Address Line 1"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="address2"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 2"}
                      placeholder={"Enter Address Line 2"}
                    />
                    <TextField
                      name="address3"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 3"}
                      placeholder={"Enter Address Line 3"}
                    />
                    <TextField
                      name="address4"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Address Line 4"}
                      placeholder={"Enter Address Line 4"}
                    />
                    <TextField
                      name="city"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"City"}
                      placeholder={"Enter City"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="region"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Region"}
                      placeholder={"Enter Region"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="postalCode"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Postal Code"}
                      placeholder={"Enter Postal Code"}
                      isCompulsory={true}
                    />
                    <SelectComponent
                      options={countryList ? countryList : []}
                      isMulti={true}
                      name="country"
                      selectedValue={values.country}
                      // parentClass="col-span-2"
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("country", (option as Option).value);
                      }}
                      placeholder="Select Country"
                      label="Country"
                      isCompulsory
                      className="bg-white"
                      menuPlacement="top"
                    />
                  </div>
                </Card>
                <Card title="Xero" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="dueDateDays"
                      parentClass=""
                      type="number"
                      smallFiled={true}
                      label={"Due Date Days"}
                      placeholder={"Enter Due Date Days"}
                      min={0}
                    />
                    <TextField
                      name="brandingTheme"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Branding Theme"}
                      placeholder={"Enter Branding Theme"}
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

export default AddUpdateContact;
