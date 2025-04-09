#!/bin/bash

# 清理环境
rm -rf node_modules
rm -f yarn.lock

# 按照特定版本安装所有必要的类型定义
yarn add -D @types/node@18.0.0 \
  @types/webpack-env@1.18.4 \
  @types/react@18.2.0 \
  @types/react-dom@18.2.0 \
  typescript@5.0.4 \
  --exact

# 创建专门的类型定义目录
mkdir -p types

# 创建全局声明文件
cat > types/global.d.ts << 'EOL'
/// <reference types="@tarojs/taro" />
/// <reference types="node" />
/// <reference types="webpack-env" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
EOL

# 重新构建
yarn dev:weapp
