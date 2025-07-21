export interface IReliquatPaymentData {
  id?: number;
  clientId?: number | null;
  employeeId?: number | null;
  startDate?: Date | string | null;
  amount?: number | null;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
