import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddBookingNoteDto {
  @ApiProperty({ description: '备注内容' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: '是否内部备注', default: true })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}
