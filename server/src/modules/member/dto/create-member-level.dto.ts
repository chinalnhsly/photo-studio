import { IsNotEmpty, IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberLevelDto {
  @ApiProperty({ description: '等级名称' })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({ description: '所需积分' })
  @IsNotEmpty()
  @IsNumber()
  requiredPoints: number;
  
  @ApiProperty({ description: '折扣率 (0-1)' })
  @IsNotEmpty()
  @IsNumber()
  discountRate: number;
  
  @ApiProperty({ description: '积分倍数' })
  @IsNotEmpty()
  @IsNumber()
  pointsMultiplier: number;
  
  @ApiProperty({ description: '排序顺序', required: false })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
  
  @ApiProperty({ description: '图标', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
  
  @ApiProperty({ description: '颜色', required: false })
  @IsOptional()
  @IsString()
  color?: string;
  
  @ApiProperty({ description: '等级权益', required: false })
  @IsOptional()
  @IsString()
  benefits?: string;
  
  @ApiProperty({ description: '是否激活', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
