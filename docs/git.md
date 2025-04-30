创建一个新的 GitHub 仓库并上传项目。以下是具体步骤:

#  git初始上传和下载
首先确保你的项目中有正确的 .gitignore 文件：

### [.gitignore](file:///home/liyong/ps/photo-studio/.gitignore)

```gitignore
# dependencies
node_modules
.pnp
.pnp.js

# testing
coverage

# production
build
dist

# misc
.DS_Store
*.pem
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.idea
.vscode

# Prisma
apps/server/prisma/migrations
```

2. 初始化 Git 仓库并添加文件:

```bash
cd /home/liyong/ps/photo-studio

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建第一次提交
git commit -m "Initial commit: Photo Studio Management System"
```

3. 创建 GitHub 仓库:
```bash
# 将你的 GitHub 用户名替换到以下命令中
git remote add origin https://github.com/chinalnhsly@hotmail.com/photo-studio.git

# 推送代码到主分支
git branch -M main
git push -u origin main
```

4. 如果你需要更新 README.md，这里是一个建议的内容：

### [README.md](file:///home/liyong/ps/photo-studio/README.md)

```markdown


已进行更改。

# Photo Studio Management System

A comprehensive management system for photo studios built with NestJS and React.

## Features

- User Authentication & Authorization
- Product Management
- Order Management
- Inventory Management
- Customer Management
- Photography Task Management
- Marketing Campaign Management
- Financial Statistics

## Tech Stack

- Frontend: React 18 + TypeScript + Ant Design Pro
- Backend: NestJS 9 + TypeScript
- Database: PostgreSQL + Redis
- ORM: Prisma
- Package Manager: pnpm
- Monorepo: TurboRepo

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm 8+
- PostgreSQL 14+
- Redis 6+

### Installation

1. Clone the repository
```bash
git clone https://github.com/chinlnhsly/photo-studio.git
cd photo-studio
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp apps/server/.env.example apps/server/.env
# Edit .env with your database credentials
```

4. Generate Prisma client
```bash
cd apps/server
pnpm prisma generate
pnpm prisma db push
```

5. Start development servers
```bash
# From root directory
pnpm dev
```

## Project Structure

```
photo-studio/
├── apps/
│   ├── server/        # NestJS backend
│   └── web/          # React frontend
├── packages/         # Shared packages
├── package.json
└── turbo.json
```

## License

ISC


然后你需要在 GitHub 上:
1. 创建新仓库 "photo-studio"
2. 将本地代码推送到该仓库
3. 在仓库设置中配置适当的访问权限

需要我提供具体的 GitHub 操作步骤吗？

已进行更改。
# git 后期上传方法
以下是每次更新项目并推送到GitHub的简洁操作流程（含版本号管理）：

```bash
# 1. 查看当前仓库状态（可选）
git status

# 2. 添加所有修改文件到暂存区（根据需求选择）
git add .                 # 添加全部修改
# 或
git add 指定文件/目录      # 添加特定文件

# 3. 提交变更（带版本号）
git commit -m "feat: 影楼商城微信小程序构建前端基础项目,在开发者工具和手机端可以预览 [v1.2.0]"  # 示例格式

# 4. 创建版本标签（推荐语义化版本）
git tag v1.2.0        # 格式 v主版本.次版本.修订号

# 5. 推送到远程仓库（同时推送标签）
git push origin main --tags
```

**实用技巧：**

1. **版本号规范建议：**
   ```bash
   # 语义化版本示例
   git tag v1.0.0       # 正式发布
   git tag v1.1.0-beta  # 测试版本
   git tag v1.1.1       # 补丁更新
   ```

2. **简化命令流程：**
   ```bash
   # 创建 ~/.bash_aliases 文件添加：
   alias gp='git add . && git commit -m "Update" && git push origin main'
   
   # 使用时替换真实提交信息
   gp "feat: 新增照片处理功能 [v1.3.0]"
   ```

3. **查看历史版本：**
   ```bash
   git log --oneline --decorate  # 显示带标签的提交历史
   git tag -n                    # 查看所有标签及注释
   ```

4. **撤销错误提交：**
   ```bash
   git reset HEAD~1              # 撤销最后一次提交（保留修改）
   git reset --hard HEAD~1       # 彻底回退到前一个版本
   ```

5. **分支管理策略：**
   ```bash
   git checkout -b feature/new-module  # 创建新功能分支
   git push origin feature/new-module  # 推送功能分支
   ```

**完整工作流示例：**
```bash
# 开发新功能后...
git add src/ new-assets/
git commit -m "feat: 实现智能修图功能 [v1.4.0]"
git tag v1.4.0 -m "新增AI修图核心算法"
git push origin main --tags

# 需要修复紧急BUG时...
git checkout -b hotfix/photo-export
# 修复代码...
git add .
git commit -m "fix: 修正照片导出格式问题 [v1.4.1]"
git tag v1.4.1
git checkout main
git merge hotfix/photo-export
git push origin main --tags
```

**注意事项：**
1. 版本号建议遵循[语义化版本规范](https://semver.org/)
2. 重要版本建议添加标签注释：`git tag -a v1.0.0 -m "正式发布版本"`
3. 使用`.gitignore`文件排除不需要版本控制的文件
4. 定期执行 `git fetch --tags` 同步远程标签

通过这种流程，你可以：
- 每次提交都有清晰的版本记录
- 使用标签快速定位重要版本
- 保持仓库历史整洁可追溯
- 方便团队协作和代码回滚

如果需要更复杂的版本管理，可以结合：
```bash
npm version patch  # 自动升级版本号（适用于Node项目）
```
或使用Git Flow等分支管理模型。