import { IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PointLogType } from '../enums/point-log-type.enum';

export class AddMemberPointsDto {
  @IsNumber()
  @ApiProperty({ description: '积分数量' })
  points: number;

  @IsEnum(PointLogType)
  @ApiProperty({ description: '积分类型', enum: PointLogType })
  type: PointLogType;

  @IsString()
  @ApiProperty({ description: '积分说明' })
  description: string;
}
