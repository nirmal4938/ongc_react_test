export interface IReliquatVersionCalculationData {
  id: number;
  clientId: number;
  timesheetId: number;
  employeeId: number;
  leave: number;
  presentDay: number;
  totalTakenLeave: number;
  earned: number;
  totalWorked: number;
  annualLeave:number;
  weekendBonus: number;
  overtimeBonus: number;
  weekend: number;
  overtime: number;
  reliquat: number;
  reliquatAdjustment: number;
  reliquatPayment: number;
  reliquatAdjustmentValue: number;
  reliquatPaymentValue: number;
  calculation: number;
  calculateEquation: string;
  startDate: string;
  endDate: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: number;
    loginUserId: number;
    employeeNumber: string;
    loginUserData: {
      firstName: string;
      lastName: string;
    };
    segment?:{
      id:number
      name:string
    }
    subSegment?:{
      id:number
      name:string
    }
    rotation: {
      name: string;
      id: number;
      weekOn: number;
      weekOff: number;
      description: string;
    };
  };
  timesheet: {
    id: number;
    status: string;
  };
}
