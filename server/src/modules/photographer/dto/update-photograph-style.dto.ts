import { PartialType } from '@nestjs/swagger';
import { CreatePhotographStyleDto } from './create-photograph-style.dto';

/**
 * 更新摄影风格DTO
 * 继承自CreatePhotographStyleDto，所有字段都是可选的
 * 用于更新已有摄影风格的属性
 */
export class UpdatePhotographStyleDto extends PartialType(CreatePhotographStyleDto) {
  // 通过使用PartialType，所有从创建DTO继承的字段都变为可选
  // 这允许API调用者只更新需要修改的特定字段
  
  // 如果有特定于更新操作的字段，可以在这里添加
  // 例如：
  // @ApiProperty({ description: '是否覆盖现有图标', required: false })
  // @IsOptional()
  // @IsBoolean()
  // overrideIcon?: boolean;
}
