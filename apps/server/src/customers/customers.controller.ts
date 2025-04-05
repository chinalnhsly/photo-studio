import { 
  Controller, Get, Post, Body, Patch, Param, Delete, 
  Query, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CustomersService } from './customers.service';
import { 
  CreateCustomerDto, 
  UpdateCustomerDto, 
  CustomerFilterDto 
} from './dto/customer.dto';

@ApiTags('客户管理')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: '创建客户' })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: '获取客户列表' })
  findAll(@Query() filters: CustomerFilterDto) {
    return this.customersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取客户详情' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: '获取客户统计数据' })
  getCustomerStats(@Param('id') id: string) {
    return this.customersService.getCustomerStats(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新客户信息' })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除客户' })
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
