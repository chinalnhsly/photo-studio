import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UserQueryDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
