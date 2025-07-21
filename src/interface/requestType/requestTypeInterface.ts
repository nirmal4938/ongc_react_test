export interface IRequestTypeData {
  id?: number;
  name?: string;
  notificationEmails?: string;
  isActive?: boolean;
  createdByUser?: { name: string };
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
