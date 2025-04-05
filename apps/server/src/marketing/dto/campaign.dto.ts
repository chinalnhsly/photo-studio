import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: '春季婚纱摄影优惠' })
  @IsString()
  name: string;

  @ApiProperty({ example: '春季特惠活动，全场婚纱摄影套餐8折' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-04-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-04-30' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export class UpdateCampaignDto extends CreateCampaignDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CampaignFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 20;
}
