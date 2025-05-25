import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PermissionService } from './permission.service';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ApiOperation({ summary: '获取所有权限资源' })
  @ApiResponse({ status: 200, description: '权限资源列表' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个权限资源' })
  @ApiResponse({ status: 200, description: '权限资源详情' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: '创建权限资源' })
  @ApiResponse({ status: 201, description: '创建成功' })
  create(@Body() body) {
    return this.permissionService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新权限资源' })
  @ApiResponse({ status: 200, description: '更新成功' })
  update(@Param('id') id: string, @Body() body) {
    return this.permissionService.update(Number(id), body);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除权限资源' })
  @ApiResponse({ status: 200, description: '删除成功' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(Number(id));
  }
}
