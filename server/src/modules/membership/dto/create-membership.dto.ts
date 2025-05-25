import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsDateString, IsObject } from 'class-validator';
import { MembershipLevel } from '../entities/membership.entity';

export class CreateMembershipDto {
  @ApiProperty({ description: '用户ID', required: true })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ 
    description: '会员等级', 
    enum: MembershipLevel, 
    default: MembershipLevel.REGULAR 
  })
  @IsEnum(MembershipLevel)
  @IsOptional()
  level?: MembershipLevel;

  @ApiProperty({ description: '会员积分', required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  points?: number;

  @ApiProperty({ description: '是否激活', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: '过期日期', required: false, type: String, format: 'date' })
  @IsDateString()
  @IsOptional()
  expiryDate?: Date;

  @ApiProperty({ 
    description: '会员特权', 
    required: false, 
    type: 'object',
    example: {
      discountRate: 0.9,
      freeShipping: true,
      birthdayGift: true
    }
  })
  @IsObject()
  @IsOptional()
  benefits?: Record<string, any>;
}
