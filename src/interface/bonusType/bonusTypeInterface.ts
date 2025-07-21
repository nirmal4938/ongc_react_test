export interface IBonusTypeData {
  id?: number;
  clientId?: number;
  code?: string;
  name?: string;
  basePrice?: number | null;
  price?: number | null;
  dailyCost?: number | null;
  timesheetName?: string;
  isActive?: boolean;
  client?: { name: string };
  createdByUser?: { name: string };
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
