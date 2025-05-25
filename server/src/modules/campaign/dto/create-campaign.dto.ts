import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCampaignDto {
  @ApiProperty({ description: '活动名称' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: '开始时间' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: '结束时间' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
