import { IsEmail, IsString, MinLength, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: '13800138000', required: false })
  @IsOptional()
  @Matches(/^1\d{10}$/, { message: '请输入有效的手机号' })
  phone?: string;
}
