#!/bin/bash
cd mobile-app

# 安装缺失的peer dependencies
yarn add @tarojs/helper@4.0.9
yarn add @tarojs/shared@4.0.9
yarn add postcss@8.4.18

# 安装acorn peer dependency
yarn add acorn@8 --dev

# 更新package.json
cat > package.json << 'EOL'
{
  "name": "mobile-app",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "description": "影楼商城手机前端",
  "resolutions": {
    "acorn": "^8.0.0",
    "@tarojs/helper": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "postcss": "^8.4.18"
  },
  "dependencies": {
    "@reduxjs/toolkit": "1.9.7",
    "@tarojs/components": "4.0.9",
    "@tarojs/helper": "4.0.9",
    "@tarojs/plugin-framework-react": "4.0.9",
    "@tarojs/runtime": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "@tarojs/taro": "4.0.9",
    "postcss": "^8.4.18",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-redux": "8.1.3"
  },
  "devDependencies": {
    "@babel/core": "^7.8.0",
    "@babel/plugin-transform-class-properties": "7.23.3",
    "@types/react": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "6.21.0",
    "@typescript-eslint/parser": "6.21.0",
    "acorn": "^8.0.0",
    "eslint": "8.57.0",
    "typescript": "4.9.5",
    "sass": "1.69.7"
  }
}
EOL

# 删除package-lock.json
rm -f package-lock.json

# 清理并重新安装
yarn cache clean
yarn install --force
