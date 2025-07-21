import Card from "@/components/card/Card";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import { transportSummaryTypeList } from "@/constants/DropdownConstants";
import { transportSummaryEnum } from "@/enum/transport";
import { Option } from "@/interface/customSelect/customSelect";
import { ISummaryData } from "@/interface/transport/transportInterface";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  AddCapacity,
  AddSummaryData,
  UpdateCapacityData,
  UpdateSummaryData,
} from "@/services/transportSummaryService";
import { addSummaryValidationSchema } from "@/validations/transport/addSummaryValidation";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const AddSummary = ({
  setAddedOrUpdatedDataType,
  setOpenModal,
  editData,
  setEditSummaryData,
}: {
  editData: ISummaryData;
  setEditSummaryData: React.Dispatch<React.SetStateAction<ISummaryData>>;
  setAddedOrUpdatedDataType: React.Dispatch<React.SetStateAction<string>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const selectedClientId = useSelector(activeClientSelector);
  const [id, setId] = useState<number>();
  const defaultInitialValues: { name: string; summaryType: string } = {
    name: "",
    summaryType: "",
  };
  const [summaryData, setSummaryData] = useState<{
    name?: string;
    summaryType?: string;
  }>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<FormikValues>>();

  useEffect(() => {
    if (editData) {
      setId(Number(editData.id));
      if (editData.type !== transportSummaryEnum.Capacity)
        setSummaryData({ name: editData.name, summaryType: editData.type });
      else {
        setSummaryData({ name: editData.value, summaryType: editData.type });
      }
    }
  }, [editData]);

  const handleSubmit = async (values: FormikValues) => {
    setLoader(true);

    const handleSuccess = (
      responseType: string | undefined,
      dataType: string
    ) => {
      if (responseType === "success") {
        setOpenModal(false);
        setAddedOrUpdatedDataType(dataType);
        setEditSummaryData({});
      }
    };

    if (selectedClientId) {
      if (values.summaryType !== transportSummaryEnum.Capacity) {
        const params = {
          name: values.name,
          type: values.summaryType,
          clientId: selectedClientId,
        };
        if (id) {
          const response = await UpdateSummaryData(params, id);
          handleSuccess(response?.data?.response_type, params.type);
        } else {
          const response = await AddSummaryData(params);
          handleSuccess(response?.data?.response_type, params.type);
        }
      } else {
        const params = {
          value: values.name,
          clientId: selectedClientId,
        };
        if (id) {
          const response = await UpdateCapacityData(params, id);
          handleSuccess(
            response?.data?.response_type,
            transportSummaryEnum.Capacity
          );
        } else {
          const response = await AddCapacity(params);
          handleSuccess(
            response?.data?.response_type,
            transportSummaryEnum.Capacity
          );
        }
      }
    }
    setLoader(false);
  };

  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };
  return (
    <div>
      <Modal
        width="max-w-[500px]"
        title={`${id ? "Edit" : "Add"} Summary`}
        closeModal={() => setOpenModal(false)}
        hideFooterButton={false}
        onClickHandler={handleSubmitRef}
        loaderButton={loader}
      >
        <Formik
          initialValues={summaryData}
          enableReinitialize={true}
          validationSchema={addSummaryValidationSchema}
          onSubmit={(values) => handleSubmit(values)}
          innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Card parentClass="mb-5 last:mb-0">
                <>
                  <SelectComponent
                    options={transportSummaryTypeList}
                    selectedValue={values.summaryType}
                    onChange={(option: Option | Option[]) => {
                      setFieldValue("summaryType", (option as Option).value);
                    }}
                    name="summaryType"
                    label="Summary Type"
                    className="bg-white"
                    isCompulsory={true}
                    isDisabled={id ? true : false}
                    parentClass="mb-8"
                  />
                  <TextField
                    name="name"
                    parentClass="col-span-2"
                    isCompulsory={true}
                    type={
                      values.summaryType === transportSummaryEnum.Capacity
                        ? "number"
                        : "text"
                    }
                    smallFiled={true}
                    min={0}
                    label={
                      values.summaryType === transportSummaryEnum.Capacity
                        ? "Value"
                        : "Name"
                    }
                    placeholder={""}
                  />
                </>
              </Card>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

export default AddSummary;
