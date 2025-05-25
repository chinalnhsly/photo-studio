# 影楼商城系统

## 项目介绍
影楼商城是一个专为摄影工作室设计的线上商城和预约管理系统，包括小程序前端和管理后台。

## 快速开始

### 环境要求
- Node.js v14+
- PostgreSQL 12+
- Redis (可选，用于缓存)

### 安装依赖
```bash
cd server
npm install
```

### 数据库配置
1. 创建 PostgreSQL 数据库
```bash
createdb -U postgres photostudio
```

2. 初始化数据库结构
```bash
./init-db.sh
```

### 启动服务
```bash
# 开发模式
npm run start:dev

# 生产模式
npm run build
npm run start:prod
```

### 访问API文档
启动服务后，访问 http://localhost:3000/api 查看 Swagger API 文档。

## 目录结构
```
server/
├── src/                     # 源代码
│   ├── modules/             # 功能模块
│   │   ├── auth/            # 认证模块
│   │   ├── booking/         # 预约模块
│   │   ├── photographer/    # 摄影师模块
│   │   └── product/         # 商品模块
│   ├── config/              # 配置文件
│   ├── database/            # 数据库相关
│   └── main.ts              # 程序入口
├── test/                    # 测试文件
└── init-db.sh               # 数据库初始化脚本
```

## 项目技术栈
- **后端框架**: NestJS
- **数据库**: PostgreSQL
- **ORM**: TypeORM
- **API文档**: Swagger
- **认证**: JWT

## 开发指南

### 添加新模块
```bash
nest g module modules/new-module
nest g controller modules/new-module
nest g service modules/new-module
```

### 创建数据库实体
1. 在 `src/modules/[module-name]/entities/` 下创建实体文件
2. 在 `src/config/typeorm.config.ts` 中注册实体

### 数据库迁移
```bash
# 生成迁移
npm run migration:generate -- src/migrations/MigrationName

# 运行迁移
npm run migration:run
```

## 常见问题

### Q: 如何修复循环依赖问题？
A: 使用 `import type` 或字符串关系定义可以解决循环依赖。例如：
```typescript
@ManyToOne('User', user => user.bookings)
```

### Q: 如何处理多对多关系？
A: 参考文档：[TypeORM 多对多关系](https://typeorm.io/#/many-to-many-relations)
