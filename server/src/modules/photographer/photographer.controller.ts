import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PhotographerService } from './photographer.service';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';
import { Photographer } from './entities/photographer.entity';

@ApiTags('photographers')
@Controller('photographers')
export class PhotographerController {
  constructor(private readonly photographerService: PhotographerService) {}

  @Post()
  @ApiOperation({ summary: '创建摄影师' })
  @ApiResponse({ status: 201, description: '创建成功', type: Photographer })
  create(@Body() createPhotographerDto: CreatePhotographerDto) {
    return this.photographerService.create(createPhotographerDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有摄影师' })
  @ApiResponse({ status: 200, description: '成功', type: [Photographer] })
  findAll() {
    return this.photographerService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: '获取所有可用的摄影师' })
  @ApiResponse({ status: 200, description: '成功', type: [Photographer] })
  getAvailable() {
    return this.photographerService.getAvailablePhotographers();
  }

  @Get('search')
  @ApiOperation({ summary: '搜索摄影师' })
  @ApiResponse({ status: 200, description: '成功', type: [Photographer] })
  search(@Query('query') query: string) {
    return this.photographerService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定ID的摄影师' })
  @ApiResponse({ status: 200, description: '成功', type: Photographer })
  @ApiResponse({ status: 404, description: '摄影师不存在' })
  findOne(@Param('id') id: string) {
    return this.photographerService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新摄影师信息' })
  @ApiResponse({ status: 200, description: '更新成功', type: Photographer })
  @ApiResponse({ status: 404, description: '摄影师不存在' })
  update(
    @Param('id') id: string, 
    @Body() updatePhotographerDto: UpdatePhotographerDto
  ) {
    return this.photographerService.update(+id, updatePhotographerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除摄影师' })
  @ApiResponse({ status: 200, description: '删除成功' })
  @ApiResponse({ status: 404, description: '摄影师不存在' })
  remove(@Param('id') id: string) {
    return this.photographerService.remove(+id);
  }
}
