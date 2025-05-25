import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { RefreshToken } from './entities/refresh-token.entity';
import { UserService } from '../user/user.service';
// 修改导入路径，确保导入正确的 User 实体
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = { sub: user.id, username: user.username, role: user.role };
    
    // 生成访问令牌
    const accessToken = this.jwtService.sign(payload);
    
    // 生成刷新令牌
    const refreshToken = await this.generateRefreshToken(user.id);
    
    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };
  }

  async refreshToken(token: string) {
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false }
    });
    
    if (!refreshTokenEntity) {
      throw new UnauthorizedException('无效的刷新令牌');
    }
    
    // 检查令牌是否过期
    if (new Date() > refreshTokenEntity.expiresAt) {
      throw new UnauthorizedException('刷新令牌已过期');
    }
    
    // 将当前的刷新令牌标记为已使用
    refreshTokenEntity.isRevoked = true;
    await this.refreshTokenRepository.save(refreshTokenEntity);
    
    // 获取用户信息
    const user = await this.userService.findOne(refreshTokenEntity.userId);
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    
    // 生成新的令牌
    return this.login(user);
  }

  async generateRefreshToken(userId: number): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.userId = userId;
    refreshToken.token = uuidv4();
    
    // 设置刷新令牌的过期时间为7天
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    refreshToken.expiresAt = expiresAt;
    
    return this.refreshTokenRepository.save(refreshToken);
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token, isRevoked: false }
    });
    
    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepository.save(refreshToken);
    }
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.refreshTokenRepository.update(
      { userId, isRevoked: false },
      { isRevoked: true }
    );
  }
}
