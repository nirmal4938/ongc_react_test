export interface IContractSummaryData {
  id?: string;
  clientId?: string | number;
  employeeId: number;
  description?: string | null;
  contractVersionId: string | number;
  contractTemplateId?: string | number;
  newContractNumber?: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
  workOrderDate: Date | null;
  contractorsPassport: string | number | null;
  endOfAssignmentDate: Date | null;
  descriptionOfAssignmentAndOrderConditions: string | null;
  durationOfAssignment: string | null;
  workLocation: string | null;
  workOrderNumber: string | number | null;
  workCurrency: string | null;
  remuneration: number | null;
  uniqueWorkNumber: number | null;
  employeeDetail?: {
    id: number;
    employeeNumber: string;
    contractNumber: string;
    contractSignedDate: string;
    startDate: string;
    fonction: string;
    fonctionDate: Date | null;
    terminationDate: string;
    baseSalary: number;
    travelAllowance: number;
    Housing: number;
    monthlySalary: number;
    address: string;
    nSS: string;
    medicalCheckDate: string;
    medicalCheckExpiry: string;
    medicalInsurance: boolean;
    dailyCost: number;
    customBonus: string | null;
    loginUserData: {
      firstName: string;
      lastName: string;
      birthDate: string;
      placeOfBirth: string;
    };
    rotation: {
      weekOn: number;
      weekOff: number;
      name: string;
      isResident: boolean;
      isAllDays: boolean;
      isWeekendBonus: boolean;
      isOvertimeBonus: boolean;
      daysWorked: string;
      description: string;
    };
    client: {
      id: number;
      country: string;
      code: string;
      contractN: string | null;
      currency: string | null;
      contractTagline: string | null;
      address?: string | null;
      loginUserData: {
        name: string;
      };
    };
    employeeRotation: {
      id: number;
      rotation: {
        id: number;
        name: string;
      };
    }[];
    employeeBonus: {
      bonus: { id: number; name: string; code: string };
      code: string;
      id: number;
      name: string;
      bonusId: number;
      catalogueNumber: string;
      coutJournalier: number;
      employeeId: number;
      endDate: string;
      price: number;
      startDate: string;
    }[];
    employeeSalary: {
      id: number;
      monthlySalary: number;
      startDate: string;
      endDate: string;
    }[];
  };
}
