import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, Like } from 'typeorm';
import { Member } from './entities/member.entity';
import { MemberLevel } from './entities/member-level.entity';
import { PointLog } from './entities/point-log.entity';
import { User } from '../user/entities/user.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AddPointsDto } from './dto/add-points.dto';
import { PointLogType } from './enums/point-log-type.enum';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(MemberLevel)
    private readonly levelRepository: Repository<MemberLevel>,
    @InjectRepository(PointLog)
    private readonly pointLogRepository: Repository<PointLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(options: any = {}) {
    const {
      page = 1,
      limit = 10,
      username,
      levelId,
      isActive,
      sortField,
      sortOrder,
    } = options;

    const queryBuilder = this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user')
      .leftJoinAndSelect('member.level', 'level');

    // 根据用户名搜索
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', { username: `%${username}%` });
    }

    // 根据会员等级过滤
    if (levelId) {
      queryBuilder.andWhere('member.levelId = :levelId', { levelId });
    }

    // 根据会员状态过滤
    if (isActive !== undefined) {
      queryBuilder.andWhere('member.isActive = :isActive', { isActive });
    }

    // 排序
    if (sortField) {
      const direction = sortOrder === 'ascend' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`member.${sortField}`, direction);
    } else {
      queryBuilder.orderBy('member.createdAt', 'DESC');
    }

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    };
  }

  async findOne(id: number) {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['user', 'level'],
    });

    if (!member) {
      throw new NotFoundException(`会员ID ${id} 不存在`);
    }

    return member;
  }

  async create(createMemberDto: CreateMemberDto) {
    const { userId, levelId, ...rest } = createMemberDto;

    // 检查用户是否存在
    let user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`用户ID ${userId} 不存在`);
    }

    // 检查用户是否已经是会员
    const existingMember = await this.memberRepository.findOne({
      where: { userId },
    });

    if (existingMember) {
      throw new BadRequestException(`用户ID ${userId} 已经是会员`);
    }

    // 检查会员等级是否存在
    let level = null;
    if (levelId) {
      level = await this.levelRepository.findOne({ where: { id: levelId } });
      if (!level) {
        throw new NotFoundException(`会员等级ID ${levelId} 不存在`);
      }
    }

    // 创建会员
    const member = this.memberRepository.create({
      ...rest,
      userId,
      level,
    });

    return this.memberRepository.save(member);
  }

  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const member = await this.findOne(id);

    // 更新会员等级
    if (updateMemberDto.levelId !== undefined) {
      if (updateMemberDto.levelId) {
        const level = await this.levelRepository.findOne({
          where: { id: updateMemberDto.levelId },
        });
        if (!level) {
          throw new NotFoundException(`会员等级ID ${updateMemberDto.levelId} 不存在`);
        }
        member.level = level;
      } else {
        member.level = null;
      }
      delete updateMemberDto.levelId;
    }

    // 更新其他字段
    Object.assign(member, updateMemberDto);

    return this.memberRepository.save(member);
  }

  async remove(id: number) {
    const member = await this.findOne(id);
    return this.memberRepository.remove(member);
  }

  async addPoints(id: number, addPointsDto: AddPointsDto) {
    const { points, description, type } = addPointsDto;
    const member = await this.findOne(id);

    // 记录积分余额
    const balanceBefore = member.points;
    
    // 更新会员积分
    member.points += points;
    if (member.points < 0) {
      member.points = 0; // 积分不能为负数
    }
    
    await this.memberRepository.save(member);
    
    // 创建积分记录
    const pointLog = this.pointLogRepository.create({
      memberId: id,
      points,
      type,
      description,
      balanceBefore,
      balanceAfter: member.points,
    });
    
    await this.pointLogRepository.save(pointLog);
    
    return member;
  }

  async getPoints(id: number) {
    const member = await this.findOne(id);
    return { points: member.points };
  }

  async getPointLogs(id: number, options: any = {}) {
    const { page = 1, limit = 10, startDate, endDate, type } = options;
    
    await this.findOne(id); // 确保会员存在
    
    const queryBuilder = this.pointLogRepository
      .createQueryBuilder('pointLog')
      .where('pointLog.memberId = :memberId', { memberId: id })
      .leftJoinAndSelect('pointLog.member', 'member');
    
    if (startDate) {
      queryBuilder.andWhere('pointLog.createdAt >= :startDate', { startDate });
    }
    
    if (endDate) {
      queryBuilder.andWhere('pointLog.createdAt <= :endDate', { endDate });
    }
    
    if (type) {
      queryBuilder.andWhere('pointLog.type = :type', { type });
    }
    
    queryBuilder.orderBy('pointLog.createdAt', 'DESC');
    
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    
    const [items, total] = await queryBuilder.getManyAndCount();
    
    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    };
  }

  async getMemberLevels() {
    return this.levelRepository.find({
      order: { minimumPoints: 'ASC' },
    });
  }

  async createMemberLevel(createLevelDto: any) {
    const level = this.levelRepository.create(createLevelDto);
    return this.levelRepository.save(level);
  }

  async updateMemberLevel(id: number, updateLevelDto: any) {
    const level = await this.levelRepository.findOne({ where: { id } });
    
    if (!level) {
      throw new NotFoundException(`会员等级ID ${id} 不存在`);
    }
    
    Object.assign(level, updateLevelDto);
    return this.levelRepository.save(level);
  }

  async deleteMemberLevel(id: number) {
    const level = await this.levelRepository.findOne({ 
      where: { id },
      relations: ['members']
    });
    
    if (!level) {
      throw new NotFoundException(`会员等级ID ${id} 不存在`);
    }
    
    // 检查是否有会员使用此等级
    if (level.members && level.members.length > 0) {
      throw new BadRequestException(`无法删除会员等级: 此等级下有 ${level.members.length} 名会员`);
    }
    
    return this.levelRepository.remove(level);
  }

  async getStats() {
    // 获取当前日期
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    
    // 上个月的范围
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0);
    
    // 获取总会员数
    const totalMembers = await this.memberRepository.count();
    
    // 本月新增会员数
    const newMembersThisMonth = await this.memberRepository.count({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
      },
    });
    
    // 上月新增会员数
    const newMembersLastMonth = await this.memberRepository.count({
      where: {
        createdAt: Between(startOfLastMonth, endOfLastMonth),
      },
    });
    
    // 会员增长率
    const membersGrowthRate = newMembersLastMonth > 0 
      ? ((newMembersThisMonth - newMembersLastMonth) / newMembersLastMonth) * 100 
      : 0;
    
    // 本月活跃会员
    const activeMembersThisMonth = await this.memberRepository.count({
      where: {
        isActive: true,
        lastActivityDate: Between(startOfMonth, endOfMonth),
      },
    });
    
    // 平均消费金额
    const result = await this.memberRepository
      .createQueryBuilder('member')
      .select('AVG(member.totalSpent)', 'avgSpent')
      .getRawOne();
    
    const averageSpentAmount = result.avgSpent ? parseFloat(result.avgSpent) : 0;
    
    // 计算上月平均消费额
    const lastMonthResult = await this.memberRepository
      .createQueryBuilder('member')
      .select('AVG(CASE WHEN member.lastPurchaseDate BETWEEN :start AND :end THEN member.totalSpent ELSE 0 END)', 'avgSpent')
      .setParameters({
        start: startOfLastMonth,
        end: endOfLastMonth,
      })
      .getRawOne();
    
    const lastMonthAvgSpent = lastMonthResult.avgSpent ? parseFloat(lastMonthResult.avgSpent) : 0;
    
    // 消费增长率
    const spendingGrowthRate = lastMonthAvgSpent > 0 
      ? ((averageSpentAmount - lastMonthAvgSpent) / lastMonthAvgSpent) * 100 
      : 0;
    
    return {
      totalMembers,
      newMembersThisMonth,
      activeMembersThisMonth,
      averageSpentAmount,
      membersGrowthRate,
      spendingGrowthRate,
    };
  }

  async updateMemberStatus(id: number, isActive: boolean) {
    const member = await this.findOne(id);
    member.isActive = isActive;
    return this.memberRepository.save(member);
  }
}
