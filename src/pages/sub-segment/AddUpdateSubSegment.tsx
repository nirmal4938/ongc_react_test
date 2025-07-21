import SelectComponent from "@/components/formComponents/customSelect/Select";
import TextField from "@/components/formComponents/textField/TextField";
import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { ISubSegmentData } from "@/interface/subSegment/subSegmentInterface";
import { useEffect, useRef, useState } from "react";
import {
  AddSubSegmentData,
  GetSubSegmentDataById,
  EditSubSegmentData,
} from "@/services/subSegmentService";
import { useDispatch, useSelector } from "react-redux";
import { SubSegmentValidationSchema } from "@/validations/subSegment/SubSegmentValidation";
import {
  activeSegmentSelector,
  segmentDataSelector,
  setActiveSegment,
} from "@/redux/slices/segmentSlice";
import { Option } from "@/interface/customSelect/customSelect";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import {
  activeClientSelector,
  clientDataSelector,
} from "@/redux/slices/clientSlice";
import ClientDropdown from "@/components/dropdown/ClientDropdown";

const defaultInitialValues: ISubSegmentData = {
  code: "",
  name: "",
  costCentre: "",
  fridayBonus: 0,
  saturdayBonus: 0,
  overtime01Bonus: 0,
  overtime02Bonus: 0,
  segmentId: null,
};

interface AddUpdateSubSegmentProps {
  id?: string | number;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAllData?: () => void;
}

const AddUpdateSubSegment = ({
  id,
  openModal,
  setOpenModal,
  fetchAllData,
}: AddUpdateSubSegmentProps) => {
  const activeSegment = useSelector(activeSegmentSelector);
  const activeClient = useSelector(activeClientSelector);
  const clientDetails = useSelector(clientDataSelector);
  const formikRef = useRef<FormikProps<FormikValues>>();
  const segmentDetails = useSelector(segmentDataSelector);
  const [subSegmentData, setSubSegmentData] =
    useState<ISubSegmentData>(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [segmentOptions, setSegmentOptions] = useState<Option[]>([]);
  const dispatch = useDispatch();
  const [clientOptions, setClientOptions] = useState<Option[]>([]);
  const [activeClientSubSegment] = useState<string | number>(activeClient);

  useEffect(() => {
    setSubSegmentData(defaultInitialValues);
  }, [activeClient]);

  useEffect(() => {
    setSubSegmentData({ ...subSegmentData, segmentId: Number(activeSegment) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (segmentDetails) {
      const resp: Option[] = segmentDetails
        ?.filter((e: { isActive: boolean }) => e.isActive)
        ?.map((data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        });
      resp && setSegmentOptions(resp);
    }
  }, [segmentDetails]);

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

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const subSegmentData = {
      code: values.code.trim(),
      name: values.name.trim(),
      costCentre: values?.costCentre?.trim(),
      fridayBonus: values?.fridayBonus,
      saturdayBonus: values?.saturdayBonus,
      overtime01Bonus: values?.overtime01Bonus,
      overtime02Bonus: values?.overtime02Bonus,
      segmentId: values.segmentId,
    };

    if (id) {
      const response = await EditSubSegmentData(subSegmentData, id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    } else {
      const response = await AddSubSegmentData(subSegmentData);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        fetchAllData?.();
      }
    }
    setLoader(false);
  };

  useEffect(() => {
    if (id) {
      fetchSegmentData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchSegmentData(id: string | number) {
    dispatch(showLoader());
    const response = await GetSubSegmentDataById(id);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      setSubSegmentData({
        id: resultData.id,
        segmentId: resultData.segmentId,
        code: resultData.code,
        name: resultData.name,
        costCentre: resultData.costCentre,
        fridayBonus: resultData.fridayBonus,
        saturdayBonus: resultData.saturdayBonus,
        overtime01Bonus: resultData.overtime01Bonus,
        overtime02Bonus: resultData.overtime02Bonus,
      });
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
          title={`${id ? "Edit" : "Add"} Sub Segments`}
          hideFooterButton={false}
          onClickHandler={handleSubmitRef}
          loaderButton={loader}
          closeModal={() => setOpenModal(false)}
        >
          <Formik
            initialValues={subSegmentData}
            validationSchema={SubSegmentValidationSchema()}
            enableReinitialize={true}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card title="Segment" parentClass="mb-5 last:mb-0">
                  <div className="grid grid-cols-2 gap-5">
                    {id ? (
                      <TextField
                        name="displayClient"
                        parentClass=""
                        type="text"
                        smallFiled={true}
                        label={"Client"}
                        disabled={true}
                        value={
                          clientOptions?.length > 0
                            ? clientOptions?.find(
                                (a) => a.value == activeClientSubSegment
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
                    <SelectComponent
                      name="segmentId"
                      options={segmentOptions}
                      selectedValue={values?.segmentId}
                      onChange={(option: Option | Option[]) => {
                        setFieldValue("segmentId", (option as Option).value);
                        dispatch(setActiveSegment((option as Option).value));
                      }}
                      placeholder="Select"
                      label="Select Segment"
                      isCompulsory
                      className="bg-white"
                    />
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
                    <TextField
                      name="costCentre"
                      parentClass=""
                      type="text"
                      smallFiled={true}
                      label={"Cost Centre"}
                      placeholder={"Enter Cost Centre"}
                    />
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
              </Form>
            )}
          </Formik>
        </Modal>
      )}
    </>
  );
};

export default AddUpdateSubSegment;
