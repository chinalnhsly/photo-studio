import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  name: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsString()
  location: string;

  @IsNumber()
  price: number;

  @IsNumber()
  max_participants: number;
}

export class UpdateActivityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  start_time?: string;

  @IsOptional()
  @IsDateString()
  end_time?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  max_participants?: number;
}
