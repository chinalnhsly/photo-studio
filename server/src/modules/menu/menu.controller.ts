import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@ApiTags('menus')
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: '获取所有菜单' })
  @ApiResponse({ status: 200, description: '菜单列表' })
  findAll() {
    return this.menuService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个菜单' })
  @ApiResponse({ status: 200, description: '菜单详情' })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: '创建菜单' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() body: CreateMenuDto) {
    return this.menuService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新菜单' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() body: UpdateMenuDto) {
    return this.menuService.update(Number(id), body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.menuService.remove(Number(id));
  }
}
