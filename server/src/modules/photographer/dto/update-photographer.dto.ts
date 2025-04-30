import { PartialType } from '@nestjs/swagger';
import { CreatePhotographerDto } from './create-photographer.dto';

/**
 * 更新摄影师DTO
 * 继承自CreatePhotographerDto，所有字段都是可选的
 */
export class UpdatePhotographerDto extends PartialType(CreatePhotographerDto) {
  // 通过使用PartialType，所有字段都变为可选
  // 这意味着在更新操作中，只需提供要修改的字段即可
  
  // 如果有任何特定于更新操作的额外字段，可以在这里添加
  // 例如：
  // @ApiProperty({ description: '更新原因', required: false })
  // @IsOptional()
  // @IsString()
  // updateReason?: string;
}
