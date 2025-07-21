export interface IAccountPOSummaryData {
  id: number;
  segmentData: {
    id: number | null;
  } | null;
  subSegmentData: {
    id: number | null;
  } | null;
  type: string;
  total: number;
  managerData?: string[];
}
[];
