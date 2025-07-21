export interface IMedicalTypeData {
  id?: number;
  name?: string;
  format?: string;
  daysBeforeExpiry?: number | null;
  daysExpiry?: number | null;
  amount?: number | null;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
