import { IsNumber, IsString, IsOptional, IsEnum, Min, IsInt } from 'class-validator';
import { PointLogType } from '../enums/point-log-type.enum';

export class AddPointsDto {
  @IsNumber()
  @IsInt()
  points: number;

  @IsEnum(PointLogType)
  type: PointLogType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  orderId?: number;

  @IsNumber()
  @IsOptional()
  operatorId?: number;
}
