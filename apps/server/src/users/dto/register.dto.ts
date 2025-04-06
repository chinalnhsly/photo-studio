import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsPhoneNumber, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: '密码长度至少为6位' })
  password: string;

  @ApiProperty({ example: '张' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: '三' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '13800138000' })
  @IsPhoneNumber('CN', { message: '请输入有效的手机号码' })
  phone: string;
}
