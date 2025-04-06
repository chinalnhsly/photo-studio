步骤说明：

登录 PostgreSQL 并赋予用户所需权限
确保环境变量配置正确
重新执行数据库迁移

1. 执行 SQL 命令授权
首先登录到 PostgreSQL：
sudo -u postgres psql

在 PostgreSQL 命令行中执行以下命令：

-- 连接到 photostudio 数据库
\c photostudio

-- 赋予所需权限
GRANT ALL ON SCHEMA public TO photostudio;
GRANT ALL ON ALL TABLES IN SCHEMA public TO photostudio;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO photostudio;

2. 更新环境变量server\.env 

3. 重新执行迁移
完成权限设置后，重新执行迁移命令：

cd /home/liyong/photostudio/apps/server
npx prisma migrate dev --name init

如果还遇到问题，可以尝试以下备选方案：

使用超级用户权限

ALTER USER photostudio SUPERUSER;

或者重新创建数据库并指定所有者：

DROP DATABASE IF EXISTS photostudio;
CREATE DATABASE photostudio OWNER photostudio;


