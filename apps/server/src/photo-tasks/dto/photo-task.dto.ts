import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PhotoTaskStatus } from '@prisma/client';

export class CreatePhotoTaskDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  customerId: number;

  @ApiProperty({ example: '2024-04-01T10:00:00Z' })
  @IsDateString()
  taskDate: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePhotoTaskDto {
  @ApiProperty({ enum: PhotoTaskStatus })
  @IsEnum(PhotoTaskStatus)
  @IsOptional()
  status?: PhotoTaskStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class PhotoTaskFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  customerId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, enum: PhotoTaskStatus })
  @IsOptional()
  @IsEnum(PhotoTaskStatus)
  status?: PhotoTaskStatus;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  pageSize?: number = 10;
}
