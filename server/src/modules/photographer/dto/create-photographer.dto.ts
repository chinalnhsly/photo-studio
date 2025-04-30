import { IsNotEmpty, IsString, IsNumber, IsOptional, IsArray, IsBoolean, IsEmail, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotographerDto {
  @ApiProperty({ description: '摄影师姓名' })
  @IsNotEmpty({ message: '摄影师姓名不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '摄影师简介' })
  @IsNotEmpty({ message: '摄影师简介不能为空' })
  @IsString()
  biography: string;

  @ApiProperty({ description: '摄影师头像' })
  @IsNotEmpty({ message: '摄影师头像不能为空' })
  @IsString()
  avatar: string;

  @ApiProperty({ description: '是否在职', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: '评分', required: false, default: 5.0 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ description: '特长/风格ID列表', type: [Number], required: false })
  @IsOptional()
  @IsArray()
  specialtyIds?: number[];

  @ApiProperty({ description: '使用装备', type: [String], required: false })
  @IsOptional()
  @IsArray()
  equipments?: string[];

  @ApiProperty({ description: '联系电话', required: false })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ description: '电子邮箱', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: '从业年限', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number;

  @ApiProperty({ description: '语言能力', required: false })
  @IsOptional()
  @IsString()
  languagesSpoken?: string;

  @ApiProperty({ description: '是否接受加急订单', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  acceptsRushJobs?: boolean;

  @ApiProperty({ description: '作品集图片', type: [String], required: false })
  @IsOptional()
  @IsArray()
  portfolioImages?: string[];
}
