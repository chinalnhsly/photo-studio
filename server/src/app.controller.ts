import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// 修复导入路径，确保指向正确位置
import { AppService } from './app.service';

@ApiTags('系统')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '健康检查', description: '返回服务器状态信息' })
  getHello(): { status: string; version: string; timestamp: number } {
    return this.appService.getStatus();
  }
}
