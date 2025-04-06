import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsPhoneNumber, IsOptional, minLength, MIN_LENGTH } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: '张' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: '三' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'zhangsan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '13800138000' })
  @IsPhoneNumber('CN')
  phone: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  password: string;
}

export class UpdateCustomerDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber('CN')
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string; // 添加可选的password字段
}

export class CustomerFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  pageSize?: number = 10;
}