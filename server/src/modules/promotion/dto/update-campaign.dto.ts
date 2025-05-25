import { IsString, IsOptional, IsDate, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '活动名称' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '活动描述' })
  description?: string;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: '开始时间' })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: '结束时间' })
  endDate?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '活动类型', enum: ['discount', 'coupon', 'gift', 'flash_sale'] })
  type?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: '是否启用' })
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '折扣力度(百分比)' })
  discountPercentage?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '最大优惠金额' })
  maxDiscount?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '最低消费金额' })
  minimumPurchase?: number;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ description: '适用商品ID列表' })
  productIds?: number[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ description: '适用品类ID列表' })
  categoryIds?: number[];

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '优惠券数量限制' })
  couponLimit?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '每人限领数量' })
  perUserLimit?: number;
}
