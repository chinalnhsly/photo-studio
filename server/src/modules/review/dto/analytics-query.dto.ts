import { IsOptional, IsString, IsInt, IsEnum, Min, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsQueryDto {
  @ApiProperty({ description: '开始日期', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: '结束日期', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    description: '周期', 
    required: false, 
    enum: ['day', 'week', 'month', 'year'],
    default: 'week'
  })
  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'year'])
  period?: string = 'week';

  @ApiProperty({ description: '数量限制', required: false, default: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
