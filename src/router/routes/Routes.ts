/** @format */

import React from "react";
import { FeaturesNameEnum, PermissionEnum } from "@/utils/commonConstants";

const Home = React.lazy(() => import("../../pages/home/Home"));
const Login = React.lazy(() => import("../../pages/auth/Login"));
const ForgotPassword = React.lazy(
  () => import("../../pages/auth/ForgotPassword")
);
const ForgotOTPVerification = React.lazy(
  () => import("../../pages/auth/ForgotOTPVerification")
);
const ResetPassword = React.lazy(
  () => import("../../pages/auth/ResetPassword")
);

const RoleList = React.lazy(() => import("../../pages/role/RoleList"));

const AddUpdateRole = React.lazy(
  () => import("../../pages/role/AddUpdateRole")
);
const AddUpdateContractSummary = React.lazy(
  () => import("../../pages/contractSummary/AddUpdateContractSummary")
);
const UserList = React.lazy(() => import("../../pages/user/UserList"));
const UserDetail = React.lazy(() => import("../../pages/user/UserDetail"));
const AddUpdateUser = React.lazy(
  () => import("../../pages/user/AddUpdateUser")
);
const MessageList = React.lazy(() => import("../../pages/message/MessageList"));
const SalaryMessageList = React.lazy(
  () => import("../../pages/salaryMessage/SalaryMessageList")
);
const MessageDetail = React.lazy(() => import("../../pages/user/UserDetail"));
const EmployeeContractEndData = React.lazy(
  () => import("../../pages/employeeContractEnd/EmployeeContractEndList")
);
const ErrorLogsList = React.lazy(
  () => import("../../pages/errorLog/ErrorLogList")
);
// const EmployeeImport = React.lazy(
//   () => import("../../pages/employeeImport/AddUpdateEmployeeImport")
// );
const AddUpdateMessage = React.lazy(
  () => import("../../pages/message/AddUpdateMessage")
);
const AddUpdateSalaryMessage = React.lazy(
  () => import("../../pages/salaryMessage/AddUpdateSalaryMessage")
);
const Profile = React.lazy(() => import("../../pages/profile/Profile"));
const UserProfile = React.lazy(
  () => import("../../pages/userProfile/UserProfile")
);
const Timesheet = React.lazy(() => import("../../pages/timesheet/Timesheet"));
const ModalTest = React.lazy(() => import("../../pages/modal-test/ModalTest"));
const ClientList = React.lazy(() => import("../../pages/client/ClientList"));
const ContractTemplateList = React.lazy(
  () => import("../../pages/contractTemplate/ContractTemplateList")
);
const ContractTemplateVersionList = React.lazy(
  () =>
    import("../../pages/contractTemplateVersion/ContractTemplateVersionList")
);
const ContractSummaryList = React.lazy(
  () => import("../../pages/contractSummary/ContractSummaryList")
);
const SegmentList = React.lazy(() => import("../../pages/segment/SegmentList"));
const BonusTypeList = React.lazy(
  () => import("../../pages/bonusType/BonusTypeList")
);
const ContactList = React.lazy(() => import("../../pages/contact/ContactList"));
const SubSegmentList = React.lazy(
  () => import("../../pages/sub-segment/SubSegmentList")
);
const RequestTypeList = React.lazy(
  () => import("../../pages/requestType/RequestTypeList")
);
const MedicalTypeList = React.lazy(
  () => import("../../pages/medicalType/MedicalTypeList")
);
const RotationList = React.lazy(
  () => import("../../pages/rotation/RotationList")
);
const EmployeeSummary = React.lazy(
  () => import("../../pages/employee/EmployeeSummary")
);
const EmployeeForm = React.lazy(
  () => import("../../pages/employee/EmployeeForm")
);
const FolderList = React.lazy(() => import("../../pages/folder/FolderList"));
const TransportSummary = React.lazy(
  () => import("../../pages/transport/summary/TransportSummary")
);
const VehicleList = React.lazy(
  () => import("../../pages/transport/vehicles/VehicleList")
);
const MedicalRequestList = React.lazy(
  () => import("../../pages/medicalRequest/MedicalRequestList")
);
const MedicalExpiryList = React.lazy(
  () => import("../../pages/medicalExpiry/MedicalExpiryList")
);
const EmployeeLeaveList = React.lazy(
  () => import("../../pages/employeeLeave/EmployeeLeaveList")
);
const VehicleDetail = React.lazy(
  () => import("../../pages/transport/vehicles/VehicleDetail")
);
const DriverList = React.lazy(
  () => import("../../pages/transport/drivers/DriverList")
);
const RequestList = React.lazy(
  () => import("../../pages/transport/requests/RequestList")
);
const EditRequest = React.lazy(
  () => import("../../pages/transport/requests/EditRequest")
);
const DriverDetail = React.lazy(
  () => import("../../pages/transport/drivers/DriverDetail")
);
const RequestSummaryList = React.lazy(
  () => import("../../pages/request/RequestSummaryList")
);
const TimesheetUpdate = React.lazy(
  () => import("../../pages/timesheet/TimesheetUpdate")
);
const RequestDocumentDetail = React.lazy(
  () => import("../../pages/request/RequestDocumentDetails")
);
// const EmployeeImportLogList = React.lazy(
//   () => import("../../pages/employeeImport/EmployeeImportLogList")
// );
const EmployeeExport = React.lazy(
  () => import("../../pages/employeeExport/EmployeeListExport")
);
const EmployeeLeaveDetail = React.lazy(
  () => import("../../pages/employeeLeave/EmployeeLeaveDetail")
);
const ReliquatCalculationList = React.lazy(
  () => import("../../pages/reliquatCalculation/ReliquatCalculationList")
);
const ClientDetail = React.lazy(
  () => import("../../pages/client/ClientDetail")
);
const ViewContactDetail = React.lazy(
  () => import("../../pages/contact/ViewContactDetail")
);
const ViewSegmentDetail = React.lazy(
  () => import("../../pages/segment/ViewSegmentDetail")
);
const ViewSubSegmentDetail = React.lazy(
  () => import("../../pages/sub-segment/ViewSubSegmentDetail")
);
const ViewEmployeeExportDetail = React.lazy(
  () => import("../../pages/employeeExport/ViewEmployeeExportDetail")
);
const ReliquatAdjustmentList = React.lazy(
  () => import("../../pages/reliquatAdjustment/ReliquatAdjustmentList")
);
const ReliquatPaymentList = React.lazy(
  () => import("../../pages/reliquatPayment/ReliquatPaymentList")
);
// const ReliquatCalculationV2List = React.lazy(
//   () => import("../../pages/reliquatCalculationV2/ReliquatCalculationV2List")
// );
// const AccountSummaryList = React.lazy(
//   () => import("../../pages/account/AccountSummaryList")
// );
// const AccountModifySummary = React.lazy(
//   () => import("../../pages/account/AccountModifySummary")
// );

const ApproveDeletedFileList = React.lazy(
  () => import("../../pages/approveDeletedFile/ApproveDeletedFileList")
);
const AddUpdateContractTemplateVersion = React.lazy(
  () =>
    import(
      "../../pages/contractTemplateVersion/AddUpdateContractTemplateVersion"
    )
);
const AccountPOSummaryList = React.lazy(
  () => import("../../pages/account/pos/AccountPoSummaryList")
);
const AccountPODetailsList = React.lazy(
  () => import("../../pages/account/pos/AccountPoDetailsList")
);

const AddRequest = React.lazy(() => import("../../pages/request/AddRequest"));

export const AuthRoutes = [
  {
    path: "/login",
    name: "Login",
    element: Login,
  },
  {
    path: "/forgot-password",
    name: "Forgot Password",
    element: ForgotPassword,
  },
  {
    path: "/forgot-otp-verification",
    name: "Forgot OTP verification",
    element: ForgotOTPVerification,
  },
  {
    path: "/reset-password",
    name: "Reset Password",
    element: ResetPassword,
  },
  {
    path: "/add-request",
    name: "Request",
    element: AddRequest,
  },
];

const AllPermission = [
  PermissionEnum.Create,
  PermissionEnum.Update,
  PermissionEnum.Delete,
  PermissionEnum.View,
];
export const RoutesPath = [
  {
    path: "/",
    name: "Home",
    featureName: [FeaturesNameEnum.Dashboard],
    element: Home,
    breadCrumbName: "Dashboard",
  },
  {
    path: "/admin/role",
    name: "Role",
    featureName: [FeaturesNameEnum.Role],
    access: [...AllPermission],
    element: RoleList,
    breadCrumbName: "Admin/Role",
  },
  {
    path: "/admin/role/add",
    name: "Add Role",
    featureName: [FeaturesNameEnum.Role],
    access: [PermissionEnum.Create],
    element: AddUpdateRole,
    breadCrumbName: "Admin/Role/Add",
  },
  {
    path: "/admin/role/edit/:id",
    name: "Edit Role",
    featureName: [FeaturesNameEnum.Role],
    access: [PermissionEnum.Update],
    element: AddUpdateRole,
    breadCrumbName: "Admin/Role/Edit",
  },
  {
    path: "/contract/summary",
    featureName: [FeaturesNameEnum.EmployeeContract],
    access: [...AllPermission],
    element: ContractSummaryList,
    breadCrumbName: "Contract/Contract Summary",
  },
  {
    path: "/contract/summary/add",
    name: "Add Contract Summary",
    featureName: [FeaturesNameEnum.EmployeeContract],
    access: [PermissionEnum.Create],
    element: AddUpdateContractSummary,
    breadCrumbName: "Contract/Contract Summary/Add",
  },

  {
    path: "/contract/summary/edit/:id",
    name: "Edit Contract Summary",
    featureName: [FeaturesNameEnum.EmployeeContract],
    access: [PermissionEnum.Update],
    element: AddUpdateContractSummary,
    breadCrumbName: "Contract/Contract Summary/Edit",
  },
  {
    path: "/admin/approve-deleted-file",
    name: "Approve Deleted File",
    featureName: [FeaturesNameEnum.ApproveDeletedFile],
    access: [PermissionEnum.View],
    element: ApproveDeletedFileList,
    breadCrumbName: "Admin/Approve Deleted Files",
  },
  // {
  //   path: "/employee/import",
  //   name: "Import",
  //   featureName: [FeaturesNameEnum.ImportLog],
  //   access: [PermissionEnum.Create],
  //   element: EmployeeImport,
  //   breadCrumbName: "Employee/Import",
  // },
  // {
  //   path: "/employee/import-logs",
  //   featureName: [FeaturesNameEnum.ImportLog],
  //   access: [...AllPermission],
  //   element: EmployeeImportLogList,
  //   breadCrumbName: "Employee/Import Logs",
  // },
  {
    path: "/employee/export",
    featureName: [FeaturesNameEnum.Employee],
    access: [PermissionEnum.View],
    element: EmployeeExport,
    breadCrumbName: "Employee/Export",
  },
  {
    path: "/employee/export/view/:slug",
    featureName: [FeaturesNameEnum.Employee],
    access: [PermissionEnum.View],
    element: ViewEmployeeExportDetail,
    breadCrumbName: "Employee/Export/View",
  },
  {
    path: "/employee/reliquat-adjustment",
    featureName: [FeaturesNameEnum.ReliquatAdjustment],
    access: [PermissionEnum.View],
    element: ReliquatAdjustmentList,
    breadCrumbName: "Employee/Reliquat Adjustment",
  },
  {
    path: "/employee/reliquat-payment",
    featureName: [FeaturesNameEnum.ReliquatPayment],
    access: [...AllPermission],
    element: ReliquatPaymentList,
    breadCrumbName: "Employee/Reliquat Payment",
  },
  // {
  //   path: "/employee/reliquat-calculation-v2",
  //   featureName: [FeaturesNameEnum.ReliquatCalculationV2],
  //   access: [PermissionEnum.View],
  //   element: ReliquatCalculationV2List,
  //   breadCrumbName: "Employee/Reliquat Calculation V2",
  // },
  {
    path: "/admin/user",
    featureName: [FeaturesNameEnum.Users],
    access: [...AllPermission],
    element: UserList,
    breadCrumbName: "Admin/User",
  },
  {
    path: "/admin/user/add",
    featureName: [FeaturesNameEnum.Users],
    access: [PermissionEnum.Create],
    element: AddUpdateUser,
    breadCrumbName: "Admin/User/Add",
  },
  {
    path: "/admin/user/edit/:id",
    featureName: [FeaturesNameEnum.Users],
    access: [PermissionEnum.Update],
    element: AddUpdateUser,
    breadCrumbName: "Admin/User/Edit",
  },
  {
    path: "/admin/user/:id",
    featureName: [FeaturesNameEnum.Users],
    access: [PermissionEnum.View],
    element: UserDetail,
    breadCrumbName: "Admin/User/View",
  },
  {
    path: "/admin/salary-message",
    featureName: [FeaturesNameEnum.SalaryMessage],
    access: [...AllPermission],
    element: SalaryMessageList,
    breadCrumbName: "Admin/Salary-Message",
  },

  {
    path: "/admin/salary-message/draft",
    featureName: [FeaturesNameEnum.SalaryMessage],
    access: [...AllPermission],
    element: AddUpdateSalaryMessage,
    breadCrumbName: "Admin/Salary-Message/Draft",
  },

  {
    path: "/admin/message",
    featureName: [FeaturesNameEnum.Message],
    access: [...AllPermission],
    element: MessageList,
    breadCrumbName: "Admin/Messages",
  },
  {
    path: "/admin/message/add",
    featureName: [FeaturesNameEnum.Message],
    access: [PermissionEnum.Create],
    element: AddUpdateMessage,
    breadCrumbName: "Admin/Message/Add",
  },
  {
    path: "/admin/message/edit/:id",
    featureName: [FeaturesNameEnum.Message],
    access: [PermissionEnum.Update],
    element: AddUpdateMessage,
    breadCrumbName: "Admin/Message/Edit",
  },
  {
    path: "/admin/message/:id",
    featureName: [FeaturesNameEnum.Message],
    access: [PermissionEnum.View],
    element: MessageDetail,
    breadCrumbName: "Admin/Message/View",
  },
  {
    path: "/setup/clients",
    featureName: [FeaturesNameEnum.Client],
    access: [...AllPermission],
    element: ClientList,
    breadCrumbName: "Setup/Clients",
  },
  {
    path: "/setup/client/view/:slug",
    featureName: [FeaturesNameEnum.Client],
    access: [PermissionEnum.View],
    element: ClientDetail,
    breadCrumbName: "Setup/Client/View",
  },
  {
    path: "/contract-template",
    featureName: [FeaturesNameEnum.ContractTemplate],
    access: [...AllPermission],
    element: ContractTemplateList,
    breadCrumbName: "Contract/Contract Template",
  },
  {
    path: "/admin/error-logs",
    featureName: [FeaturesNameEnum.ErrorLogs],
    access: [PermissionEnum.View],
    element: ErrorLogsList,
    breadCrumbName: "Admin/Logs",
  },
  {
    path: "/contract-template-version",
    featureName: [FeaturesNameEnum.ContractTemplateVersion],
    access: [...AllPermission],
    element: ContractTemplateVersionList,
    breadCrumbName: "Contract/Contract Template Version",
  },
  {
    path: "/contract-template-version/add",
    featureName: [FeaturesNameEnum.ContractTemplateVersion],
    access: [...AllPermission],
    element: AddUpdateContractTemplateVersion,
    breadCrumbName: "Contract/Contract Template version/Add",
  },
  {
    path: "/contract-template-version/edit",
    featureName: [FeaturesNameEnum.ContractTemplateVersion],
    access: [...AllPermission],
    element: AddUpdateContractTemplateVersion,
    breadCrumbName: "Contract/Contract Template Version/Edit",
  },
  {
    path: "/setup/segments",
    featureName: [FeaturesNameEnum.Segment],
    access: [...AllPermission],
    element: SegmentList,
    breadCrumbName: "Setup/Segments",
  },
  {
    path: "/setup/segment/view/:slug",
    featureName: [FeaturesNameEnum.Segment],
    access: [PermissionEnum.View],
    element: ViewSegmentDetail,
    breadCrumbName: "Setup/Segment/View",
  },
  {
    path: "/setup/sub-segments",
    featureName: [FeaturesNameEnum.SubSegment],
    access: [...AllPermission],
    element: SubSegmentList,
    breadCrumbName: "Setup/Sub-Segments",
  },
  {
    path: "/setup/sub-segment/view/:slug",
    featureName: [FeaturesNameEnum.SubSegment],
    access: [PermissionEnum.View],
    element: ViewSubSegmentDetail,
    breadCrumbName: "Setup/Sub-Segment/View",
  },
  {
    path: "/setup/contacts",
    featureName: [FeaturesNameEnum.Contact],
    access: [...AllPermission],
    element: ContactList,
    breadCrumbName: "Setup/Contacts",
  },
  {
    path: "/setup/contact/view/:slug",
    featureName: [FeaturesNameEnum.Contact],
    access: [PermissionEnum.View],
    element: ViewContactDetail,
    breadCrumbName: "Setup/Contact/View",
  },
  {
    path: "/setup/bonus-type",
    featureName: [FeaturesNameEnum.BonusType],
    access: [...AllPermission],
    element: BonusTypeList,
    breadCrumbName: "Setup/Bonus Type",
  },
  {
    path: "/setup/rotations",
    featureName: [FeaturesNameEnum.Rotation],
    access: [...AllPermission],
    element: RotationList,
    breadCrumbName: "Setup/Rotations",
  },
  {
    path: "/setup/folders",
    featureName: [FeaturesNameEnum.Folder],
    access: [...AllPermission],
    element: FolderList,
    breadCrumbName: "Setup/Folders",
  },
  {
    path: "/setup/medical-type",
    featureName: [FeaturesNameEnum.MedicalType],
    access: [...AllPermission],
    element: MedicalTypeList,
    breadCrumbName: "Setup/Medical Types",
  },
  {
    path: "/setup/request-type",
    featureName: [FeaturesNameEnum.RequestType],
    access: [...AllPermission],
    element: RequestTypeList,
    breadCrumbName: "Setup/Request Types",
  },
  {
    path: "/employee/summary/profile/:slug",
    element: Profile,
    breadCrumbName: "Employee/Summary/Profile",
  },
  {
    path: "/profile/:slug",
    element: Profile,
    breadCrumbName: "Profile",
  },
  {
    path: "/admin/user-profile",
    element: UserProfile,
    breadCrumbName: "Admin/User/Profile",
  },
  {
    path: "/medical/summary",
    featureName: [FeaturesNameEnum.MedicalRequest],
    access: [...AllPermission],
    element: MedicalRequestList,
    breadCrumbName: "Medical/Summary",
  },
  {
    path: "/medical/expiry",
    featureName: [FeaturesNameEnum.MedicalRequest],
    access: [...AllPermission],
    element: MedicalExpiryList,
    breadCrumbName: "Medical/Expiry",
  },
  {
    path: "/requests",
    featureName: [FeaturesNameEnum.Request],
    access: [...AllPermission],
    element: RequestSummaryList,
    breadCrumbName: "Requests",
  },
  {
    path: "/requests/:id",
    featureName: [FeaturesNameEnum.Request],
    access: [PermissionEnum.View],
    element: RequestDocumentDetail,
    breadCrumbName: "Requests/View",
  },
  {
    path: "/timesheet/summary",
    featureName: [FeaturesNameEnum.Timesheet],
    access: [PermissionEnum.View],
    element: Timesheet,
    breadCrumbName: "Timesheet/Summary",
  },
  {
    path: "/timesheet/update",
    featureName: [FeaturesNameEnum.Timesheet],
    access: [PermissionEnum.Update],
    element: TimesheetUpdate,
    breadCrumbName: "Timesheet/Modify",
  },
  {
    path: "/employee/reliquat-calculation",
    featureName: [FeaturesNameEnum.ReliquatCalculation],
    access: [PermissionEnum.View],
    element: ReliquatCalculationList,
    breadCrumbName: "Employee/Reliquat Calculation",
  },
  {
    path: "/modal", // Demo Route
    element: ModalTest,
  },
  // {
  //   path: "/employee", // Demo Route
  //   element: Employee,
  // },
  {
    path: "/contract/contract-end",
    featureName: [FeaturesNameEnum.ContractEnd],
    access: [PermissionEnum.View],
    element: EmployeeContractEndData,
    breadCrumbName: "Contract/Contract End",
  },
  {
    path: "/employee/summary",
    name: "EmployeeSummary",
    featureName: [FeaturesNameEnum.Employee],
    access: [...AllPermission],
    element: EmployeeSummary,
    breadCrumbName: "Employee/Summary",
  },
  {
    path: "/employee/summary/add",
    featureName: [FeaturesNameEnum.Employee],
    access: [...AllPermission],
    element: EmployeeForm,
    breadCrumbName: "Employee/Summary/Add",
  },
  {
    path: "/employee/summary/update/:id",
    featureName: [FeaturesNameEnum.Employee],
    access: [...AllPermission],
    element: EmployeeForm,
    breadCrumbName: "Employee/Summary/Update",
  },
  {
    path: "/transport/summary",
    featureName: [FeaturesNameEnum.TransportSummary],
    access: [...AllPermission],
    element: TransportSummary,
    breadCrumbName: "Transport/Summary",
  },
  {
    path: "/transport/vehicles",
    featureName: [FeaturesNameEnum.TransportVehicle],
    access: [...AllPermission],
    element: VehicleList,
    breadCrumbName: "Transport/Vehicles",
  },
  {
    path: "/transport/vehicles/detail/:id",
    featureName: [FeaturesNameEnum.TransportVehicle],
    access: [PermissionEnum.View],
    element: VehicleDetail,
    breadCrumbName: "Transport/Vehicle/View",
  },
  {
    path: "/transport/drivers",
    featureName: [FeaturesNameEnum.TransportDriver],
    access: [...AllPermission],
    element: DriverList,
    breadCrumbName: "Transport/Drivers",
  },
  {
    path: "/transport/drivers/detail/:id",
    featureName: [FeaturesNameEnum.TransportDriver],
    access: [PermissionEnum.View],
    element: DriverDetail,
    breadCrumbName: "Transport/Driver/View",
  },

  {
    path: "/transport/requests",
    featureName: [FeaturesNameEnum.TransportRequest],
    access: [...AllPermission],
    element: RequestList,
    breadCrumbName: "Transport/Requests",
  },
  {
    path: "/transport/requests/edit/:id",
    featureName: [FeaturesNameEnum.TransportRequest],
    access: [PermissionEnum.View],
    element: EditRequest,
    breadCrumbName: "Transport/Requests/Edit",
  },
  {
    path: "/employee-leave",
    featureName: [FeaturesNameEnum.EmployeeLeave],
    access: [...AllPermission],
    element: EmployeeLeaveList,
    breadCrumbName: "Titre De Congé",
  },
  {
    path: "/employee-leave/detail/:id",
    featureName: [FeaturesNameEnum.EmployeeLeave],
    access: [PermissionEnum.View],
    element: EmployeeLeaveDetail,
    breadCrumbName: "Titre De Congé/Detail",
  },
  // {
  //   path: "/accounts/summary",
  //   featureName: [FeaturesNameEnum.Account],
  //   access: [PermissionEnum.View],
  //   element: AccountSummaryList,
  //   breadCrumbName: "Accounts/Summary",
  // },
  // {
  //   path: "/accounts/modify",
  //   featureName: [FeaturesNameEnum.Account],
  //   access: [PermissionEnum.View],
  //   element: AccountModifySummary,
  //   breadCrumbName: "Accounts/Modify",
  // },
  {
    path: "/accounts/PO",
    featureName: [FeaturesNameEnum.AccountPO],
    access: [PermissionEnum.View],
    element: AccountPOSummaryList,
    breadCrumbName: "Accounts/POs",
  },
  {
    path: "/accounts/PO/Details",
    featureName: [FeaturesNameEnum.AccountPO],
    access: [PermissionEnum.View],
    element: AccountPODetailsList,
    breadCrumbName: "Accounts/POs/Details",
  },
  {
    path: "/add-requests",
    name: "Request",
    access: [...AllPermission],
    element: AddRequest,
    breadCrumbName: "Request/Add",
  },
];
