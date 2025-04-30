import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  Min,
  MaxLength,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ShootingType } from '../enums/shooting-type.enum';

export class CreateBookingDto {
  @ApiProperty({ description: '用户ID' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '摄影师ID', required: false })
  @IsOptional()
  @IsNumber()
  photographerId?: number;

  @ApiProperty({ description: '工作室ID', required: false })
  @IsOptional()
  @IsNumber()
  studioId?: number;

  @ApiProperty({
    description: '拍摄类型',
    enum: ShootingType,
    default: ShootingType.STANDARD,
  })
  @IsOptional()
  @IsEnum(ShootingType)
  shootingType?: ShootingType;

  @ApiProperty({ description: '预约日期 (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: '开始时间 (HH:MM)' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ description: '结束时间 (HH:MM)' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ description: '客户备注', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  customerNote?: string;

  @ApiProperty({ description: '人数', default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  peopleCount?: number;

  @ApiProperty({ description: '客户姓名', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerName?: string;

  @ApiProperty({ description: '客户电话', required: false })
  @ValidateIf((o) => !o.customerEmail)
  @IsString()
  @MaxLength(20)
  customerPhone?: string;

  @ApiProperty({ description: '客户邮箱', required: false })
  @ValidateIf((o) => !o.customerPhone)
  @IsEmail()
  @MaxLength(100)
  customerEmail?: string;

  @ApiProperty({ description: '关联产品ID列表', required: false })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  productIds?: number[];

  @ApiProperty({ description: '是否确认预约', default: false })
  @IsOptional()
  @IsBoolean()
  isConfirmed?: boolean;

  @ApiProperty({ description: '订金金额', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;
}
