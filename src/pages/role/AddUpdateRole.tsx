import Button from "@/components/formComponents/button/Button";
import CheckBox from "@/components/formComponents/checkbox/CheckBox";
import TextField from "@/components/formComponents/textField/TextField";
import {
  IFeaturesData,
  IPermissionData,
  TransformedData,
} from "@/interface/rolePermission/RolePermissionInterface";
import { hideLoader, showLoader } from "@/redux/slices/siteLoaderSlice";
import { GetAllFeature } from "@/services/featureService";
import {
  AddRoleData,
  EditRoleData,
  GetRoleDataById,
} from "@/services/roleService";
import {
  DefaultRoles,
  PermissionEnum,
  defaultPermissionList,
} from "@/utils/commonConstants";
import { RolePermissionValidationSchema } from "@/validations/rolePermission/RolePermissionValidation";
import { ErrorMessage, Form, Formik, FormikValues } from "formik";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface IRoleFormData {
  name: string;
  permissions: number[];
}
const defaultInitialValues: IRoleFormData = {
  name: "",
  permissions: [],
};

const AddUpdateRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [loader, setLoader] = useState<boolean>(false);
  const [featureData, setFeatureData] = useState<IFeaturesData[]>([]);
  const [permissionData, setPermissionData] = useState<TransformedData>({});
  const [viewPermissionData, setViewPermissionData] = useState<
    { remainPermission: number[]; viewPermissionId: number }[]
  >([]);
  const [defaultPermission, setDefaultPermission] = useState<
    {
      permission: number | undefined;
      defaultPermission: (number | undefined)[];
    }[]
  >();
  const [roleData, setRoleData] = useState<IRoleFormData>(defaultInitialValues);
  useEffect(() => {
    fetchAllFeature();
    if (id) {
      fetchRoleData(id);
    } else {
      setRoleData({
        name: "",
        permissions: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchAllFeature() {
    dispatch(showLoader());
    const response = await GetAllFeature();

    if (response?.data?.responseData) {
      setFeatureData(response?.data?.responseData);
    }
    dispatch(hideLoader());
  }

  async function fetchRoleData(id: string) {
    dispatch(showLoader());
    const response = await GetRoleDataById(id);
    if (response?.data?.responseData) {
      const resultData = response?.data?.responseData;
      if (Object.values(DefaultRoles).includes(resultData?.name)) {
        toast.error("Something Went Wrong. Please Try Again");
        navigate("/admin/role");
      }
      setRoleData({
        name: resultData.name,
        permissions: resultData.assignedPermissions
          ? resultData.assignedPermissions?.map(
              (value: { permissionId: number }) => value.permissionId
            )
          : [],
      });
    }
    dispatch(hideLoader());
  }

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

  const OnSubmit = async (values: FormikValues) => {
    setLoader(true);
    values = {
      name: values.name.trim(),
      assignPermissions: values.permissions.map((val: string) => parseInt(val)),
    };
    if (id) {
      const response = await EditRoleData(values, id);
      if (response?.data?.response_type === "success") navigate("/admin/role");
    } else {
      const response = await AddRoleData(values);
      if (response?.data?.response_type === "success") navigate("/admin/role");
    }
    setLoader(false);
  };

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
      <div className="input-list-wrapper mt-10 text-left">
        <Formik
          initialValues={roleData}
          enableReinitialize={true}
          validationSchema={RolePermissionValidationSchema()}
          onSubmit={OnSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="input-item mb-30px">
                <TextField
                  type={"text"}
                  label="Role Name"
                  name="name"
                  parentClass={"mb-6"}
                  isCompulsory={true}
                  placeholder="Role Name"
                  disabled={!!id}
                />
              </div>
              <div className="input-item">
                <label className="block mb-10px text-sm/18px text-left font-semibold">
                  Role Permission
                </label>
                <div className="table-wrapper overflow-auto roles-table">
                  <table width={"100%"} className="min-w-[800px]">
                    <tbody>
                      {Object.keys(permissionData).length ? (
                        Object.keys(permissionData).map(
                          (feature: string, pinx: number) => {
                            return (
                              <React.Fragment key={`feat_${feature}`}>
                                <>
                                  <tr>
                                    <td className="empty" colSpan={6}></td>
                                  </tr>
                                  <tr>
                                    <th className="group/sort">
                                      <span className="flex items-center select-none">
                                        {feature}
                                      </span>
                                    </th>
                                    <th className="group/sort">
                                      <span className="flex items-center select-none">
                                        Permission
                                      </span>
                                    </th>
                                  </tr>
                                  {permissionData[feature]
                                    ?.filter(
                                      (e) =>
                                        e.name !== "Reliquat Calculation V2" &&
                                        e.name !== "Account"
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
                                                              )
                                                            ) {
                                                              values.permissions.push(
                                                                Number(
                                                                  e.target.value
                                                                )
                                                              );
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
                                                              !(
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
                                                              ).length == 1
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
                                                          values.permissions.filter(
                                                            (value) =>
                                                              !featurePermissionList.includes(
                                                                value
                                                              )
                                                          );
                                                        values.permissions =
                                                          values.permissions.concat(
                                                            featurePermissionList
                                                          );
                                                      } else {
                                                        values.permissions =
                                                          values.permissions.filter(
                                                            (value) =>
                                                              !featurePermissionList.includes(
                                                                value
                                                              )
                                                          );
                                                        for (const fpermission of featurePermissionList) {
                                                          values.permissions =
                                                            removeDefaultPermission(
                                                              values.permissions,
                                                              fpermission
                                                            );
                                                        }
                                                      }
                                                      setFieldValue(
                                                        "permissions",
                                                        values.permissions
                                                      );
                                                      assignDefaulPermission(
                                                        values.permissions
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
                                </>
                              </React.Fragment>
                            );
                          }
                        )
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </table>
                </div>
                <ErrorMessage name={"permissions"}>
                  {(msg) => (
                    <div className="fm_error text-red text-sm pt-[4px] font-BinerkaDemo">
                      {msg}
                    </div>
                  )}
                </ErrorMessage>
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
                  onClickHandler={() => navigate("/admin/role")}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddUpdateRole;
