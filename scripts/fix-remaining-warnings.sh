#!/bin/bash
cd mobile-app

# 删除 package-lock.json 文件
rm -f package-lock.json

# 移除旧的webpack-chain
yarn remove webpack-chain

# 安装所需的确切版本
yarn add acorn@8.11.2 --dev
yarn add @swc/core@1.3.96 --dev
yarn add webpack@5.91.0 --dev

# 添加到 resolutions 以强制指定版本
cat > package.json << 'EOL'
{
  "name": "mobile-app",
  "version": "1.0.0",
  "private": true,
  "description": "影楼商城手机前端",
  "resolutions": {
    "acorn": "^8.11.2",
    "@swc/core": "1.3.96",
    "webpack": "5.91.0",
    "@tarojs/helper": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "postcss": "^8.4.18"
  },
  "dependencies": {
    "@tarojs/components": "4.0.9",
    "@tarojs/helper": "4.0.9",
    "@tarojs/plugin-framework-react": "4.0.9",
    "@tarojs/runtime": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "@tarojs/taro": "4.0.9",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-redux": "8.1.3"
  },
  "devDependencies": {
    "@babel/core": "^7.8.0",
    "@babel/plugin-transform-class-properties": "7.23.3",
    "@swc/core": "1.3.96",
    "@types/react": "^18.0.0",
    "acorn": "^8.11.2",
    "postcss": "^8.4.18",
    "typescript": "4.9.5",
    "webpack": "5.91.0"
  }
}
EOL

# 清理并重新安装
yarn cache clean
rm -rf node_modules
yarn install --force
