import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum CouponType {
  FIXED = 'FIXED',      // 固定金额
  PERCENTAGE = 'PERCENTAGE',  // 折扣比例
}

export class CreateCouponDto {
  @ApiProperty({ example: 'SPRING2024' })
  @IsString()
  code: string;

  @ApiProperty({ enum: CouponType })
  @IsEnum(CouponType)
  type: CouponType;

  @ApiProperty({ example: 100 }) // 固定金额为100元，百分比为10%
  @IsNumber()
  value: number;

  @ApiProperty({ example: 1000 }) // 最低消费
  @IsNumber()
  @IsOptional()
  minSpend?: number;

  @ApiProperty({ example: '2024-04-01' })
  @IsDateString()
  validFrom: string;

  @ApiProperty({ example: '2024-04-30' })
  @IsDateString()
  validTo: string;

  @ApiProperty({ example: 100 }) // 发放数量
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  campaignId?: number;
}

export class UpdateCouponDto extends CreateCouponDto {}

export class CouponFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  campaignId?: number;
}
