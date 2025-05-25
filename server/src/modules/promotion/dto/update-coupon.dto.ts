import { IsString, IsOptional, IsDate, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '优惠券代码' })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '优惠券类型', enum: ['fixed', 'percentage'] })
  type?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '优惠金额/折扣比例' })
  value?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '最低消费金额' })
  minimumPurchase?: number;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: '生效时间' })
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @ApiPropertyOptional({ description: '失效时间' })
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: '是否启用' })
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '使用次数限制' })
  usageLimit?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: '是否仅限新用户' })
  isForNewUser?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ description: '是否仅限会员' })
  isForMember?: boolean;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: '会员等级ID' })
  memberLevelId?: number;

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ description: '适用商品ID列表' })
  productIds?: number[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ description: '适用品类ID列表' })
  categoryIds?: number[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ description: '适用用户ID列表' })
  userIds?: number[];
}
