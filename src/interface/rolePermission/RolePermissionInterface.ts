export interface IRoleData {
  id?: number;
  name: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
  assignedPermissions?: IRolePermissionData[];
}

export interface IRolePermissionData {
  id?: number;
  permissionId: number;
  roleId: number;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  permission?: IPermissionData;
}

export interface IPermissionData {
  id?: number;
  permissionName: string;
  featureId: number;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  feature?: IFeaturesData;
}

export interface IFeaturesData {
  id?: number;
  name: string;
  type?: string;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  permissions?: IPermissionData[];
}

export interface IUserPermissionData {
  id?: number;
  permissionId: number;
  userId: number;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
  permission?: IPermissionData;
}
export interface TransformedData {
  [key: string]: IFeaturesData[];
}