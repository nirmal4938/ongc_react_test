import { IRolePermissionData } from "@/interface/rolePermission/RolePermissionInterface";
import { GetEmployeeFilePathData } from "@/services/employeeFileService";

export const FileLinkReg = new RegExp(`https?:\\/\\/.*\\.(?:docs|docx|pdf)`);

export const DOCUMENT_SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

export enum DefaultState {
  Employee = "Employee",
  Client = "Client",
  Segment = "Segment",
  SubSegment = "SubSegment",
  BonusType = "BonusType",
  Rotation = "Rotation",
  Folder = "Folder",
  Message = "Message",
  SalaryMessage = "Salary Message",
  MedicalType = "MedicalType",
  RequestType = "RequestType",
  Role = "Role",
  User = "User",
  ErrorLog = "ErrorLog",
  Contact = "Contact",
  ReliquatAdjustment = "ReliquatAdjustment",
  ReliquatPayment = "ReliquatPayment",
  EmployeeExport = "EmployeeExport",
  EmployeeImportLog = "EmployeeImportLog",
  EmployeeLeave = "EmployeeLeave",
  MedicalRequest = "MedicalRequest",
  MedicalExpiry = "MedicalExpiry",
  RequestSummary = "RequestSummary",
  ContractSummary = "ContractSummary",
  ContractTemplate = "ContractTemplate",
  ContractTemplateVersion = "ContractTemplateVersion",
  ContractEnd = "ContractEnd",
  TransportVehicle = "TransportVehicle",
  TransportDriver = "TransportDriver",
  TransportRequest = "TransportRequest",
  Timesheet = "Timesheet",
  TimesheetModify = "TimesheetModify",
}

export enum FeaturesNameEnum {
  Role = "Role",
  Users = "Users",
  Account = "Account",
  AccountPO = "AccountPO",
  BonusType = "Bonus Type",
  Client = "Client",
  Contact = "Contact",
  Folder = "Folder",
  Segment = "Segment",
  SubSegment = "Sub Segment",
  MedicalType = "Medical Type",
  RequestType = "Request Type",
  Rotation = "Rotation",
  SalaryMessage = "Salary Message",
  // TransportModel = "Transport Model",
  // TransportCapacity = "Transport Capacity",
  TransportSummary = "Transport Summary",
  TransportVehicle = "Transport Vehicle",
  TransportVehicleDocument = "Transport Vehicle Document",
  TransportDriver = "Transport Driver",
  TransportDriverDocument = "Transport Driver Document",
  TransportRequest = "Transport Request",
  TransportRequestVehicle = "Transport Request Vehicle",
  ContractTemplate = "Contract Template",
  ContractTemplateVersion = "Contract Template Version",
  Employee = "Employee",
  Salary = "Salary",
  DailyRate = "Daily Rate",
  EmployeeContract = "Employee Contract",
  MedicalRequest = "Medical Request",
  EmployeeFile = "Employee File",
  EmployeeLeave = "Employee Leave",
  Timesheet = "Timesheet",
  Request = "Request",
  ErrorLogs = "Error Logs",
  Message = "Message",
  ImportLog = "Import Log",
  Dashboard = "Dashboard",
  ReliquatAdjustment = "Reliquat Adjustment",
  ReliquatPayment = "Reliquat Payment",
  ReliquatCalculation = "Reliquat Calculation",
  ReliquatCalculationV2 = "Reliquat Calculation V2",
  ApproveDeletedFile = "Approve Deleted File",
  TimesheetSummary = "Timesheet Summary",
  ContractEnd = "Contract End",
}

export enum PermissionEnum {
  Update = "update",
  Delete = "delete",
  Create = "create",
  View = "view",
  Approve = "approve",
}

export enum DefaultRoles {
  Admin = "super admin",
  Employee = "Employee",
  Client = "Client",
}

export const defaultPermissionList = [
  // {
  //   permission: {
  //     feature: FeaturesNameEnum.Employee,
  //     permission: PermissionEnum.View,
  //   },
  //   defaultPermission: [
  //     {
  //       feature: FeaturesNameEnum.EmployeeLeave,
  //       permission: [PermissionEnum.Create],
  //     },
  //     {
  //       feature: FeaturesNameEnum.MedicalRequest,
  //       permission: [PermissionEnum.Create, PermissionEnum.Update],
  //     },
  //     {
  //       feature: FeaturesNameEnum.ReliquatAdjustment,
  //       permission: [PermissionEnum.Create, PermissionEnum.Update],
  //     },
  //     {
  //       feature: FeaturesNameEnum.ReliquatPayment,
  //       permission: [PermissionEnum.Create, PermissionEnum.Update],
  //     },
  //     {
  //       feature: FeaturesNameEnum.EmployeeContract,
  //       permission: [PermissionEnum.Create, PermissionEnum.Update],
  //     },
  //     {
  //       feature: FeaturesNameEnum.Timesheet,
  //       permission: [PermissionEnum.View],
  //     },
  //     {
  //       feature: FeaturesNameEnum.TimesheetSummary,
  //       permission: [PermissionEnum.View],
  //     },
  //     {
  //       feature: FeaturesNameEnum.Dashboard,
  //       permission: [PermissionEnum.View],
  //     },
  //   ],
  // },
  // {
  //   permission: {
  //     feature: FeaturesNameEnum.EmployeeFile,
  //     permission: PermissionEnum.View,
  //   },
  //   defaultPermission: [
  //     {
  //       feature: FeaturesNameEnum.Request,
  //       permission: [PermissionEnum.View],
  //     },
  //     {
  //       feature: FeaturesNameEnum.Employee,
  //       permission: [PermissionEnum.View],
  //     },
  //   ],
  // },
  {
    permission: {
      feature: FeaturesNameEnum.EmployeeFile,
      permission: PermissionEnum.View,
    },
    defaultPermission: [
      {
        feature: FeaturesNameEnum.Salary,
        permission: [PermissionEnum.View],
      },
    ],
  },
  {
    permission: {
      feature: FeaturesNameEnum.BonusType,
      permission: PermissionEnum.View,
    },
    defaultPermission: [
      // {
      //   feature: FeaturesNameEnum.Employee,
      //   permission: [PermissionEnum.Create, PermissionEnum.View],
      // },
      {
        feature: FeaturesNameEnum.ImportLog,
        permission: [PermissionEnum.Create, PermissionEnum.View],
      },
      {
        feature: FeaturesNameEnum.Timesheet,
        permission: [PermissionEnum.View],
      },
      {
        feature: FeaturesNameEnum.TimesheetSummary,
        permission: [PermissionEnum.View],
      },
    ],
  },
  {
    permission: {
      feature: FeaturesNameEnum.ContractEnd,
      permission: PermissionEnum.View,
    },
    defaultPermission: [
      {
        feature: FeaturesNameEnum.Timesheet,
        permission: [PermissionEnum.Approve],
      },
    ],
  },
  // {
  //   permission: {
  //     feature: FeaturesNameEnum.ContractEnd,
  //     permission: PermissionEnum.Update,
  //   },
  //   defaultPermission: [
  //     {
  //       feature: FeaturesNameEnum.Timesheet,
  //       permission: [PermissionEnum.Approve],
  //     },
  //   ],
  // },
  {
    permission: {
      feature: FeaturesNameEnum.EmployeeContract,
      permission: PermissionEnum.Update,
    },
    defaultPermission: [
      {
        feature: FeaturesNameEnum.Timesheet,
        permission: [PermissionEnum.Approve],
      },
    ],
  },
];

export enum AccountPO {
  OUTER = "outer",
  INNER = "inner",
}

export enum ModuleType {
  EMPLOYEE = "EMPLOYEE",
  TIMESHEET = "TIMESHEET",
  USERS = "USERS",
  CLIENTS = "CLIENTS",
  SEGMENTS = "SEGMENTS",
}

export enum ContractPdfEnumTypes {
  Expat_Contract = "Expat_Contract",
  LRED_Avenant = "LRED_Avenant",
  Salarié = "Salarié",
}

export const ContractPdfTypes = ["Expat_Contract", "LRED_Avenant", "Salarié"];

export const shouldDashboardRenderMenuItem = (
  menu: { name: string },
  routeName: string,
  isCheckEmployee: boolean
) => (isCheckEmployee && menu.name !== routeName) || !isCheckEmployee;

export const shouldEmployeeRenderMenuItem = (
  mainmenu: { name: string },
  menu: { name: string },
  isCheckEmployee: boolean
) =>
  (isCheckEmployee &&
    !(mainmenu.name === "Employees" && menu.name === "Summary")) ||
  !isCheckEmployee;

export const getFeaturePermission = (data: IRolePermissionData[]) => {
  //TODO fix ts error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uniqueFeature: any = [];
  const permission = data.reduce((acc: string[], item: IRolePermissionData) => {
    const key = JSON.stringify(item.permission?.feature?.name);

    if (key && !uniqueFeature[key]) {
      uniqueFeature[key] = [item.permission?.permissionName];
      acc.push(key);
    } else {
      uniqueFeature[key].push(item.permission?.permissionName);
    }
    return acc;
  }, []);
  const result = permission.map((val: string) => ({
    featureName: JSON.parse(val),
    permissions: uniqueFeature[val],
  }));
  return result;
};

export const ImageTypeValidation = (
  allowedExtensions: string[],
  file: File
) => {
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  return allowedExtensions.includes(fileExtension ?? "");
};

export const GetFilePermissionLink = async (filename: string) => {
  const result = await GetEmployeeFilePathData({ filename: filename });
  if (result?.data?.responseData) {
    return result?.data?.responseData;
  }
  return false;
};
