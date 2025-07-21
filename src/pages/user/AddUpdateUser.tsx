import Button from "@/components/formComponents/button/Button";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import SelectComponent from "@/components/formComponents/customSelect/Select";
import TextField from "@/components/formComponents/textField/TextField";
import {
  IFeaturesData,
  IPermissionData,
  IRoleData,
  IRolePermissionData,
  TransformedData,
} from "@/interface/rolePermission/RolePermissionInterface";
import { GetRoleData, GetRoleDataById } from "@/services/roleService";
import { ErrorMessage, Form, Formik, FormikValues } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { timezones } from "../../../src/json/timezone.json";
import { Option } from "@/interface/customSelect/customSelect";
import { UserValidationSchema } from "@/validations/user/UserValidation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GetAllFeature } from "@/services/featureService";
import {
  AddUserData,
  EditUserData,
  GetUserDataById,
} from "@/services/userService";
import { IUserData } from "@/interface/user/userInterface";
import { useDispatch, useSelector } from "react-redux";
import { activeClientSelector } from "@/redux/slices/clientSlice";
import {
  DefaultRoles,
  PermissionEnum,
  defaultPermissionList,
  getFeaturePermission,
} from "@/utils/commonConstants";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { DownTriangleIcon, IconEye, IconEyeSlash } from "@/components/svgIcons";
import CustomSelect from "@/components/formComponents/customSelect/CustomSelect";

const defaultInitialValues: {
  name: string;
  email: string;
  password?: string;
  roleId: number | string;
  role: string;
  timezone: string;
  permissions: number[];
  isMailNotification: boolean;
  extraPermission?: number[];
} = {
  name: "",
  email: "",
  password: "",
  roleId: "",
  role: "",
  timezone: "",
  permissions: [],
  extraPermission: [],
  isMailNotification: false,
};

const AddUpdateUser = () => {
  const timezoneList: Option[] = timezones.map((value) => ({
    label: value.timezone + " (" + value.utcOffset + ")",
    value: value.timezone,
  }));
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientId = useSelector(activeClientSelector);
  const [userData, setUserData] = useState(defaultInitialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedRolePermissionData, setSelectedRolePermissionData] = useState<
    { featureName: string; permissions: [] }[]
  >([]);
  const [featureData, setFeatureData] = useState<IFeaturesData[]>([]);
  const [permissionData, setPermissionData] = useState<TransformedData>({});
  const [viewPermissionData, setViewPermissionData] = useState<
    { remainPermission: number[]; viewPermissionId: number }[]
  >([]);
  const [isShowExtraPermission, setIsShowExtraPermission] = useState(false);
  const [roleList, setRoleList] = useState<Option[]>([]);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [defaultPermission, setDefaultPermission] = useState<
    {
      permission: number | undefined;
      defaultPermission: (number | undefined)[];
    }[]
  >();

  useEffect(() => {
    fetchAllRole();
    (async () => await fetchAllFeature())();
    if (id) {
      fetchUserDataById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchAllRole() {
    dispatch(showLoader());
    const query = `?type=all`;
    const response = await GetRoleData(query);
    const allowedRoles = [DefaultRoles.Employee, DefaultRoles.Client];
    if (response?.data?.responseData?.data) {
      const roleDataList = response?.data?.responseData?.data
        ?.map((role: IRoleData) => ({
          label: role.name,
          value: role.id,
        }))
        .filter((option: Option) =>
          !id
            ? !allowedRoles.some(
                (role) => role.toLowerCase() === option.label.toLowerCase()
              )
            : option.label
        );
      setRoleList(roleDataList);
    }
    dispatch(hideLoader());
  }

  async function fetchAllFeature() {
    dispatch(showLoader());
    const response = await GetAllFeature();

    if (response?.data?.responseData) {
      setFeatureData(response?.data?.responseData);
    }
    dispatch(hideLoader());
  }

  async function fetchRoleById(id: string) {
    dispatch(showLoader());
    const response = await GetRoleDataById(id);

    if (response?.data?.responseData) {
      setSelectedRolePermissionData(
        getFeaturePermission(
          response?.data?.responseData?.assignedPermissions ?? []
        )
      );
      const permissions =
        response?.data?.responseData?.assignedPermissions?.map(
          (role: IRolePermissionData) => role.permissionId
        );
      setRolePermissions([]);
      assignDefaulPermission(permissions);
      dispatch(hideLoader());
      return permissions;
    }
    dispatch(hideLoader());
  }

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    values = {
      name: values.name.trim(),
      email: values.email,
      roleId: values.roleId,
      ...(pathname.includes("edit")
        ? { password: values.password ? values.password : undefined }
        : {}),
      timezone: values.timezone,
      permissions: values.permissions.map((val: string) => parseInt(val)),
      isMailNotification: values.isMailNotification,
      ...(clientId ? { clientId: clientId } : {}),
    };
    if (id) {
      delete values.email;
      // const query = clientId ? `?clientId=${clientId}` : "";
      const query = "";
      const response = await EditUserData(values, id, query);
      if (response?.data?.response_type === "success") {
        navigate(`/admin/user/${id}`);
      }
    } else {
      const response = await AddUserData(values);
      if (response?.data?.response_type === "success") {
        navigate("/admin/user");
      }
    }
    setLoader(false);
  };

  const GetPermissionData = (name: string, permission: PermissionEnum) => {
    return (
      featureData?.find(
        (val: IFeaturesData) => val.name === name
      ) as IFeaturesData
    )?.permissions?.find((value) => value.permissionName === permission)?.id;
  };

  useEffect(() => {
    const data = defaultPermissionList?.map((value) => {
      return {
        permission: GetPermissionData(
          value.permission?.feature,
          value?.permission?.permission
        ),
        defaultPermission: value.defaultPermission
          ?.map((permission) => {
            return permission?.permission?.map((per) =>
              GetPermissionData(permission?.feature, per)
            );
          })
          ?.flat(),
      };
    });
    setDefaultPermission(data);

    const result: TransformedData = {};
    featureData?.map((value) => {
      if (value.type) {
        if (!result[value.type]) result[value.type] = [];
        result[value.type].push(value);
      }
    });
    setPermissionData(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featureData]);

  useEffect(() => {
    const featurePermissionJson: any[] = [];
    if (Object.keys(permissionData).length) {
      Object.keys(permissionData).forEach((feat) =>
        permissionData[feat]?.map((perm) => {
          const viewPermission = perm.permissions?.find(
            (p) => p.permissionName == "view"
          )?.id;
          let withoutViewPermission: any[] = [];
          if (viewPermission) {
            if (perm.permissions?.length && perm.permissions.length > 1) {
              withoutViewPermission = perm.permissions
                ?.filter((p) => p.id != viewPermission)
                ?.map((pid) => pid.id);
            }
          }
          featurePermissionJson.push({
            viewPermissionId: viewPermission,
            remainPermission: withoutViewPermission,
          });
        })
      );
      setViewPermissionData(featurePermissionJson);
    }
  }, [permissionData]);

  const removeDefaultPermission = (permission: number[], perm: number) => {
    const getRemovedPermission = viewPermissionData.find(
      (view) => view.viewPermissionId == perm
    );
    const dpermission = defaultPermission?.map((prm) => prm.permission);
    if (!getRemovedPermission) {
      const withoutView = viewPermissionData.find((view) =>
        view.remainPermission.includes(perm)
      );
      if (
        !withoutView?.remainPermission?.some((ids) =>
          permission.includes(ids)
        ) &&
        withoutView?.viewPermissionId
      ) {
        const defaultData = defaultPermission?.filter((per) =>
          per.defaultPermission.includes(withoutView?.viewPermissionId)
        );

        if (defaultData?.length) {
          const Remain = assignDefaulPermission(
            permission.filter((pr) => pr != withoutView?.viewPermissionId)
          );
          if (
            dpermission &&
            JSON.stringify(Remain.sort()) === JSON.stringify(dpermission.sort())
          ) {
            permission = permission.filter(
              (prm) =>
                !Remain.includes(prm) && prm != withoutView?.viewPermissionId
            );
          } else {
            const newPerm = permission.filter(
              (id) =>
                !dpermission?.includes(id) &&
                id != withoutView?.viewPermissionId
            );
            const defaultDatas = defaultPermission?.filter((per) =>
              per.defaultPermission?.some((ids) => ids && newPerm.includes(ids))
            );
            if (defaultDatas?.length == 0) {
              permission = permission.filter(
                (prm) =>
                  !dpermission?.includes(prm) &&
                  prm != withoutView?.viewPermissionId
              );
            } else {
              const defaultDatas = defaultPermission?.filter((per) =>
                per.defaultPermission?.some(
                  (ids) =>
                    ids &&
                    permission
                      .filter((id) => id == withoutView?.viewPermissionId)
                      .includes(ids)
                )
              );
              const newPer = permission
                .filter((pp) => pp != withoutView?.viewPermissionId)
                .filter((p1) => !dpermission?.includes(p1));
              const newDefaultData = defaultPermission?.filter((per) =>
                per.defaultPermission?.some(
                  (ids) => ids && newPer.includes(ids)
                )
              );
              const checkIsDafault =
                dpermission?.includes(withoutView?.viewPermissionId) &&
                permission.some((prsome) =>
                  dpermission
                    ?.filter((pt) => pt != withoutView?.viewPermissionId)
                    .includes(prsome)
                );
              if (
                (defaultDatas?.length == 0 && !checkIsDafault) ||
                (newDefaultData?.length && !checkIsDafault)
              )
                permission = permission.filter(
                  (prm) => prm != withoutView?.viewPermissionId
                );
            }
          }
        } else {
          const newPerm = permission.filter(
            (id) =>
              !dpermission?.includes(id) && id != withoutView?.viewPermissionId
          );
          const defaultDatas = defaultPermission?.filter((per) =>
            per.defaultPermission?.some((ids) => ids && newPerm.includes(ids))
          );
          if (defaultDatas?.length == 0) {
            permission = permission.filter(
              (prm) =>
                !dpermission?.includes(prm) &&
                prm != withoutView?.viewPermissionId
            );
          } else {
            const defaultDatas = defaultPermission?.filter((per) =>
              per.defaultPermission?.some(
                (ids) =>
                  ids &&
                  permission
                    .filter((id) => id == withoutView?.viewPermissionId)
                    .includes(ids)
              )
            );
            const checkIsDafault =
              dpermission?.includes(withoutView?.viewPermissionId) &&
              permission.some((prsome) =>
                dpermission
                  ?.filter((pt) => pt != withoutView?.viewPermissionId)
                  .includes(prsome)
              );
            if (defaultDatas?.length == 0 && !checkIsDafault)
              permission = permission.filter(
                (prm) => prm != withoutView?.viewPermissionId
              );
          }
        }
      }
    } else {
      const newPerm = permission.filter(
        (id) =>
          !dpermission?.includes(id) &&
          id != getRemovedPermission.viewPermissionId
      );
      const defaultDatas = defaultPermission?.filter((per) =>
        per.defaultPermission?.some((ids) => ids && newPerm.includes(ids))
      );
      if (defaultDatas?.length == 0) {
        permission = permission.filter(
          (prm) =>
            !dpermission?.includes(prm) &&
            prm != getRemovedPermission.viewPermissionId
        );
      } else {
        permission = permission.filter(
          (prm) => prm != getRemovedPermission.viewPermissionId
        );
      }
    }
    return permission;
  };

  async function fetchUserDataById(id: string) {
    // const query = clientId ? `?clientId=${clientId}` : "";
    const query = "";
    const response = await GetUserDataById(id, query);
    if (
      response?.data?.response_type === "success" &&
      response?.data?.responseData
    ) {
      dispatch(showLoader());
      const resultData: IUserData = response?.data?.responseData;
      setSelectedRolePermissionData(
        getFeaturePermission(
          resultData?.loginUserData?.assignedUserPermission ?? []
        )
      );

      if (resultData) {
        const permissionData =
          resultData?.loginUserData?.assignedUserPermission?.map(
            (value: { permissionId: number }) => value.permissionId
          );
        // setRolePermissions(permissionData);

        setUserData({
          name: resultData.loginUserData.name,
          email: resultData.loginUserData.email,
          roleId: resultData.roleId,
          role: resultData.roleData.name,
          timezone: resultData.loginUserData.timezone,
          permissions: permissionData,
          isMailNotification: resultData.loginUserData.isMailNotification,
        });
      }
      dispatch(hideLoader());
    }
  }

  // For Employee Role
  useEffect(() => {
    const allowedRoles = [DefaultRoles.Client];
    if (roleList.length) {
      setRoleList(
        roleList.filter((role) =>
          id && userData.role === DefaultRoles.Client
            ? role.label === DefaultRoles.Client
            : !allowedRoles.some(
                (roles) => roles.toLowerCase() === role.label.toLowerCase()
              )
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const assignDefaulPermission = (permissions: number[]) => {
    permissions?.map((perm) => {
      const defaultData = defaultPermission?.filter((per) =>
        per.defaultPermission.includes(perm)
      );
      if (defaultData?.length) {
        for (const perms of defaultData) {
          if (perms.permission && !permissions.includes(perms.permission)) {
            permissions.push(perms.permission);
            assignDefaulPermission(permissions);
          }
        }
      }
    });
    return permissions;
  };

  return (
    <>
      <Formik
        initialValues={userData}
        enableReinitialize={true}
        validationSchema={UserValidationSchema}
        onSubmit={OnSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <div className="bg-primaryRed/10 p-4 rounded-lg">
              <div className="grid grid-cols-4 gap-x-15px gap-y-5">
                <TextField
                  smallFiled
                  className="rounded-10"
                  placeholder="Name"
                  name="name"
                  type="text"
                  label={"Name"}
                  isCompulsory
                />
                <TextField
                  smallFiled
                  className="rounded-10"
                  placeholder="Email"
                  name="email"
                  type="text"
                  label={"Email"}
                  isCompulsory
                  disabled={id ? true : false}
                />
                <SelectComponent
                  name="roleId"
                  // parentClass="col-span-2"
                  placeholder="Select"
                  label="Role"
                  selectedValue={values.roleId?.toString()}
                  options={roleList}
                  onChange={async (option: Option | Option[]) => {
                    setFieldValue("roleId", Number((option as Option).value));
                    const result = await fetchRoleById(
                      (option as Option).value.toString()
                    );
                    setFieldValue("permissions", result);
                    setFieldValue("extraPermission", [
                      (option as Option).value,
                    ]);
                    setIsShowExtraPermission(false);
                  }}
                  isCompulsory
                  className="bg-white"
                />
                <CustomSelect
                  isUseFocus={false}
                  inputClass={""}
                  label="Extra Permissions"
                  isMulti={true}
                  name="extraPermission"
                  placeholder="Select"
                  options={roleList}
                  isCompulsory={false}
                  className="bg-white"
                  onChange={async (option) => {
                    const newLength = (option as Option[]).length;
                    const oldLength = values?.extraPermission?.length || 0;
                    let newPermission: number[] = [];
                    if (newLength == 0) {
                      setFieldValue("roleId", "");
                    }
                    if (newLength == 1 || values.roleId == "") {
                      setFieldValue(
                        "roleId",
                        (option as Option[])[(option as Option[]).length - 1]
                          ?.value
                      );
                    }
                    if (newLength > oldLength) {
                      if ((option as Option[]).length > 0) {
                        const result = await fetchRoleById(
                          (option as Option[])[
                            (option as Option[]).length - 1
                          ]?.value.toString()
                        );
                        newPermission =
                          values.permissions?.length > 0
                            ? [...values.permissions]
                            : [];
                        for (const dat of result) {
                          if (!newPermission.includes(dat)) {
                            newPermission.push(dat);
                          }
                        }
                        setFieldValue("permissions", newPermission);
                      }
                    } else {
                      for (const outerData of option as Option[]) {
                        const res = await fetchRoleById(
                          String(outerData?.value)
                        );
                        for (const dat of res) {
                          if (!newPermission.includes(dat)) {
                            newPermission.push(dat);
                          }
                        }
                      }
                      setFieldValue("permissions", newPermission);
                    }

                    setFieldValue(
                      "extraPermission",
                      (option as Option[]).map((item: Option) => item.value)
                    );
                  }}
                />
                <SelectComponent
                  name="timezone"
                  // parentClass="col-span-2"
                  placeholder="Select"
                  label="Time Zone"
                  selectedValue={values.timezone}
                  options={timezoneList.length ? timezoneList : []}
                  onChange={(option: Option | Option[]) => {
                    setFieldValue("timezone", (option as Option).value);
                  }}
                  isCompulsory
                  className="bg-white"
                />
                {pathname.includes("edit") && (
                  <TextField
                    smallFiled
                    className="rounded-10 relative"
                    placeholder="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    label={"Password"}
                    icon={
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-2/4 -translate-y-2/4 mt-3.5 rtl:left-4 rtl:right-auto cursor-pointer"
                      >
                        {showPassword ? (
                          <IconEye className="!w-5 !h-5" />
                        ) : (
                          // <IconEye className="!w-10 !h-10" />
                          <IconEyeSlash className="!w-5 !h-5" />
                        )}
                      </div>
                    }
                  />
                )}
                <CheckBox
                  id="isMailNotification"
                  checked={values.isMailNotification}
                  onChangeHandler={() => {
                    setFieldValue(
                      "isMailNotification",
                      !values.isMailNotification
                    );
                  }}
                  label="Send Email Notifications"
                  parentClass="mt-10"
                />
              </div>
            </div>

            {values.roleId && (
              <div className="flex flex-col gap-3 pt-5">
                <div className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between">
                  <h4 className="text-base/5 text-black font-semibold">
                    Role:{" "}
                    {
                      roleList?.find(
                        (role: Option) => role.value === values.roleId
                      )?.label
                    }
                  </h4>
                </div>
                <div className="py-15px px-5 bg-primaryRed/[0.03] rounded-md flex items-center">
                  <ul className="flex flex-wrap gap-3 max-w-[calc(100%_-_310px)]">
                    {selectedRolePermissionData
                      ?.filter((e) => {
                        return (
                          e?.featureName !== "Reliquat Calculation V2" &&
                          e?.featureName !== "Account"
                        );
                      })
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
            )}

            <div className="flex flex-col gap-3 pt-5">
              <div
                className="py-15px px-5 bg-primaryRed/10 rounded-md flex justify-between cursor-pointer"
                onClick={() => setIsShowExtraPermission(!isShowExtraPermission)}
              >
                <h4 className="text-base/5 text-black font-semibold">
                  Extra Permissions
                </h4>
                <span className="w-5 h-5 inline-block cursor-pointer hover:text-primaryRed active:scale-90 transition-all duration-300 select-none">
                  <DownTriangleIcon
                    className={`w-4 h-4 inline-block mr-2 ${
                      isShowExtraPermission || "-rotate-90"
                    } `}
                  />
                </span>
              </div>
            </div>

            <div className="py-1">
              <div className="table-wrapper overflow-auto  roles-table">
                {isShowExtraPermission && (
                  <>
                    <table width={"100%"} className="min-w-[800px]">
                      <tbody>
                        {Object.keys(permissionData).length ? (
                          Object.keys(permissionData).map(
                            (feature: string, pinx: number) => {
                              return (
                                <React.Fragment key={`feat_${feature}`}>
                                  <tr>
                                    <td className="empty" colSpan={6}></td>
                                  </tr>
                                  <tr>
                                    <th className="group/sort">
                                      <span className="flex items-center select-none">
                                        {feature}
                                      </span>
                                    </th>
                                    <th className="group/sort"></th>
                                  </tr>
                                  {permissionData[feature]
                                    ?.filter(
                                      (e) =>
                                        e?.name !== "Reliquat Calculation V2" &&
                                        e?.name !== "Account"
                                    )
                                    ?.map(
                                      (
                                        feature: IFeaturesData,
                                        finx: number
                                      ) => {
                                        const featurePermissionList: number[] =
                                          [];
                                        return (
                                          <tr key={feature.id}>
                                            <td className="w-56">
                                              {feature.name}
                                            </td>
                                            <td>
                                              <div className="grid grid-cols-6">
                                                {feature.permissions
                                                  ?.filter((e) => {
                                                    return (
                                                      (feature?.name !==
                                                        "Employee Contract" ||
                                                        e?.permissionName !==
                                                          "update") &&
                                                      (feature?.name !==
                                                        "Bonus Type" ||
                                                        e?.permissionName !==
                                                          "view")
                                                    );
                                                  })
                                                  ?.map(
                                                    (
                                                      permission: IPermissionData,
                                                      pindex: number
                                                    ) => {
                                                      featurePermissionList.push(
                                                        Number(permission.id)
                                                      );
                                                      return (
                                                        <CheckBox
                                                          key={`${permission.id}`}
                                                          parentClass="capitalize"
                                                          id={`ck${feature.id}${pindex}`}
                                                          checked={values.permissions.includes(
                                                            Number(
                                                              permission.id
                                                            )
                                                          )}
                                                          value={permission.id}
                                                          label={
                                                            permission.permissionName
                                                          }
                                                          onChangeHandler={(
                                                            e: ChangeEvent<HTMLInputElement>
                                                          ) => {
                                                            const viewPermissionId =
                                                              GetPermissionData(
                                                                feature.name,
                                                                PermissionEnum.View
                                                              );
                                                            if (
                                                              !values.permissions.includes(
                                                                Number(
                                                                  e.target.value
                                                                )
                                                              ) &&
                                                              !rolePermissions?.includes(
                                                                Number(
                                                                  e.target.value
                                                                )
                                                              )
                                                            ) {
                                                              values.permissions =
                                                                [
                                                                  ...values.permissions,
                                                                  Number(
                                                                    e.target
                                                                      .value
                                                                  ),
                                                                ];
                                                              if (
                                                                viewPermissionId &&
                                                                !values.permissions.includes(
                                                                  viewPermissionId
                                                                )
                                                              ) {
                                                                values.permissions =
                                                                  [
                                                                    ...values.permissions,
                                                                    viewPermissionId,
                                                                  ];
                                                              }
                                                              values.permissions =
                                                                assignDefaulPermission(
                                                                  values.permissions
                                                                );
                                                            } else if (
                                                              !rolePermissions?.includes(
                                                                Number(
                                                                  e.target.value
                                                                )
                                                              ) &&
                                                              (!(
                                                                viewPermissionId ===
                                                                  Number(
                                                                    e.target
                                                                      .value
                                                                  ) &&
                                                                values.permissions.some(
                                                                  (value) =>
                                                                    featurePermissionList.includes(
                                                                      value
                                                                    )
                                                                )
                                                              ) ||
                                                                values.permissions.filter(
                                                                  (values) =>
                                                                    featurePermissionList.includes(
                                                                      values
                                                                    )
                                                                ).length == 1)
                                                            ) {
                                                              const isRemovePermission =
                                                                defaultPermission?.find(
                                                                  (
                                                                    permission
                                                                  ) =>
                                                                    permission.permission ===
                                                                      Number(
                                                                        e.target
                                                                          .value
                                                                      ) &&
                                                                    values.permissions?.find(
                                                                      (perm) =>
                                                                        permission.defaultPermission.includes(
                                                                          perm
                                                                        )
                                                                    )
                                                                );
                                                              if (
                                                                !isRemovePermission
                                                              ) {
                                                                const index =
                                                                  values.permissions.indexOf(
                                                                    Number(
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  );
                                                                values.permissions.splice(
                                                                  index,
                                                                  1
                                                                );
                                                                values.permissions =
                                                                  removeDefaultPermission(
                                                                    values.permissions,
                                                                    Number(
                                                                      e.target
                                                                        .value
                                                                    )
                                                                  );
                                                              }
                                                            }
                                                            setFieldValue(
                                                              "permissions",
                                                              values.permissions
                                                            );
                                                          }}
                                                        />
                                                      );
                                                    }
                                                  )}
                                                {featurePermissionList.length >
                                                  1 && (
                                                  <CheckBox
                                                    label="All"
                                                    id={`all_${pinx}_${finx}`}
                                                    checked={featurePermissionList.every(
                                                      (value) =>
                                                        values.permissions.includes(
                                                          value
                                                        )
                                                    )}
                                                    onChangeHandler={() => {
                                                      if (
                                                        !featurePermissionList.every(
                                                          (value) =>
                                                            values.permissions.includes(
                                                              value
                                                            )
                                                        )
                                                      ) {
                                                        values.permissions =
                                                          values.permissions.concat(
                                                            featurePermissionList.filter(
                                                              (per) =>
                                                                !rolePermissions.includes(
                                                                  per
                                                                ) &&
                                                                !values.permissions.includes(
                                                                  per
                                                                )
                                                            )
                                                          );
                                                      } else {
                                                        values.permissions =
                                                          values.permissions.filter(
                                                            (value) =>
                                                              !featurePermissionList
                                                                .filter(
                                                                  (per) =>
                                                                    !rolePermissions.includes(
                                                                      per
                                                                    )
                                                                )
                                                                .includes(value)
                                                          );
                                                        for (const fpermission of featurePermissionList) {
                                                          values.permissions =
                                                            removeDefaultPermission(
                                                              values.permissions,
                                                              fpermission
                                                            );
                                                        }
                                                      }
                                                      // const viewPermissionId =
                                                      //   GetPermissionData(
                                                      //     feature.name,
                                                      //     PermissionEnum.View
                                                      //   );
                                                      // if (
                                                      //   viewPermissionId &&
                                                      //   values.permissions.some(
                                                      //     (value) =>
                                                      //       featurePermissionList.includes(
                                                      //         value
                                                      //       )
                                                      //   ) &&
                                                      //   !values.permissions.find(
                                                      //     (ids) =>
                                                      //       ids ==
                                                      //       viewPermissionId
                                                      //   )
                                                      // ) {
                                                      //   values.permissions = [
                                                      //     ...values.permissions,
                                                      //     viewPermissionId,
                                                      //   ];
                                                      // }
                                                      assignDefaulPermission(
                                                        values.permissions
                                                      );
                                                      setFieldValue(
                                                        "permissions",
                                                        [
                                                          ...new Set(
                                                            values.permissions
                                                          ),
                                                        ]
                                                      );
                                                    }}
                                                  />
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                </React.Fragment>
                              );
                            }
                          )
                        ) : (
                          <></>
                        )}
                      </tbody>
                    </table>
                    <ErrorMessage name={"permissions"}>
                      {(msg) => (
                        <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                          {msg}
                        </div>
                      )}
                    </ErrorMessage>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap 1400:flex-nowrap gap-x-2">
              <Button
                variant={"primary"}
                type="submit"
                parentClass="mt-10"
                loader={loader}
              >
                {pathname.includes("edit") ? "Save" : "Add"}
              </Button>
              <Button
                variant={"gray"}
                type="button"
                parentClass="mt-10"
                onClickHandler={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddUpdateUser;
