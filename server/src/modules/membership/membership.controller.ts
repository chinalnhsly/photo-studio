import { Controller, Get, Post, Body, Query, UseGuards, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MembershipService } from './membership.service';
import { User } from '../auth/decorators/user.decorator';
import { UpdateBirthdayDto } from './dto/update-birthday.dto';
import { AdjustPointsDto } from './dto/adjust-points.dto';

@ApiTags('membership')
@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Get('levels')
  @ApiOperation({ summary: '获取所有会员等级' })
  @ApiResponse({ status: 200, description: '返回会员等级列表' })
  async getAllMemberLevels() {
    const levels = await this.membershipService.getAllMemberLevels();
    return {
      code: 200,
      message: '获取成功',
      data: levels
    };
  }

  @Get('my-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户的会员信息' })
  @ApiResponse({ status: 200, description: '返回会员信息' })
  async getUserMembership(@User() user) {
    const membership = await this.membershipService.getUserMembership(user.id);
    return {
      code: 200,
      message: '获取成功',
      data: membership
    };
  }

  @Get('points/records')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取积分记录' })
  @ApiQuery({ name: 'page', description: '页码', required: false })
  @ApiQuery({ name: 'limit', description: '每页数量', required: false })
  @ApiResponse({ status: 200, description: '返回积分记录' })
  async getUserPointRecords(
    @User() user,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const { records, total } = await this.membershipService.getUserPointRecords(
      user.id,
      page,
      limit
    );
    
    return {
      code: 200,
      message: '获取成功',
      data: records,
      pagination: {
        total,
        page,
        limit
      }
    };
  }

  @Put('birthday')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户生日信息' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateUserBirthday(
    @User() user,
    @Body() updateBirthdayDto: UpdateBirthdayDto
  ) {
    const membership = await this.membershipService.updateUserBirthday(
      user.id,
      new Date(updateBirthdayDto.birthday)
    );
    
    return {
      code: 200,
      message: '生日信息更新成功',
      data: membership
    };
  }

  @Post('points/adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '管理员调整用户积分' })
  @ApiResponse({ status: 200, description: '调整成功' })
  async adjustUserPoints(
    @Body() adjustPointsDto: AdjustPointsDto
  ) {
    const { userId, points, description } = adjustPointsDto;
    
    let result;
    if (points > 0) {
      result = await this.membershipService.addPoints(
        userId,
        points,
        'adjust',
        description || '管理员调整'
      );
    } else {
      result = await this.membershipService.spendPoints(
        userId,
        Math.abs(points),
        description || '管理员调整'
      );
    }
    
    return {
      code: 200,
      message: '积分调整成功',
      data: result
    };
  }
  
  @Get('birthday-check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '检查用户是否有生日特权' })
  @ApiResponse({ status: 200, description: '返回检查结果' })
  async checkBirthdayPrivilege(@User() user) {
    const hasBirthdayPrivilege = await this.membershipService.checkBirthdayPrivilege(user.id);
    
    return {
      code: 200,
      message: '检查成功',
      data: {
        hasBirthdayPrivilege
      }
    };
  }
}
