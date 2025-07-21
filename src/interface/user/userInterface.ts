import { IClientResponseData } from "../client/clientInterface";
import { IRolePermissionData } from "../rolePermission/RolePermissionInterface";
import { ISegmentData } from "../segment/segmentInterface";
import { ISubSegmentData } from "../subSegment/subSegmentInterface";

export interface User {
  id: number;
  email: string;
  timezone: string;
  name: string;
  isMailNotification: boolean;
  code: string;
  phone: string;
  birthDate: null | Date | string;
  gender: null | string;
  status: string;
  verified: boolean;
  profileImage: null | string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null | string;
}

export interface IUserData {
  id: number;
  loginUserId: number;
  roleId: number;
  status: string;
  loginUserData: ILoginUserData;
  roleData: {
    name: string;
    assignedPermissions: IRolePermissionData[];
  };
  userClientList?: IUserClientData[];
  userSegmentList?: IUserSegmentData[];
  userSegmentApprovalList?: IUserSegmentData[];
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  featurePermissions?: { featureName: string; permissions: [] }[];
  clientId?: number | null;
}
export interface ILoginUser {
  email: string;
  firstName?: string;
  lastName?: string;
  phone: string | null;
}
export interface ILoginUserData {
  id: number;
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  timezone: string;
  phone: string;
  birthDate: Date | string;
  placeOfBirth: string;
  gender: string;
  code: string;
  isMailNotification: boolean;
  profileImage: null | string;
  assignedUserPermission: IRolePermissionData[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  user?: {
    id: number;
  };
}

export interface IUserClientData {
  id: number;
  loginUserId: number;
  clientId: number;
  roleId: number;
  status: string;
  userData: IUserData;
  clientData?: IClientResponseData;
  roleData: {
    name: string;
    assignedPermissions: IRolePermissionData[];
  };
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
}

export interface IUserSegmentData {
  id: number;
  userId: number;
  userData: IUserData;
  clientId: number;
  clientData?: IClientResponseData;
  segmentId: number;
  segmentData?: ISegmentData;
  subSegmentId: number;
  subSegmentData?: ISubSegmentData;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
}
