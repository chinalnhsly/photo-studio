有几种方式重启 NestJS 服务器：

1. 如果你使用的是开发模式，执行：

```bash
cd /home/liyong/ps/photo-studio/apps/server
pnpm start:dev
```

2. 如果你想重新构建并启动，执行：

```bash
cd /home/liyong/ps/photo-studio/apps/server
pnpm build
pnpm start
```

3. 如果你使用的是 TurboRepo（根据你的项目结构），在项目根目录执行：

```bash
cd /home/liyong/ps/photo-studio
pnpm dev
```

4. 如果需要完全清理并重启：

```bash
cd /home/liyong/ps/photo-studio
# 清理构建缓存
pnpm clean

# 重新安装依赖
pnpm install

# 重新生成 Prisma Client
cd apps/server
pnpm prisma generate

# 启动开发服务器
pnpm start:dev
```

推荐使用开发模式 (`pnpm start:dev`)，因为它支持热重载，当你修改代码时会自动重启服务器。