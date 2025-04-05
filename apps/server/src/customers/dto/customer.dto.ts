import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: '张三' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: '李' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'zhangsan@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '13800138000' })
  @IsPhoneNumber('CN')
  phone: string;
}

export class UpdateCustomerDto {
  @ApiProperty({ example: '张三' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: '李' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'zhangsan@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '13800138000' })
  @IsPhoneNumber('CN')
  @IsOptional()
  phone?: string;
}

export class CustomerFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}
