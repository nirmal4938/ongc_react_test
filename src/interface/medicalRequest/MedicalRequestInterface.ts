export interface IMedicalRequestData {
  id?: number;
  reference?: string;
  clientId?: number;
  employeeId?: number | null;
  medicalTypeId?: number | null;
  medicalDate?: Date;
  status?: string;
  daysBeforeExpiry?: number | null;
  createdAt?: Date | string;
  createdBy?: number;
  updatedAt?: Date | string;
  updatedBy?: number;
  deletedAt?: Date | null | string;
}

export interface IMedicalExpiryData {
  id?: number;
  medicalCheckExpiry?: Date;
  medicalCheckDate?: Date;
  loginUserData?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface IMedicalRequestDetail {
  id: number;
  reference: string;
  createdAt: string;
  employeeId: number;
  medicalTypeId: number;
  medicalDate: string;
  status: string;
  medicalTypeData: {
    name: string;
  };
  employee: {
    client: {
      stampLogo: string | null;
    };
    id: number;
    loginUserData: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  createdByUser: {
    id: number;
    loginUserId: number;
    loginUserData: {
      name: string;
      email: string;
    };
  };
  updatedAt: string | null;
  updatedByUser: {
    id: number;
    loginUserId: number;
    loginUserData: {
      name: string;
      email: string;
    };
  };
}
