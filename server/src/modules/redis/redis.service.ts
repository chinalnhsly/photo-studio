import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  async get(key: string): Promise<string | null> {
    // TODO: 实现Redis get
    return null;
  }
  async set(key: string, value: string, ttl: number): Promise<void> {
    // TODO: 实现Redis set
  }
  async del(keys: string[]): Promise<void> {
    // TODO: 实现Redis del
  }
}
