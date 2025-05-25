import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  parent_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  parent_id?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
