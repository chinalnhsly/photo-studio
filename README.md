# 影楼管理系统

基于 NestJS + React + PostgreSQL 的影楼管理系统。

## 技术栈

- 后端：NestJS + TypeScript + PostgreSQL
- 前端：React + TypeScript + Ant Design Pro
- 工具：Prisma + pnpm + TurboRepo

## 开发环境设置

1. 安装依赖
```bash
pnpm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 修改 .env 中的配置
```

3. 启动开发服务器
```bash
# 后端服务器
cd apps/server
pnpm dev

# 前端开发服务器 (新开终端)
cd apps/web
pnpm dev
```

## API 文档

访问 http://localhost:3000/api-docs 查看 Swagger API 文档。

## 目录结构

```
├── apps
│   ├── server          # NestJS 后端
│   └── web             # React 前端
├── packages
│   └── shared          # 共享代码
├── prisma              # 数据库模型
└── package.json
```
