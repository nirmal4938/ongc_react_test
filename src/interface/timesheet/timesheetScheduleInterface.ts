export interface ITimesheetScheduleData {
  createdAt: Date;
  createdBy: number;
  date: Date;
  deletedAt: Date;
  employeeId: number;
  isLeaveForTitreDeConge?: boolean;
  overtimeHours: number;
  id: number;
  status: string;
  bonusCode: string;
  updatedAt: Date | null;
  updatedBy: null | number;
}
