export interface IReliquatAdjustmentData {
  id?: number;
  clientId?: number | null;
  employeeId?: number | null;
  startDate?: Date | string | null;
  adjustment?: number | null;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
