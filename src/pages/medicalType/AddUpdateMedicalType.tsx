import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { Option } from "@/interface/customSelect/customSelect";
import { IMedicalTypeData } from "@/interface/medicalType/MedicalTypeInterface";
import {
  AddMedicalTypeData,
  EditMedicalTypeData,
  GetMedicalTypeDataById,
} from "@/services/medicalTypeService";
import { MedicalTypeValidationSchema } from "@/validations/medicalType/MedicalTypeValidation";
import { formatOptionData } from "@/constants/DropdownConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch } from "react-redux";

interface AddUpdateMedicalTypeProps {
  id?: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateMedicalType = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateMedicalTypeProps) => {
  const defaultInitialValues: IMedicalTypeData = {
    name: "",
    format: "",
    daysBeforeExpiry: null,
    daysExpiry: null,
    amount: null,
  };
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [medicalTypeData, setMedicalTypeData] =
    useState<IMedicalTypeData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (id) {
      delete values.clientId;
      const response = await EditMedicalTypeData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddMedicalTypeData(values);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchMedicalTypeData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchMedicalTypeData(id: string) {
    dispatch(showLoader());
    try {
      const response = await GetMedicalTypeDataById(id);

      if (response?.data?.responseData) {
        const resultData = response?.data?.responseData;
        setMedicalTypeData({
          name: resultData.name,
          format: resultData.format,
          daysBeforeExpiry: resultData.daysBeforeExpiry,
          daysExpiry: resultData.daysExpiry,
          amount: resultData.amount,
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
          title={`${id ? "Edit" : "Add"} Medical Types`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={medicalTypeData}
            enableReinitialize={true}
            validationSchema={MedicalTypeValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
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
                    <SelectComponent
                      options={formatOptionData ? formatOptionData : []}
                      name="format"
                      selectedValue={values.format}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("format", (option as Option).value);
                      }}
                      placeholder="Select format"
                      label="Format"
                      className="bg-white"
                      isCompulsory={true}
                    />
                    <TextField
                      name="daysBeforeExpiry"
                      parentClass=""
                      type="number"
                      min={0}
                      smallFiled={true}
                      label={"Days before expiry"}
                      placeholder={"Enter Days before expiry"}
                    />
                    <TextField
                      name="daysExpiry"
                      parentClass=""
                      type="number"
                      min={0}
                      smallFiled={true}
                      label={"Expiry in (Days)"}
                      placeholder={"Enter Days expiry"}
                    />
                    <TextField
                      name="amount"
                      parentClass=""
                      type="number"
                      min={0}
                      smallFiled={true}
                      label={"Amount"}
                      placeholder={"Amount"}
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

export default AddUpdateMedicalType;
