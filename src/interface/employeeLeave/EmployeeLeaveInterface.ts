export interface IEmployeeLeaveData {
  id?: number;
  employeeId?: number;
  reference?: string;
  startDate: Date | null;
  endDate: Date | null;
  segmentId?: number;
  rotationId?: number;
  employeeContractEndDate?: Date | string;
  totalDays?: number;
  status?: string;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
  leaveType?: string;
  description?: string;
  reliquatCalculation?: number;
}

export interface IEmployeeLeavePDF {
  employeeId: number;
  reference: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: string;
  employeeLeaveFlag?: boolean;
  updatedAt: string | null;
  createdByUser: {
    id: number;
    loginUserData: { name: string; email: string };
  };
  updatedByUser: {
    id: number;
    loginUserData: { name: string; email: string };
  } | null;
  employeeDetail: {
    fonction: string;
    address: string | null;
    employeeNumber: string;
    segment?: {
      id: number;
      name: string;
    };
    subSegment?: {
      id: number;
      name: string;
    };
    loginUserData: {
      firstName: string;
      lastName: string;
      email: string;
    };
    client: {
      id: number;
      titreDeConge: string | "";
      stampLogo: string | null;
      loginUserData: {
        name: string;
      };
    };
  };
  reliquatCalculationData?: number;
  dateDeRepriseEndDate?: string;
  debutDeConge: string;
  dateDuRetour: string;
  droitDeConge: number;
  lieuDeSejour: string | null;
  createdAtTime: string;
  updatedAtTime: string | null;
}
