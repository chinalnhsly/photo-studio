import { PointLogType } from '../enums/point-log-type.enum';

export interface PointLogInfo {
  memberId: number;
  points: number;
  type: PointLogType;
  description?: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface PointLogQueryParams {
  startDate?: Date;
  endDate?: Date;
  type?: PointLogType;
  page?: number;
  limit?: number;
}
