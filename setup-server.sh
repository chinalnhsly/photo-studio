#!/bin/bash

cd server

# 初始化NestJS项目
yarn add @nestjs/cli -D
npx nest new . --package-manager yarn --skip-git --skip-install

# 添加必要依赖
yarn add @nestjs/swagger @nestjs/typeorm typeorm pg redis bcrypt class-validator

# 创建环境配置文件
cat > .env << 'EOL'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/photostudio
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
EOL
