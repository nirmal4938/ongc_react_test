export interface IAccountSummaryData {
  id?: number;
  timesheetQty: number;
  dailyRate: number;
  timesheet: {
    id: number;
    dailyRate: number;
    startDate: string;
    endDate: string;
    employee: {
      id: number;
      employeeNumber: string;
      monthlySalary: number;
      loginUserData: {
        firstName: string;
        lastName: string;
      };
      segmentData: {
        id: number;
        name: string;
        code: string;
      } | null;
      subSegmentData: {
        id: number;
        name: string;
        code: string;
      } | null;
    };
  };
  bonus1Name?: string | null;
  bonus2Name?: string | null;
  bonus1?: number | null;
  bonus2?: number | null;
  clientId: number | null;
  employeeId?: number | null;
  comments?: string;
  dailyCost?: number;
  dateSalaryPaid?: Date | string;
  daysWorked?: number;
  invoiceAmount?: number;
  invoiceLodgingDate?: Date;
  invoiceNumber?: string;
  invoiceNumberPOBonus1?: number;
  invoiceNumberPOBonus2?: number;
  bonus3Name?: string | null;
  bonus3?: string | null;
  poBonus3?: string | null;
  invoiceNumberPOBonus3?: string | null;
  additionalAmount: string | null;
  additionalPOBonus: string | null;
  additionalInvoiceNumberPO: string | null;
  invoiced?: number;
  poBonus1?: number;
  poBonus2?: number;
  poDate?: Date;
  poNumber?: string;
  position?: string;
  salaryPaid?: number;
  serviceMonth?: string;
  shouldBeInvoiced?: number;
  timesheetId?: number;
  toBeInvoicedBack?: number;
  type?: number;
  createdBy?: number;
  updatedBy?: number | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date;
}

export interface IAccountSummaryDataById {
  id?: number;
  monthlySalaryWithHousingAndTravel: number | null;
  bonus1Name?: string | null;
  bonus2Name?: string | null;
  bonus1?: number | null;
  employee?: {
    contractEndDate?: Date;
  };
  n: string;
  affectation?: string | null;
  bonus2?: number | null;
  clientId: number | null;
  employeeId?: number | null;
  comments?: string;
  dailyCost?: number;
  dateSalaryPaid?: Date | string;
  daysWorked?: number;
  invoiceAmount?: number;
  invoiceLodgingDate?: Date;
  invoiceNumber?: string;
  invoiceNumberPOBonus1?: number;
  invoiceNumberPOBonus2?: number;
  invoiced?: number;
  poBonus1?: number;
  poBonus2?: number;
  poDate?: Date;
  poNumber?: string;
  position?: string;
  salaryPaid?: number;
  serviceMonth?: string;
  shouldBeInvoiced?: number;
  timesheetId?: number;
  toBeInvoicedBack?: number;
  type?: number;
  bonus3Name?: string | null;
  bonus3?: string | number | null;
  poBonus3?: string | number | null;
  invoiceNumberPOBonus3?: string | null;
  additionalAmount: string | number | null;
  additionalPOBonus: string | number | null;
  additionalInvoiceNumberPO: string | null;
  createdBy?: number;
  updatedBy?: number | null;
  createdAt?: Date;
  updatedAt?: Date | null;
  deletedAt?: Date;
}
