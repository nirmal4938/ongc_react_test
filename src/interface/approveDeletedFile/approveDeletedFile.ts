export interface IApproveDeletedFileData {
  id: string;
  folderId: string;
  name?: string;
  fileName?: string;
  fileSize?: number;
  deletedAt?: Date | null | string;
  folder: {
    name: string;
    typeId: number;
    id: number;
  };
  documentName?: string;
  documentPath?: string;
  documentSize?: number;
  employee?: {
    contractEndDate?: Date | null;
    employeeNumber?: string | number;
    loginUserData?: {
      email?: string;
      firstName?: string;
      lastName?: string;
    };
  };
  updatedByUser?:{
    loginUserData?: {
      email?: string;
      firstName?: string;
      lastName?: string;
    };
  }
}
