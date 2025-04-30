import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsNumber, 
  IsBoolean, 
  IsDate,
  IsArray,
  Min,
  Max,
  IsInt,
  ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CouponType } from '../entities/coupon.entity';

export class CreateCouponDto {
  @ApiProperty({ description: '优惠券名称' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '优惠券代码', required: false })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: '所属活动ID', required: false })
  @IsOptional()
  @IsInt()
  campaignId?: number;

  @ApiProperty({ 
    description: '优惠券类型', 
    enum: ['fixed', 'percentage', 'free_shipping', 'gift'] 
  })
  @IsNotEmpty()
  @IsEnum(['fixed', 'percentage', 'free_shipping', 'gift'])
  type: CouponType;

  @ApiProperty({ description: '固定优惠金额', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf(o => o.type === 'fixed')
  value?: number;

  @ApiProperty({ description: '折扣百分比 (0-1)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @ValidateIf(o => o.type === 'percentage')
  percentage?: number;

  @ApiProperty({ description: '最低消费金额', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPurchase?: number;

  @ApiProperty({ description: '开始时间' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ description: '结束时间' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({ description: '每人使用次数上限', default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ description: '是否激活', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '是否仅限新用户', default: false })
  @IsOptional()
  @IsBoolean()
  isForNewUser?: boolean;

  @ApiProperty({ description: '是否仅限会员', default: false })
  @IsOptional()
  @IsBoolean()
  isForMember?: boolean;

  @ApiProperty({ description: '会员等级ID', required: false })
  @IsOptional()
  @IsInt()
  memberLevelId?: number;

  @ApiProperty({ description: '关联产品ID列表', required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  productIds?: number[];

  @ApiProperty({ description: '关联分类ID列表', required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @ApiProperty({ description: '指定用户ID列表', required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  userIds?: number[];
}
