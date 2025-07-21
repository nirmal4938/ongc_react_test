export enum IImportStatus {
  OK = "OK",
  INFO = "INFO",
}
export interface IImportLogDetail {
  importLogData: {
      id: number;
      status:IImportStatus
      description: string;
  
  }[];
}
export interface IImportLogData {
  fileName?: string;
  startDate?: string;
  endDate?: string;
}
