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
  ValidateIf,
  IsInt
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CampaignType, CampaignStatus } from '../entities/campaign.entity';

export class CreateCampaignDto {
  @ApiProperty({ description: '活动名称' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '活动描述', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: '活动类型', 
    enum: ['discount', 'flash_sale', 'bundle', 'gift', 'free_shipping'] 
  })
  @IsNotEmpty()
  @IsEnum(['discount', 'flash_sale', 'bundle', 'gift', 'free_shipping'])
  type: CampaignType;

  @ApiProperty({ 
    description: '活动状态', 
    enum: ['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  })
  @IsOptional()
  @IsEnum(['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled'])
  status?: CampaignStatus;

  @ApiProperty({ description: '固定折扣金额', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @ValidateIf(o => o.type === 'discount' && !o.discountRate)
  discountValue?: number;

  @ApiProperty({ description: '折扣率 (0-1)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @ValidateIf(o => o.type === 'discount' && !o.discountValue)
  discountRate?: number;

  @ApiProperty({ description: '最低消费金额', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumPurchase?: number;

  @ApiProperty({ description: '开始时间', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiProperty({ description: '结束时间', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiProperty({ description: '使用次数上限', required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  usage_limit?: number;

  @ApiProperty({ description: '是否激活', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '活动图片', required: false })
  @IsOptional()
  @IsString()
  image?: string;

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

  @ApiProperty({ description: '活动规则JSON', required: false })
  @IsOptional()
  rules?: any;

  @ApiProperty({ description: '关联产品ID列表', required: false })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  productIds?: number[];
}
