export interface IContactData {
  id?: number;
  name?: string;
  email?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  address4?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  dueDateDays?: string;
  brandingTheme?: string;
  clientId?: number | null;
  client?: { name: string };
  createdByUser?: { name: string };
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}
