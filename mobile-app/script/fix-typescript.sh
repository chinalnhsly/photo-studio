#!/bin/bash

# 确保在项目目录
cd "$(dirname "$0")"

# 清理现有的依赖
rm -rf node_modules
rm -f yarn.lock
rm -rf .taro-cache

# 安装基础依赖
yarn add -D typescript@4.9.5 \
  @tarojs/cli@4.0.9 \
  @tarojs/taro@4.0.9 \
  --exact

# 安装必要的类型定义
yarn add -D @types/node@18.0.0 \
  @types/webpack-env@1.18.4 \
  @types/react@18.2.0 \
  @types/react-dom@18.2.0 \
  --exact

# 安装运行时依赖
yarn add react@18.2.0 \
  react-dom@18.2.0 \
  --exact

# 创建 tsconfig.json
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "jsx": "react-jsx",
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "baseUrl": ".",
    "rootDir": ".",
    "outDir": "lib",
    "sourceMap": true,
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@tarojs/components/types"
    ],
    "types": [
      "@tarojs/taro",
      "webpack-env",
      "node"
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "skipLibCheck": true
  },
  "include": ["src", "types"],
  "exclude": ["node_modules", "dist"]
}
EOL

# 创建自定义类型声明文件
mkdir -p types
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

# 清理 TypeScript 缓存
rm -rf node_modules/.cache/typescript

# 重新安装所有依赖
yarn install

# 检查类型定义
echo "正在验证类型定义..."
yarn tsc --noEmit

echo "TypeScript 环境修复完成！"
