import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString, IsString, IsOptional, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  serviceId: number;

  @ApiProperty({ example: '2024-04-10T14:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: '特殊拍摄要求说明' })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateAppointmentDto {
  @ApiProperty({ enum: AppointmentStatus })
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class AppointmentFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  serviceId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ required: false, enum: AppointmentStatus })
  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
