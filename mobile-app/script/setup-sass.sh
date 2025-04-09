#!/bin/bash

# 清理现有依赖
rm -rf node_modules
rm -f yarn.lock

# 安装 sass 相关依赖
yarn add sass@^1.69.7 sass-loader@^13.3.0 --exact

# 创建必要的样式文件
mkdir -p src/styles

# 创建全局样式文件
cat > src/app.scss << 'EOL'
page {
  background-color: #f5f5f5;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}
EOL

# 重新安装所有依赖
yarn install

# 启动开发服务器
yarn dev:weapp
