import Card from "@/components/card/Card";
import { Form, Formik, FormikValues } from "formik";
import Button from "@/components/formComponents/button/Button";
import { useEffect, useState } from "react";
import { IContractTemplateVersionData } from "@/interface/contractTemplateVersion/contractTemplateVersion";
import {
  AddContractTemplateVersionData,
  EditContractTemplateVersionData,
  GetContractTemplateVersionDataById,
  GetContractTemplateVersionLastItem,
} from "@/services/contractTemplateVersionService";
import ReactQuillComponent from "@/components/formComponents/reactQuillComponent/ReactQuillComponent";
import { ContractTemplateVersionValidationSchema } from "@/validations/contractTemplate/ContractTemplateValidation";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@/components/formComponents/textField/TextField";
import { activeClientSelector } from "@/redux/slices/clientSlice";

const AddUpdateContractTemplateVersion = () => {
  const location = useLocation();
  const contractTemplateVersionId = new URLSearchParams(location.search).get(
    "contract-template-version-id"
  );
  const id = new URLSearchParams(location.search).get("id");
  const navigate = useNavigate();
  const activeClient = useSelector(activeClientSelector);
  const queryString = `?contractTemplateId=${contractTemplateVersionId}&clientId=${activeClient}`;
  const defaultInitialValues: IContractTemplateVersionData = {
    versionName: "",
    description: "",
    contractTemplateId: Number(contractTemplateVersionId),
    isActive: true,
  };
  const [contractTemplateVersionData, setContractTemplateVersionData] =
    useState<IContractTemplateVersionData>(defaultInitialValues);
  const dispatch = useDispatch();
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("versionName", values.versionName);
    formData.append("description", values.description);
    formData.append("contractTemplateId", values.contractTemplateId);
    formData.append("isActive", values.isActive);
    formData.append("clientId", activeClient?.toString());

    if (id) {
      const response = await EditContractTemplateVersionData(formData, id);
      if (response?.data?.response_type === "success") {
        navigate("/contract-template-version", {
          state: {
            contractTemplateId:
              response?.data?.responseData?.contractTemplateId,
          },
        });
      }
    } else {
      const response = await AddContractTemplateVersionData(formData);
      if (response?.data?.response_type === "success") {
        navigate("/contract-template-version", {
          state: {
            contractTemplateId:
              response?.data?.responseData?.contractTemplateId,
          },
        });
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchContractTemplateVersionLastData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClient]);
  useEffect(() => {
    if (id) {
      fetchContractTemplateVersionData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchContractTemplateVersionLastData = async () => {
    const response = await GetContractTemplateVersionLastItem(queryString);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setContractTemplateVersionData({
        ...contractTemplateVersionData,
        description: resultData[0]?.description
          ? resultData[0]?.description
          : "",
      });
    }
  };

  const fetchContractTemplateVersionData = async (id: string) => {
    dispatch(showLoader());
    const response = await GetContractTemplateVersionDataById(id);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setContractTemplateVersionData({
        versionName: resultData.versionName,
        description: resultData.description,
        contractTemplateId: resultData.contractTemplateId,
        isActive: resultData.isActive,
      });
    }
    dispatch(hideLoader());
  };

  return (
    <>
      <Formik
        initialValues={contractTemplateVersionData}
        enableReinitialize={true}
        validationSchema={ContractTemplateVersionValidationSchema()}
        onSubmit={OnSubmit}
      >
        {({ values, errors, setFieldValue, setFieldTouched, handleSubmit }) => (
          <Form>
            <Card title="" parentClass=" last:mb-0">
              <div className="">
                <p className="text-left font-semibold  text-sm mt-5">
                  <span className="inline-block mt-1 mb-4 text-left text-black">
                    {
                      "Note:- Enter the version details for the template [firstName] [middleName] [lastName] [address] [birthdate] [bonus] [monthlySalary]"
                    }
                  </span>
                </p>

                <TextField
                  name="versionName"
                  parentClass="col-span-2"
                  type="text"
                  smallFiled={true}
                  label={"Version Name"}
                  placeholder={"Version Name"}
                  isCompulsory={true}
                />

                <ReactQuillComponent
                  label={"Description"}
                  key={contractTemplateVersionData?.description}
                  value={
                    contractTemplateVersionData?.description
                      ? contractTemplateVersionData?.description
                      : ""
                  }
                  parentClass="mt-5"
                  setFieldValue={setFieldValue}
                  name="description"
                  setFieldTouched={setFieldTouched}
                />
              </div>
            </Card>

            <div className={`flex gap-4 justify-end p-1`}>
              <Button
                type="button"
                variant={"gray"}
                onClickHandler={() =>
                  navigate("/contract-template-version", {
                    state: {
                      contractTemplateId: contractTemplateVersionId,
                    },
                  })
                }
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant={"primaryBorder"}
                loader={
                  Object.keys(errors).length === 0 &&
                  (values as object as { isActive: boolean })?.isActive &&
                  loader
                }
              >
                Save And Approve
              </Button>

              <Button
                type="button"
                variant={"primary"}
                onClickHandler={() => {
                  setFieldValue("isActive", false);
                  handleSubmit();
                }}
                loader={
                  Object.keys(errors).length === 0 &&
                  !(values as object as { isActive: boolean })?.isActive &&
                  loader
                }
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddUpdateContractTemplateVersion;
