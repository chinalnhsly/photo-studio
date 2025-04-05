import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: '密码长度至少为6位' })
  password: string;

  @ApiProperty({ example: '张三' })
  @IsString()
  name: string;
}
