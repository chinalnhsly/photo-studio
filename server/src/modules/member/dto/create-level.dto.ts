import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLevelDto {
  @IsString()
  @ApiProperty({ description: '等级名称' })
  name: string;

  @IsNumber()
  @ApiProperty({ description: '所需积分' })
  requiredPoints: number;

  @IsNumber()
  @ApiProperty({ description: '折扣率' })
  discount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '等级描述', required: false })
  description?: string;
}
