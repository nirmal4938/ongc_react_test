import Button from "@/components/formComponents/button/Button";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";
import Modal from "@/components/modal/Modal";
import {
  CrossRoundIcon,
  DeleteIcon,
  DeleteIcon2,
  EditIocn,
  KeyIcon,
  LockBorderIocn,
  PlusBorderIcon,
  SingleUserBorderIocn,
} from "@/components/svgIcons";
import { usePermission } from "@/context/PermissionProvider";
import { Option } from "@/interface/customSelect/customSelect";
import { ISegmentData } from "@/interface/segment/segmentInterface";
import { ISubSegmentData } from "@/interface/subSegment/subSegmentInterface";
import {
  IUserClientData,
  IUserData,
  IUserSegmentData,
} from "@/interface/user/userInterface";
import {
  clientDataSelector,
  // userActiveClientSelector,
  setClientData,
  setActiveClient,
} from "@/redux/slices/clientSlice";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { setToken, setUser, userSelector } from "@/redux/slices/userSlice";
import { GetClientData } from "@/services/clientService";
import { GetSlugByUserId } from "@/services/employeeService";
import { GetSegmentListByClients } from "@/services/segmentService";
import {
  ChangeUserStatus,
  DeleteUser,
  DeleteUserClient,
  DeleteUserSegment,
  GetUserDataById,
  GetUserRolePermission,
  LoginAsUser,
  SendUserResetLink,
  UpdateUserData,
  UpdateUserSegmentData,
} from "@/services/userService";
import {
  DefaultRoles,
  FeaturesNameEnum,
  PermissionEnum,
  getFeaturePermission,
} from "@/utils/commonConstants";
import { Form, Formik, FormikProps, FormikValues } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
const defaultInitialValues = {
  isSelectAll: false,
  client: [],
  segment: [],
  segmentApproval: [],
};
const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getPermissions } = usePermission();
  const user = useSelector(userSelector);
  // const clientId = useSelector(userActiveClientSelector);
  const [loader, setLoader] = useState<boolean>(false);
  const [OpenModal, setOpenModal] = useState(false);
  const [OpenModal2, setOpenModal2] = useState(false);
  const [OpenModal3, setOpenModal3] = useState(false);
  const [confirmationType, setConfirmationType] = useState("user");
  const [confirmationId, setConfirmationId] = useState(0);
  const [open, setOpen] = useState(false); // For Delete Confirmation
  const [openStatusModal, setOpenStatusModal] = useState(false); // For Change Status
  const [openLoginModal, setOpenLoginModal] = useState(false); // For Login Modal
  const formikRef = useRef<FormikProps<FormikValues>>();
  const formikRef1 = useRef<FormikProps<FormikValues>>();
  const formikRef2 = useRef<FormikProps<FormikValues>>();
  const [userData, setUserData] = useState<IUserData>();
  const clientDetails = useSelector(clientDataSelector);
  const [clientList, setClientList] = useState<Option[]>();
  const [segmentDropdown, setSegmentDropdown] = useState<Option[]>([]);
  const [dropdownData, setDropdownData] = useState(defaultInitialValues);
  const [segmentType, setSegmentType] = useState<string>("SEGMENT");
  const [openResetModal, setOpenResetModal] = useState(false);
  const [resetLoader, setResetLoader] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    id && fetchUserDataById(id);
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
      resp && setClientList(resp);
    }
  }, [clientDetails]);

  useEffect(() => {
    if (userData) {
      const clientIds = userData.userClientList?.map(
        (value: IUserClientData) => {
          return value.clientId;
        }
      );
      clientIds && getSegmentList(clientIds?.toString());
    }
  }, [userData]);

  async function getSegmentList(clientId: string) {
    const response = await GetSegmentListByClients("?clientIds=" + clientId);

    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      const segmentList: Option[] = [];
      resultData?.map((value: ISegmentData) => {
        if (value.subSegmentList?.length) {
          value.subSegmentList?.map((val: ISubSegmentData) => {
            segmentList.push({
              label: `${value?.client?.loginUserData?.name} - ${value?.name} - ${val.name}`,
              value: `${value.id}-${val.id}`,
            });
          });
        } else {
          segmentList.push({
            label: `${value?.client?.loginUserData?.name} - ${value?.name}`,
            value: `${value.id}`,
          });
        }
      });
      setSegmentDropdown(segmentList);
    }
  }

  async function fetchUserDataById(id: string) {
    dispatch(showLoader());
    try {
      // const query = clientId ? `?clientId=${clientId}` : "";
      const query = "";
      const response = await GetUserDataById(id, query);

      if (response?.data?.responseData) {
        const resultData = response?.data?.responseData;
        setUserData({
          ...resultData,
          featurePermissions: getFeaturePermission(
            resultData?.loginUserData?.assignedUserPermission
          ),
        });
        setDropdownData({
          ...dropdownData,
          client: resultData?.userClientList?.map((value: IUserClientData) => {
            return value?.clientId.toString();
          }),
          segment: resultData?.userSegmentList?.map(
            (value: IUserSegmentData) => {
              return `${value?.segmentData?.id}${
                value?.subSegmentData ? "-" + value?.subSegmentData?.id : ""
              }`;
            }
          ),
          segmentApproval: resultData?.userSegmentApprovalList?.map(
            (value: IUserSegmentData) => {
              return `${value?.segmentData?.id}${
                value?.subSegmentData ? "-" + value?.subSegmentData?.id : ""
              }`;
            }
          ),
        });
      }
    } catch (error) {
      console.log("error", error);
    }
    dispatch(hideLoader());
  }

  async function loginAsUser(id: number) {
    const response = await LoginAsUser(
      { userId: id },
      ""
      // clientId ? `?clientId=${clientId}` : ""
    );
    const { response_type, responseData } = response.data;
    if (response_type === "success") {
      if (responseData) {
        const userId =
          responseData?.user?.clientId && responseData?.user?.clientId !== null
            ? "clientId=" + responseData?.user?.clientId + "&"
            : "clientId=&";
        const loginUserId = responseData?.user?.loginUserId
          ? "userId=" + responseData?.user?.loginUserId
          : "userId=";
        const queryString = "?" + userId + loginUserId;
        dispatch(setToken(responseData?.access_token));
        const allFeatures = await fetchRolePermissionData(queryString ?? "");
        dispatch(setUser(responseData.user));
        const response = await GetClientData("");
        let result = null;
        if (response?.data?.responseData) {
          result = response?.data?.responseData;
          dispatch(setClientData(result.data));
          dispatch(setActiveClient(result.data[0]?.id ?? 0));
        }
        if (
          responseData?.user?.roleData?.name === DefaultRoles.Employee &&
          result
        ) {
          let slug = await GetSlugByUserId(Number(result?.data[0]?.id));
          slug = slug?.data?.responseData?.slug;
          if (slug !== undefined) {
            navigate(`/profile/${slug}`);
          }
        } else if (
          !(
            allFeatures[FeaturesNameEnum.Dashboard]?.find(
              (item: string) => item == PermissionEnum.View
            ) ?? false
          )
        ) {
          navigate("/admin/user-profile");
        } else if (
          allFeatures[FeaturesNameEnum.Dashboard]?.find(
            (item: string) => item == PermissionEnum.View
          ) ??
          false
        ) {
          navigate("/");
        }
      }
    }
  }

  const fetchRolePermissionData = async (query: string) => {
    const response = await GetUserRolePermission(query);
    return response.data.responseData;
  };

  const handleSubmitRef = (val: number) => {
    if (val === 0 && formikRef.current) {
      formikRef.current.submitForm();
    }
    if (val === 1 && formikRef1.current) {
      formikRef1.current.submitForm();
    }
    if (val === 2 && formikRef2.current) {
      formikRef2.current.submitForm();
    }
  };

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    if (id) {
      const response = await UpdateUserData({ client: values.client }, id);
      if (response?.data?.response_type === "success") {
        await fetchUserDataById(id);
        setOpenModal(false);
      }
    }
    setLoader(false);
  };

  const OnSubmitSegment = async (values: FormikValues) => {
    setLoader(true);
    if (id) {
      // const query = clientId ? `?clientId=${clientId}` : "";
      const query = "";
      const response = await UpdateUserSegmentData(
        {
          type: segmentType,
          segment: values.segment,
          segmentApproval: values.segmentApproval,
        },
        id,
        query
      );
      if (response?.data?.response_type === "success") {
        await fetchUserDataById(id);
        setOpenModal2(false);
        setOpenModal3(false);
      }
    }
    setLoader(false);
  };

  const handleOpenModal = (type: string) => {
    setConfirmationType(type);
    setOpen(true);
  };

  const userDelete = async (id: string) => {
    // const query = clientId ? `?clientId=${clientId}` : "";
    const query = "";
    const response = await DeleteUser(Number(id), query);
    if (response?.data?.response_type === "success") {
      navigate("/admin/user");
    }
    setOpen(false);
  };

  const changeUserStatus = async (id: string) => {
    // const query = clientId ? `?clientId=${clientId}` : "";
    const query = "";
    const response = await ChangeUserStatus(id, query);
    if (response?.data?.response_type === "success") {
      fetchUserDataById(id);
    }
    setOpenStatusModal(false);
  };

  const deleteClientSegment = async (ids: number) => {
    setLoader(true);
    let response = null;
    if (confirmationType === "client") {
      response = await DeleteUserClient(
        ids,
        ""
        // clientId ? `?clientId=${clientId}` : ""
      );
    } else if (["segment", "segment approval"].includes(confirmationType)) {
      response = await DeleteUserSegment(ids, `?type=${segmentType}`);
    }
    if (response?.data?.response_type === "success") {
      id && fetchUserDataById(id);
    }
    setOpen(false);
    setLoader(false);
  };

  // For resetting the password
  const handleOpenResetModal = (email: string) => {
    if (email) {
      setUserEmail(email);
      setOpenResetModal(true);
    }
  };

  const handleUserResetLink = async (email: string) => {
    setResetLoader(true);
    if (email) {
      const params = { email: email };
      const response = await SendUserResetLink(params);
      if (response?.data?.response_type === "success") {
        setOpenResetModal(false);
        setUserEmail("");
      }
    }
    setResetLoader(false);
  };

  const closeModalHandler = () => {
    if (openStatusModal) {
      setOpenStatusModal(!openStatusModal);
    } else if (openLoginModal) {
      setOpenLoginModal(!openLoginModal);
    } else {
      setOpen(!open);
    }
  };

  const iconComponent =
    openStatusModal || openLoginModal ? (
      <LockBorderIocn className="w-full h-full mx-auto" />
    ) : (
      <DeleteIcon className="w-full h-full mx-auto" />
    );

  const onClickHandler = () => {
    if (openStatusModal) {
      id && changeUserStatus(id);
    } else if (openLoginModal) {
      loginAsUser(Number(userData?.id));
    } else {
      if (confirmationType === "user") {
        id && userDelete(id);
      } else if (
        ["client", "segment", "segment approval"].includes(confirmationType)
      ) {
        confirmationId && deleteClientSegment(confirmationId);
      }
      return;
    }
  };

  const getConfirmationType = () => {
    let confirmationText: string;

    if (openStatusModal) {
      confirmationText = `Are you sure you want to ${
        userData?.status == "ACTIVE" ? "Lock" : "Unlock"
      } that user?`;
    } else if (openLoginModal) {
      confirmationText = `Are you sure you want to login with this user?`;
    } else {
      confirmationText = `Are you sure you want to delete this ${confirmationType}?`;
    }
    return confirmationText;
  };

  const getTitle = () => {
    let title: string;
    if (openStatusModal) {
      title = `Status`;
    } else if (openLoginModal) {
      title = `Login`;
    } else {
      title = `Delete`;
    }
    return title;
  };

  return (
    <>
      <div className="">
        {OpenModal && (
          <Modal
            title="Clients"
            width="max-w-[537px]"
            closeModal={() => setOpenModal(!OpenModal)}
            onClickHandler={() => handleSubmitRef(0)}
            loaderButton={loader}
          >
            <Formik
              initialValues={dropdownData}
              enableReinitialize={true}
              innerRef={formikRef as React.Ref<FormikProps<FormikValues>>}
              onSubmit={OnSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="p-6 bg-primaryRed/5 rounded-10">
                    <CustomSelect
                      inputClass={"bg-white"}
                      className={"bg-white"}
                      name="client"
                      isMulti={true}
                      placeholder="Select Clients"
                      options={clientList ?? []}
                      isCompulsory={true}
                      isUseFocus={true}
                    />
                    <CheckBox
                      name={"isSelectAll"}
                      id="isSelectAll"
                      label="Select All Client"
                      parentClass="mt-3"
                      checked={values.client.length === clientList?.length}
                      onChangeHandler={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFieldValue("isSelectAll", e.target.checked);
                        clientList &&
                          setFieldValue(
                            "client",
                            e.target.checked
                              ? [...clientList.map((e) => e.value)]
                              : []
                          );
                      }}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
        {OpenModal2 && (
          <Modal
            title="Segments"
            width="max-w-[650px]"
            closeModal={() => setOpenModal2(!OpenModal2)}
            onClickHandler={() => handleSubmitRef(1)}
            loaderButton={loader}
            modalBoxClass="p-4"
            isVisible={true}
          >
            <Formik
              initialValues={dropdownData}
              enableReinitialize={true}
              innerRef={formikRef1 as React.Ref<FormikProps<FormikValues>>}
              onSubmit={OnSubmitSegment}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="p-6 bg-primaryRed/5 rounded-10">
                    <CustomSelect
                      inputClass={"bg-white"}
                      className={"bg-white segment-popup"}
                      name="segment"
                      isMulti={true}
                      placeholder="Select Segments"
                      options={segmentDropdown ?? []}
                      isCompulsory={true}
                      isUseFocus={true}
                    />
                    {segmentDropdown?.length > 0 && (
                      <CheckBox
                        name={"isSelectAll"}
                        id="isSelectAll"
                        label="Select All Segments"
                        parentClass="mt-3"
                        checked={
                          values.segment.length === segmentDropdown?.length
                        }
                        onChangeHandler={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setFieldValue("isSelectAll", e.target.checked);
                          clientList &&
                            setFieldValue(
                              "segment",
                              e.target.checked
                                ? [...segmentDropdown.map((e) => e.value)]
                                : []
                            );
                        }}
                      />
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
        {OpenModal3 && (
          <Modal
            title="Segments (Approval)"
            width="max-w-[537px]"
            closeModal={() => setOpenModal3(!OpenModal3)}
            onClickHandler={() => handleSubmitRef(2)}
            loaderButton={loader}
          >
            <Formik
              initialValues={dropdownData}
              enableReinitialize={true}
              innerRef={formikRef2 as React.Ref<FormikProps<FormikValues>>}
              onSubmit={OnSubmitSegment}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="p-6 bg-primaryRed/5 rounded-10">
                    <CustomSelect
                      inputClass={"bg-white"}
                      className={"bg-white"}
                      name="segmentApproval"
                      isMulti={true}
                      placeholder="Select Segment Approval"
                      options={segmentDropdown ?? []}
                      isCompulsory={true}
                      isUseFocus={true}
                    />
                    {segmentDropdown?.length > 0 && (
                      <CheckBox
                        name={"isSelectAll"}
                        id="isSelectAll"
                        label="Select All Segments Approval"
                        parentClass="mt-3"
                        checked={
                          values.segmentApproval.length ===
                          segmentDropdown?.length
                        }
                        onChangeHandler={(
                          e: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setFieldValue("isSelectAll", e.target.checked);
                          clientList &&
                            setFieldValue(
                              "segmentApproval",
                              e.target.checked
                                ? [...segmentDropdown.map((e) => e.value)]
                                : []
                            );
                        }}
                      />
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Modal>
        )}
      </div>
      <div className="icon-wrapper mb-4 flex justify-between">
        <Link to={"/admin/user"}>
          <Button variant={"primaryBorder"}>Back</Button>
        </Link>
        <div className="flex justify-end gap-4">
          {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Delete) && (
            <span
              className="w-30px h-30px group relative p-0.5 inline-block cursor-pointer text-black/50 hover:bg-primaryRed/20 hover:text-primaryRed rounded-md active:scale-90 transition-all duration-300 select-none"
              title="Delete User"
              onClick={() => {
                handleOpenModal("user");
              }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Delete User
              </span>
              <DeleteIcon2 className="w-full h-full select-none" />
            </span>
          )}
          {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) && (
            <span
              className="w-30px h-30px p-0.5 group relative inline-block cursor-pointer text-black/50 hover:bg-primaryRed/20 hover:text-primaryRed rounded-md active:scale-90 transition-all duration-300 select-none"
              title={`${userData?.status == "ACTIVE" ? "Lock" : "Unlock"} User`}
              onClick={() => {
                setOpenStatusModal(true);
              }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                {userData?.status == "ACTIVE" ? "Lock" : "Unlock"} User
              </span>
              <LockBorderIocn className="w-full h-full select-none" />
            </span>
          )}
          {!user?.clientId && (
            <span
              className="w-30px h-30px group relative p-0.5 inline-block cursor-pointer text-black/50 hover:bg-primaryRed/20 hover:text-primaryRed rounded-md active:scale-90 transition-all duration-300 select-none"
              onClick={() => setOpenLoginModal(true)}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Login As
              </span>
              <SingleUserBorderIocn className="w-full h-full select-none" />
            </span>
          )}
          {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) && (
            <span
              className="w-30px h-30px p-0.5 group relative inline-block cursor-pointer text-black/50 hover:bg-primaryRed/20 hover:text-primaryRed rounded-md active:scale-90 transition-all duration-300 select-none"
              title="Send Reset Password"
              onClick={() => {
                userData?.loginUserData?.email &&
                  handleOpenResetModal(userData?.loginUserData?.email);
              }}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Send Reset Password
              </span>
              <KeyIcon className="w-full h-full select-none" />
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-30px">
        <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
          <h4 className="text-base/5 text-black font-semibold">User Details</h4>
          {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) && (
            <span
              className="w-5 h-5 group relative inline-block cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none"
              onClick={() => navigate(`/admin/user/edit/${userData?.id}`)}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Edit
              </span>
              <EditIocn className="w-full h-full select-none" />
            </span>
          )}
        </div>

        <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
          <ul className="flex flex-wrap">
            <li className="w-1/3">
              <p className="flex text-sm/18px text-black">
                <strong>Email:&nbsp;</strong>
                <span className="font-medium opacity-50">
                  {userData?.loginUserData?.email}
                </span>
              </p>
            </li>
            <li className="w-1/3">
              <p className="flex text-sm/18px text-black">
                <strong>Name:&nbsp;</strong>
                <span className="font-medium opacity-50">
                  {userData?.loginUserData?.name}
                </span>
              </p>
            </li>
            <li className="w-1/3">
              <p className="flex text-sm/18px text-black">
                <strong>Role:&nbsp;</strong>
                <span className="font-medium opacity-50">
                  {userData?.roleData?.name}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-30px">
        <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
          <h4 className="text-base/5 text-black font-semibold">
            Role: {userData?.roleData?.name}
          </h4>
          {getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) && (
            <span
              className="w-5 h-5 group relative inline-block cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none"
              onClick={() => navigate(`/admin/user/edit/${userData?.id}`)}
            >
              <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                Edit
              </span>
              <EditIocn className="w-full h-full select-none" />
            </span>
          )}
        </div>

        <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md flex items-center">
          <ul className="flex flex-wrap gap-3 max-w-[calc(100%_-_310px)]">
            {userData?.featurePermissions
              ?.filter(
                (e) =>
                  e?.featureName !== "Reliquat Calculation V2" &&
                  e?.featureName !== "Account"
              )
              ?.map((per) => {
                let permission: string;
                if (per?.featureName === "Employee Contract") {
                  permission = per?.permissions
                    ?.filter((e) => e !== "update")
                    .toString()
                    .replaceAll(",", ", ");
                } else if (per?.featureName === "Bonus Type") {
                  permission = per?.permissions
                    ?.filter((e) => e !== "view")
                    .toString()
                    .replaceAll(",", ", ");
                } else {
                  permission = per?.permissions
                    .toString()
                    .replaceAll(",", ", ");
                }
                if (permission) {
                  return (
                    <li
                      className="flex items-center text-tomatoRed bg-tomatoRed/10 px-6px py-2 rounded gap-6px  select-none"
                      key={`permission_${per.featureName}`}
                    >
                      <span className="font-medium text-sm/4 capitalize">
                        <strong>{per?.featureName}:&nbsp;</strong>
                        {permission}
                      </span>
                    </li>
                  );
                }
              })}
          </ul>
        </div>
      </div>

      {userData?.roleData?.name !== DefaultRoles.Employee && (
        <>
          {userData?.roleData?.name !== DefaultRoles.Client && (
            <div className="flex flex-col gap-3 mb-30px last:mb-0">
              <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                <h4 className="text-base/5 text-black font-semibold">
                  Clients
                </h4>
                {(getPermissions(
                  FeaturesNameEnum.Users,
                  PermissionEnum.Update
                ) ||
                  getPermissions(
                    FeaturesNameEnum.Users,
                    PermissionEnum.Create
                  )) && (
                  <span
                    className="w-5 h-5 group relative inline-block cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none"
                    onClick={() => setOpenModal(!OpenModal)}
                  >
                    <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                      Add
                    </span>
                    <PlusBorderIcon className="w-full h-full opacity-50 select-none" />
                  </span>
                )}
              </div>

              {userData?.userClientList?.length ? (
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                  <ul className="flex flex-wrap gap-3">
                    {userData?.userClientList?.map((value: IUserClientData) => (
                      <li
                        className="flex items-center text-tomatoRed bg-tomatoRed/10 px-6px py-2 rounded gap-6px  select-none"
                        key={`user_client_${value.id}`}
                      >
                        <span className="font-medium text-sm/4">
                          {value?.clientData?.loginUserData?.name}
                        </span>
                        {(getPermissions(
                          FeaturesNameEnum.Users,
                          PermissionEnum.Update
                        ) ||
                          getPermissions(
                            FeaturesNameEnum.Users,
                            PermissionEnum.Delete
                          )) && (
                          <span
                            className="group relative"
                            onClick={() => {
                              handleOpenModal("client");
                              setConfirmationId(value.id);
                            }}
                          >
                            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                              Cancel
                            </span>
                            <CrossRoundIcon className="w-3 h-3 cursor-pointer select-none" />
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 mb-30px last:mb-0">
            <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
              <h4 className="text-base/5 text-black font-semibold">Segments</h4>

              {(getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) ||
                getPermissions(
                  FeaturesNameEnum.Users,
                  PermissionEnum.Create
                )) && (
                <span
                  className="w-5 h-5 group relative inline-block cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none"
                  onClick={() => {
                    setOpenModal2(!OpenModal2);
                    setSegmentType("SEGMENT");
                  }}
                >
                  <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                    Add
                  </span>
                  <PlusBorderIcon className="w-full h-full opacity-50 select-none" />
                </span>
              )}
            </div>
            {userData?.userSegmentList?.length ? (
              <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                <ul className="flex flex-wrap gap-3">
                  {userData?.userSegmentList
                    // ?.filter(
                    //   (e: IUserSegmentData) =>
                    //     e?.segmentData?.isActive &&
                    //     (e?.subSegmentData?.id
                    //       ? e?.subSegmentData?.isActive
                    //       : "")
                    // )
                    ?.map((value: IUserSegmentData) => (
                      <li
                        className="flex items-center text-tomatoRed bg-tomatoRed/10 px-6px py-2 rounded gap-6px  select-none"
                        key={`user_segment_${value.id}`}
                      >
                        <span className="font-medium text-sm/4">
                          {`${value?.segmentData?.name}${
                            value?.subSegmentData
                              ? " - " + value?.subSegmentData?.name
                              : ""
                          }`}
                        </span>
                        {(getPermissions(
                          FeaturesNameEnum.Users,
                          PermissionEnum.Update
                        ) ||
                          getPermissions(
                            FeaturesNameEnum.Users,
                            PermissionEnum.Delete
                          )) && (
                          <span
                            className="group relative"
                            onClick={() => {
                              handleOpenModal("segment");
                              setSegmentType("SEGMENT");
                              setConfirmationId(value.id);
                            }}
                          >
                            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                              Cancel
                            </span>
                            <CrossRoundIcon className="w-3 h-3 cursor-pointer select-none" />
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>

          {/* <div className="flex flex-col gap-3 mb-30px last:mb-0">
            <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
              <h4 className="text-base/5 text-black font-semibold">
                Segments Approval
              </h4>

              {(getPermissions(FeaturesNameEnum.Users, PermissionEnum.Update) ||
                getPermissions(
                  FeaturesNameEnum.Users,
                  PermissionEnum.Create
                )) && (
                <span
                  className="w-5 h-5 inline-block group relative cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none"
                  onClick={() => {
                    setOpenModal3(!OpenModal3);
                    setSegmentType("SEGMENTAPPROVAL");
                  }}
                >
                  <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                    Add
                  </span>
                  <PlusBorderIcon className="w-full h-full opacity-50 select-none" />
                </span>
              )}
            </div>
            {userData?.userSegmentApprovalList?.length ? (
              <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md">
                <ul className="flex flex-wrap gap-3">
                  {userData?.userSegmentApprovalList?.map(
                    (value: IUserSegmentData) => (
                      <li
                        className="flex items-center text-tomatoRed bg-tomatoRed/10 px-6px py-2 rounded gap-6px  select-none"
                        key={`user_segment_apprival_${value.id}`}
                      >
                        <span className="font-medium text-sm/4">
                          {`${value?.segmentData?.name}${
                            value?.subSegmentData
                              ? " - " + value?.subSegmentData?.name
                              : ""
                          }`}
                        </span>
                        {(getPermissions(
                          FeaturesNameEnum.Users,
                          PermissionEnum.Update
                        ) ||
                          getPermissions(
                            FeaturesNameEnum.Users,
                            PermissionEnum.Delete
                          )) && (
                          <span
                            className="group relative"
                            onClick={() => {
                              handleOpenModal("segment approval");
                              setSegmentType("SEGMENTAPPROVAL");
                              setConfirmationId(value.id);
                            }}
                          >
                            <span className="inline-block transition-all duration-300 pointer-events-none group-hover:opacity-100 opacity-0 group-hover:right-full absolute w-auto max-w-[200px] bg-primaryRed text-white z-2 px-2 py-px text-sm font-normal font-sans rounded right-[calc(100%_+_10px)] before:absolute before:content-[''] before:border-l-8 before:border-y-8 before:border-y-transparent before:border-r-0 before:border-solid before:border-l-primaryRed before:top-1/2 before:-translate-y-1/2 before:left-[calc(100%_-_4px)]">
                              Cancel
                            </span>
                            <CrossRoundIcon className="w-3 h-3 cursor-pointer select-none" />
                          </span>
                        )}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ) : (
              ""
            )}
          </div> */}
        </>
      )}
      {(open || openStatusModal || openLoginModal) && (
        <Modal
          variant={"Confirmation"}
          closeModal={closeModalHandler}
          width="max-w-[475px]"
          icon={iconComponent}
          loaderButton={loader}
          okbtnText="Yes"
          cancelbtnText="No"
          onClickHandler={onClickHandler}
          confirmationText={getConfirmationType()}
          title={getTitle()}
        >
          <div className=""></div>
        </Modal>
      )}
      {openResetModal && (
        <Modal
          variant={"Confirmation"}
          closeModal={() => setOpenResetModal(!openResetModal)}
          width="max-w-[475px]"
          icon={<KeyIcon className="w-full h-full mx-auto" />}
          okbtnText="Yes"
          cancelbtnText="No"
          loaderButton={resetLoader}
          onClickHandler={() => handleUserResetLink(userEmail)}
          confirmationText="Are you sure you want to generate the reset password link?"
          title="Reset Link"
        >
          <div className=""></div>
        </Modal>
      )}
    </>
  );
};

export default UserDetail;
