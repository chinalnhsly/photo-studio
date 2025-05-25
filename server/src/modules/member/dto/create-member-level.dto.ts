import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberLevelDto {
  @IsString()
  @ApiProperty({ description: '等级名称' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: '所需积分' })
  requiredPoints: number;

  @IsNumber()
  @ApiProperty({ description: '折扣率', example: 0.95 })
  discount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '等级权益', required: false })
  benefits?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '等级排序', required: false })
  sortOrder?: number;
}
