import { IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PointLogType } from '../enums/point-log-type.enum';

export class AdjustPointsDto {
  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsNumber()
  @ApiProperty()
  points: number;

  @IsEnum(PointLogType)
  @ApiProperty({ enum: PointLogType })
  type: PointLogType;

  @IsString()
  @ApiProperty()
  description: string;
}
