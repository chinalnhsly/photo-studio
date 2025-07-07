import { IsNumber, IsEnum, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PointLogType } from '../enums/point-log-type.enum';

export class AddPointsDto {
  @IsNumber()
  @ApiProperty({ description: '积分变更数量' })
  points: number;

  @IsEnum(PointLogType)
  @ApiProperty({ 
    description: '积分变更类型',
    enum: PointLogType
  })
  type: PointLogType;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '变更说明' })
  description?: string;
}
