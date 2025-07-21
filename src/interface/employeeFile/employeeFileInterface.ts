export interface IEmployeeFileData {
  id?: number;
  fileName: string;
  fileLink: boolean;
  name: string;
  fileSize: string | number;
  folderId: string | number;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | string;
}
