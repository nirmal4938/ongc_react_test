import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { IBonusTypeData } from "@/interface/bonusType/bonusTypeInterface";
import { BonusTypeValidationSchema } from "@/validations/bonusType/BonusTypeValidation";
import {
  AddBonusTypeData,
  EditBonusTypeData,
  GetBonusTypeDataById,
} from "@/services/bonusTypeService";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { useDispatch } from "react-redux";

interface AddUpdateBonusTypeProps {
  id?: string;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateBonusType = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateBonusTypeProps) => {
  const defaultInitialValues: IBonusTypeData = {
    code: "",
    name: "",
    basePrice: null,
    timesheetName: "",
    dailyCost: null
  };
  const dispatch = useDispatch();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const [bonusTypeData, setBonusTypeData] =
    useState<IBonusTypeData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (id) {
      delete values.clientId;
      const response = await EditBonusTypeData(values, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddBonusTypeData(values);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchBonusTypeData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchBonusTypeData(id: string) {
    dispatch(showLoader());
    try {
      const response = await GetBonusTypeDataById(id);

      if (response?.data?.responseData) {
        const resultData = response?.data?.responseData;
        setBonusTypeData({
          // clientId: resultData.clientId,
          code: resultData.code,
          name: resultData.name,
          timesheetName: resultData.timesheetName,
          basePrice: resultData.basePrice,
          dailyCost: resultData.dailyCost,
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
          title={`${id ? "Edit" : "Add"} Bonus Types`}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={bonusTypeData}
            enableReinitialize={true}
            validationSchema={BonusTypeValidationSchema()}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {() => (
              <Form>
                <Card title="Information" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    <TextField
                      name="name"
                      parentClass=" "
                      type="text"
                      smallFiled={true}
                      label={"Name"}
                      placeholder={"Enter Name"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="basePrice"
                      min={1}
                      parentClass=" "
                      type="number"
                      smallFiled={true}
                      label={"Base Price"}
                      placeholder={"Enter Base Price"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="dailyCost"
                      parentClass=" "
                      type="number"
                      smallFiled={true}
                      label={"Daily Cost"}
                      placeholder={"Enter Daily Cost"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="code"
                      parentClass=" "
                      type="text"
                      smallFiled={true}
                      label={"Code"}
                      placeholder={"Enter Code"}
                      isCompulsory={true}
                    />
                    <TextField
                      name="timesheetName"
                      parentClass=" "
                      type="text"
                      smallFiled={true}
                      label={"Timesheet Name (Shown on Timesheet)"}
                      placeholder={"Enter Timesheet Name (Shown on Timesheet)"}
                      isCompulsory={true}
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

export default AddUpdateBonusType;
