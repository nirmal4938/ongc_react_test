import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  AddUpdateContractTemplateProps,
  IContractTemplateData,
} from "@/interface/contractTemplate/contractTemplate";
import {
  AddContractTemplateData,
  EditContractTemplateData,
  GetContractTemplateDataById,
} from "@/services/contractTemplateService";
import { ContractTemplateValidationSchema } from "@/validations/contractTemplate/ContractTemplateValidation";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch } from "react-redux";

const AddUpdateContractTemplate = ({
  id,
  clientId,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateContractTemplateProps) => {
  const defaultInitialValues: IContractTemplateData = {
    contractName: "",
    clientId: clientId,
  };
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [contractTemplateData, setContractTemplateData] =
    useState<IContractTemplateData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("contractName", values.contractName.trim());
    formData.append("clientId", values.clientId);

    if (id) {
      const response = await EditContractTemplateData(formData, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddContractTemplateData(formData);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  const fetchContractTemplateData = async (id: string) => {
    dispatch(showLoader());
    const response = await GetContractTemplateDataById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setContractTemplateData({
        contractName: resultData.contractName,
        clientId: resultData.clientId,
      });
    }
    dispatch(hideLoader());
  };

  useEffect(() => {
    if (id) {
      fetchContractTemplateData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
          title={`${id ? "Edit" : "Add"} Contract Template`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={contractTemplateData}
            enableReinitialize={true}
            validationSchema={ContractTemplateValidationSchema()}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
            onSubmit={OnSubmit}
          >
            {() => (
              <Form>
                <Card title="" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="contractName"
                      parentClass="col-span-2"
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Name"}
                      isCompulsory={true}
                      disabled={!!id}
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

export default AddUpdateContractTemplate;
