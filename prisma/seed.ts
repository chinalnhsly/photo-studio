/// <reference types="node" />

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // 检查管理员是否已存在
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@gbb.com' }
    });

    if (!existingAdmin) {
      // 创建管理员账户
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await prisma.user.create({
        data: {
          email: 'admin@gbb.com',
          password: hashedPassword,
          name: '系统管理员',
          role: Role.ADMIN,
        },
      });
      
      console.log('管理员账户创建成功！');
    } else {
      console.log('管理员账户已存在！');
    }
  } catch (error) {
    console.error('种子数据创建失败：', error);
    // 使用 NodeJS.Process 类型
    (process as NodeJS.Process).exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  (process as NodeJS.Process).exit(1);
});
