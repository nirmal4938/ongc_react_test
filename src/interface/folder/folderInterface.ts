export interface IFolderData {
  id?: number;
  name?: string;
  index?: number | null;
  typeId?: number;
  createdByUser?: { name: string };
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
