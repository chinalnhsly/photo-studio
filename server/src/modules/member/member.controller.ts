import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AddMemberPointsDto } from './dto/add-member-points.dto';
import { CreateMemberLevelDto } from './dto/create-member-level.dto';
import { CreateLevelDto } from './dto/create-level.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('会员管理')
@Controller('members')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建会员' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有会员' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('levelId') levelId?: number,
    @Query('search') search?: string,
    @Query('isActive') isActive?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
  ) {
    return this.memberService.findAll({
      page,
      limit,
      levelId,
      search,
      isActive,
      sortBy,
      sortOrder,
    });
  }

  @Get('me')
  @ApiOperation({ summary: '获取当前会员信息' })
  async getCurrentMember(@Req() req) {
    return this.memberService.findOneByUserId(req.user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: '获取会员统计数据' })
  async getMemberStats() {
    return this.memberService.getMemberStats();
  }

  @Get('levels')
  @ApiOperation({ summary: '获取所有会员等级' })
  async getLevels() {
    return this.memberService.findAllLevels();
  }

  @Post('levels')
  @ApiOperation({ summary: '创建会员等级' })
  async createLevel(@Body() createLevelDto: CreateLevelDto) {
    return this.memberService.createLevel(createLevelDto);
  }

  @Put('levels/:id')
  @ApiOperation({ summary: '更新会员等级' })
  async updateLevel(
    @Param('id') id: number,
    @Body() updateLevelDto: Partial<CreateLevelDto>,
  ) {
    return this.memberService.updateLevel(id, updateLevelDto);
  }

  @Delete('levels/:id')
  @ApiOperation({ summary: '删除会员等级' })
  async deleteLevel(@Param('id') id: number) {
    return this.memberService.removeLevel(id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取会员详情' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async findOne(@Param('id') id: string) {
    return this.memberService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新会员信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除会员' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }

  @Post(':id/points')
  @ApiOperation({ summary: '调整会员积分' })
  async adjustPoints(
    @Param('id') id: number,
    @Body() addPointsDto: AddMemberPointsDto,
  ) {
    return this.memberService.addPoints(id, addPointsDto);
  }

  @Get(':id/points')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取会员积分记录' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getPointLogs(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.memberService.getPointLogs(+id, { page, limit });
  }

  @Post(':id/cards')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建会员卡' })
  @ApiResponse({ status: 201, description: '创建成功' })
  async createMemberCard(
    @Param('id') id: string,
    @Body() cardData: any,
  ) {
    return this.memberService.createMemberCard(+id, cardData);
  }

  @Get(':id/cards')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取会员的会员卡' })
  @ApiResponse({ status: 200, description: '获取成功' })
  async getMemberCards(@Param('id') id: string) {
    return this.memberService.getMemberCards(+id);
  }

  @Patch('cards/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新会员卡' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateMemberCard(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.memberService.updateMemberCard(+id, updateData);
  }
}
