#!/bin/bash

echo "正在修复 moment 相关的类型问题..."

# 确保 moment 已正确安装
npm install moment@^2.30.1 --save

# 安装正确的类型定义
npm install @types/moment@^2.13.0 --save-dev

# 创建临时类型声明文件
mkdir -p ./src/types
cat > ./src/types/moment.d.ts << EOL
declare module 'moment' {
  import moment from 'moment';
  export = moment;
  export as namespace moment;
}
EOL

echo "修复完成！请重启开发服务器。"
