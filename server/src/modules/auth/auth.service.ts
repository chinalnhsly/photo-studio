import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('用户名不存在');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    // 更新最后登录时间
    await this.usersRepository.update(
      { id: user.id },
      { lastLogin: new Date() }
    );
    
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    
    // 创建刷新令牌
    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天过期
    
    await this.refreshTokenRepository.save({
      token: refreshToken,
      userId: user.id,
      expiresAt,
    });
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        avatar: user.avatar
      }
    };
  }

  async register(userData: any) {
    // 检查用户是否已存在
    const existingUser = await this.usersRepository.findOne({ 
      where: [
        { username: userData.username },
        { email: userData.email }
      ] 
    });
    
    if (existingUser) {
      throw new UnauthorizedException('用户名或邮箱已存在');
    }
    
    // 验证邮箱格式
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (userData.email && !emailRegex.test(userData.email)) {
      throw new UnauthorizedException('邮箱格式不正确');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // 创建新用户
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'user', // 默认角色
      isActive: true,
      avatar: userData.avatar || 'https://example.com/default-avatar.jpg'
    });
    
    return this.usersRepository.save(newUser);
  }

  // 新增方法: refreshToken
  async refreshToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user'],
    });
    
    if (!tokenEntity) {
      throw new UnauthorizedException('无效的刷新令牌');
    }
    
    if (new Date() > tokenEntity.expiresAt) {
      throw new UnauthorizedException('刷新令牌已过期');
    }
    
    const user = await this.usersRepository.findOne({
      where: { id: tokenEntity.userId }
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    };
  }

  // 新增方法: revokeRefreshToken
  async revokeRefreshToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken }
    });
    
    if (!tokenEntity) {
      throw new NotFoundException('令牌不存在');
    }
    
    tokenEntity.isRevoked = true;
    await this.refreshTokenRepository.save(tokenEntity);
    
    return { message: '令牌已成功撤销' };
  }
}
