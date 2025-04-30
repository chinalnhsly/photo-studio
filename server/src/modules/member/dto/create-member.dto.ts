import { IsNotEmpty, IsOptional, IsNumber, IsString, IsBoolean, IsEmail, IsDate, IsISO8601 } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMemberDto {
  @ApiProperty({ description: '用户ID' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  
  @ApiProperty({ description: '会员等级ID', required: false })
  @IsOptional()
  @IsNumber()
  levelId?: number;
  
  @ApiProperty({ description: '会员积分', required: false })
  @IsOptional()
  @IsNumber()
  points?: number;
  
  @ApiProperty({ description: '生日', required: false })
  @IsOptional()
  @IsISO8601()
  birthday?: string;
  
  @ApiProperty({ description: '手机号码', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
  
  @ApiProperty({ description: '邮箱', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
  
  @ApiProperty({ description: '地址', required: false })
  @IsOptional()
  @IsString()
  address?: string;
  
  @ApiProperty({ description: '是否订阅营销信息', required: false })
  @IsOptional()
  @IsBoolean()
  isSubscribed?: boolean;
}
