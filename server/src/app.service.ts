import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus(): { status: string; version: string; timestamp: number } {
    return {
      status: 'ok',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: Date.now()
    };
  }
}
