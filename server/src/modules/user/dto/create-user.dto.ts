import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe', description: '用户名' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  username: string;

  @ApiProperty({ example: 'password123', description: '密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少需要6个字符' })
  password: string;

  @ApiProperty({ example: 'john@example.com', description: '联系方式' })
  @IsOptional()
  @IsEmail({}, { message: '请提供有效的电子邮件地址' })
  contactInfo?: string;

  @ApiProperty({ example: 'user', description: '用户角色', default: 'user' })
  @IsOptional()
  @IsString({ message: '角色必须是字符串' })
  role?: string = 'user';

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: '头像URL' })
  @IsOptional()
  @IsString({ message: '头像URL必须是字符串' })
  avatar?: string;

  @ApiProperty({ example: '13800138000', description: '手机号' })
  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  phone?: string;

  @ApiProperty({ example: 'john@example.com', description: '邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '请提供有效的电子邮件地址' })
  email?: string;
}
