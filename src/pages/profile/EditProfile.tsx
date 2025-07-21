import Modal from "@/components/modal/Modal";
import Card from "@/components/card/Card";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { IEmployeeData } from "@/interface/employee/employeeInterface";
import TextField from "@/components/formComponents/textField/TextField";
import DateComponent from "@/components/formComponents/dateComponent/DateComponent";
import { EditEmployeeData } from "@/services/employeeService";
import { EmployeeUpdateValidationSchema } from "@/validations/employee/EmployeeValidation";
import { useEffect, useRef, useState } from "react";
import ProfilePictureUpload from "@/components/formComponents/fileInput/ProfilePictureUpload";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import { Option } from "@/interface/customSelect/customSelect";
import { GetRotationData } from "@/services/rotationService";
import PhoneNumberInput from "@/components/formComponents/phoneInput/PhoneNumberInput";
import { useNavigate } from "react-router-dom";
import { GetSegmentData } from "@/services/segmentService";
import { useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import { GetSubSegmentData } from "@/services/subSegmentService";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import { DefaultRoles } from "@/utils/commonConstants";
import { userSelector } from "@/redux/slices/userSlice";

interface EditProfileProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  profileDetails: IEmployeeData;
}

const EditProfile = ({
  openModal,
  setOpenModal,
  profileDetails,
}: EditProfileProps) => {
  const navigate = useNavigate();
  const formikRef = useRef<FormikProps<FormikValues>>();
  const user = useSelector(userSelector);
  const [profileData, setProfileData] = useState(profileDetails);
  const [segmentOptions, setSegmentOptions] = useState<Option[]>([]);
  const [subSegmentOptions, setSubSegmentOptions] = useState<Option[]>([]);
  const [rotationOptions, setRotationOptions] = useState<Option[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const clientId = useSelector(activeClientSelector);
  const [activeSegmentEmployee, setActiveSegmentEmployee] = useState<number>(0);
  const querySegment = `?` + `clientId=${clientId}`;
  const querySubSegment = `?` + `segmentId=${activeSegmentEmployee}`;

  useEffect(() => {
    if (activeSegmentEmployee !== 0) {
      fetchAllSubSegment(querySubSegment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSegmentEmployee]);

  useEffect(() => {
    setProfileData({
      ...profileDetails,
      firstName: profileDetails?.loginUserData?.firstName
        ? profileDetails?.loginUserData?.firstName
        : "",
      lastName: profileDetails?.loginUserData?.lastName
        ? profileDetails?.loginUserData?.lastName
        : "",
      profilePicture: profileDetails?.loginUserData?.profileImage
        ? "/profilePicture/" + profileDetails?.loginUserData?.profileImage
        : null,
      mobileNumber: profileDetails?.loginUserData?.phone,
      email: profileDetails?.loginUserData?.email,
      placeOfBirth: profileDetails?.loginUserData?.placeOfBirth,
      gender: profileDetails?.loginUserData?.gender
        ? profileDetails?.loginUserData?.gender
        : "",
    });
    setActiveSegmentEmployee(profileDetails?.segmentId ?? 0);
    fetchAllRotation();
    fetchAllSegment(querySegment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetails]);

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("TempNumber", values?.TempNumber);
    formData.append("employeeNumber", values?.employeeNumber);
    formData.append("startDate", values?.latestStartDate);
    formData.append("firstName", values?.firstName);
    formData.append("lastName", values?.lastName);
    formData.append("fonction", values?.fonction);
    formData.append("placeOfBirth", values?.placeOfBirth);
    formData.append("nSS", values?.nSS);
    formData.append("gender", values?.gender);
    formData.append("baseSalary", values?.baseSalary);
    formData.append("travelAllowance", values?.travelAllowance);
    formData.append("Housing", values?.Housing);
    formData.append("monthlySalary", values?.monthlySalary);
    formData.append("dailyCost", values?.dailyCost);
    formData.append("address", values?.address);
    formData.append("mobileNumber", String(values?.mobileNumber));
    formData.append("email", values?.email);
    formData.append("clientId", values?.clientId);
    formData.append("segmentId", values?.segmentId);
    formData.append("subSegmentId", values?.subSegmentId);
    formData.append("rotationId", values?.rotationId);
    formData.append("rollover", values?.rollover);
    formData.append("profilePicture", values?.profilePicture);
    // formData.append(
    //   "profilePicture",
    //   values?.profilePicture?.replace("/profilePicture/", "") ?? null
    // );
    formData.append("rotationDate", values?.rotationDate);
    formData.append("profileType", "profileType");
    formData.append("segmentDate", values?.segmentDate);
    formData.append("timezone", values?.timezone);
    formData.append("dOB", values?.dOB);

    if (profileDetails.id) {
      const response = await EditEmployeeData(formData, profileDetails.id);
      if (response?.data?.response_type === "success") {
        setOpenModal(false);
        navigate(
          `/employee/summary/profile/${response?.data?.responseData?.slug}`
        );
      }
    }
    setLoader(false);
  };

  const handleSubmitRef = () => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  async function fetchAllRotation() {
    const response = await GetRotationData();
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setRotationOptions(resp);
    }
  }

  async function fetchAllSegment(query: string) {
    setLoader(true);
    const response = await GetSegmentData(query);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setSegmentOptions(resp);
    }
    setLoader(false);
  }

  async function fetchAllSubSegment(query: string) {
    setLoader(true);
    const response = await GetSubSegmentData(query);
    if (response?.data?.responseData) {
      const result = response?.data?.responseData?.data;
      const resp: Option[] = result.map(
        (data: { name: string; id: number }) => {
          return { label: data?.name, value: data?.id };
        }
      );
      setSubSegmentOptions(resp);
    }
    setLoader(false);
  }

  return (
    <>
      {openModal && (
        <Modal
          title="Edit Profile"
          width="max-w-[564px]"
          closeModal={() => setOpenModal(false)}
          hideFooterButton={false}
          loaderButton={loader}
          onClickHandler={handleSubmitRef}
        >
          <Formik
            initialValues={profileData}
            enableReinitialize={true}
            validationSchema={EmployeeUpdateValidationSchema({
              segmentDate: profileData?.segmentDate ?? null,
              rotationDate: profileData?.rotationDate ?? null,
              startDate: profileData.latestStartDate ?? null,
            })}
            onSubmit={OnSubmit}
            innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <Card parentClass="mb-5 last:mb-0">
                  <>
                    <ProfilePictureUpload
                      setValue={setFieldValue}
                      name="profilePicture"
                      value={
                        values?.profilePicture ? values?.profilePicture : null
                      }
                      isImage={true}
                    />

                    <div className="grid grid-cols-2 gap-5">
                      <TextField
                        smallFiled
                        name="lastName"
                        value={values?.lastName}
                        type="text"
                        label={"Surname"}
                        parentClass="col-span-2"
                      />
                      <TextField
                        smallFiled
                        name="firstName"
                        type="text"
                        value={values?.firstName}
                        label={"Forename"}
                        parentClass="col-span-2"
                      />
                      <TextField
                        smallFiled
                        name="fonction"
                        type="text"
                        label={"Fonction"}
                        parentClass=""
                      />
                      <TextField
                        smallFiled
                        name="employeeNumber"
                        type="text"
                        label={"Matricule"}
                        parentClass=""
                        disabled={true}
                      />
                      <PhoneNumberInput
                        placeholder="Mobile Number"
                        parentClassName=""
                        required={false}
                        label={"Mobile Number"}
                        name="mobileNumber"
                      />
                      <TextField
                        smallFiled
                        name="email"
                        type="text"
                        value={values?.email}
                        label={"Email"}
                        parentClass=""
                      />

                      <SelectComponent
                        name="rotationId"
                        options={rotationOptions}
                        selectedValue={values?.rotationId}
                        onChange={(option: Option | Option[]) => {
                          setFieldValue("rotationId", (option as Option).value);
                        }}
                        placeholder="Select"
                        label="Select Rotation"
                        isCompulsory
                        className="bg-white"
                      />
                      <DateComponent
                        smallFiled
                        name="rotationDate"
                        parentClass=""
                        label={"Rotation Date"}
                        value={
                          values?.rotationDate
                            ? new Date(values?.rotationDate)
                            : null
                        }
                        placeholder={""}
                        onChange={(date) => {
                          setFieldValue("rotationDate", date);
                        }}
                        minDate={
                          profileData?.rotationDate
                            ? new Date(profileData?.rotationDate)
                            : values.latestStartDate
                            ? new Date(values.latestStartDate)
                            : null
                        }
                      />
                      <SelectComponent
                        name="segmentId"
                        options={segmentOptions}
                        selectedValue={values?.segmentId}
                        onChange={(option: Option | Option[]) => {
                          setFieldValue("segmentId", (option as Option).value);
                          setFieldValue("subSegmentId", null);
                          setActiveSegmentEmployee(+(option as Option).value);
                        }}
                        placeholder="Select"
                        label="Select Segment"
                        className="bg-white"
                      />

                      <SelectComponent
                        name="subSegmentId"
                        options={subSegmentOptions}
                        selectedValue={values?.subSegmentId}
                        onChange={(option: Option | Option[]) => {
                          setFieldValue(
                            "subSegmentId",
                            (option as Option).value
                          );
                        }}
                        placeholder="Select"
                        label="Select Sub Segment"
                        className="bg-white"
                      />
                      <DateComponent
                        smallFiled
                        name="segmentDate"
                        parentClass=""
                        label={"Segment Date"}
                        value={
                          values?.segmentDate
                            ? new Date(values?.segmentDate)
                            : null
                        }
                        placeholder={""}
                        onChange={(date) => {
                          setFieldValue("segmentDate", date);
                        }}
                        minDate={
                          profileData?.segmentDate
                            ? new Date(profileData?.segmentDate)
                            : values.latestStartDate
                            ? new Date(values.latestStartDate)
                            : null
                        }
                      />
                      <DateComponent
                        smallFiled
                        name="latestStartDate"
                        parentClass=""
                        label={"Start Date"}
                        value={
                          values.latestStartDate
                            ? new Date(values.latestStartDate)
                            : null
                        }
                        isDisabled={
                          user?.roleData?.name === DefaultRoles?.Admin &&
                          profileDetails?.employeeTimesheetStatus
                            ? false
                            : true
                        }
                        onChange={(date) => {
                          setFieldValue("latestStartDate", date);
                        }}
                      />

                      <CheckBox
                        id="rollover"
                        label="Segment Balance Rollover"
                        labelClass="Reset Balance for Segment change"
                        checked={values.rollover}
                        value={values.rollover}
                        onChangeHandler={() => {
                          setFieldValue("rollover", !values.rollover);
                        }}
                        parentClass="!text-black mr-4 1200:mr-5 1600:mr-10 !items-center col-span-2"
                      />
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

export default EditProfile;
