import { ISegmentData } from "../segment/segmentInterface";
export interface ISubSegmentData {
  id?: number;
  code: string;
  name: string;
  slug?: string;
  isActive?: boolean;
  costCentre: string | null;
  fridayBonus: number | null;
  saturdayBonus: number | null;
  overtime01Bonus: number | null;
  overtime02Bonus: number | null;
  segmentId: number | null;
  segment?: ISegmentData;
  createdBy?: number | null;
  createdAt?: Date | string;
  updatedBy?: number | null;
  updatedAt?: Date;
  deletedAt?: Date;
}
