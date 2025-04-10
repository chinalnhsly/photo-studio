#!/bin/bash

echo "=== 开始全面修复Taro项目 ==="

cd /home/liyong/photostudio/mobile-app

# 备份当前package.json
cp package.json package.json.bak

# 完全重装依赖
rm -rf node_modules yarn.lock
npm cache clean --force

# 确保全局安装了Taro CLI
echo "安装Taro CLI..."
npm install -g @tarojs/cli

# 重新安装依赖
echo "安装依赖..."
yarn install

# 重新初始化脚本配置
cat > package.json << 'EOF'
{
  "name": "photostudio-mobile",
  "version": "1.0.0",
  "private": true,
  "description": "影楼商城小程序",
  "main": "index.js",
  "scripts": {
    "build:weapp": "taro build --type weapp",
    "build:swan": "taro build --type swan",
    "build:alipay": "taro build --type alipay",
    "build:tt": "taro build --type tt",
    "build:h5": "taro build --type h5",
    "build:rn": "taro build --type rn",
    "build:qq": "taro build --type qq",
    "build:jd": "taro build --type jd",
    "build:quickapp": "taro build --type quickapp",
    "dev:weapp": "npm run build:weapp -- --watch",
    "dev:swan": "npm run build:swan -- --watch",
    "dev:alipay": "npm run build:alipay -- --watch",
    "dev:tt": "npm run build:tt -- --watch",
    "dev:h5": "npm run build:h5 -- --watch",
    "dev:rn": "npm run build:rn -- --watch",
    "dev:qq": "npm run build:qq -- --watch",
    "dev:jd": "npm run build:jd -- --watch",
    "dev:quickapp": "npm run build:quickapp -- --watch"
  },
  "browserslist": [
    "last 3 versions",
    "Android >= 4.1",
    "ios >= 8"
  ],
  "author": "",
  "dependencies": {
    "@babel/runtime": "^7.7.7",
    "@tarojs/components": "4.0.9",
    "@tarojs/helper": "4.0.9",
    "@tarojs/plugin-framework-react": "4.0.9",
    "@tarojs/plugin-platform-weapp": "4.0.9",
    "@tarojs/react": "4.0.9",
    "@tarojs/router": "4.0.9",
    "@tarojs/runtime": "4.0.9",
    "@tarojs/shared": "4.0.9",
    "@tarojs/taro": "4.0.9",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.8.0",
    "@tarojs/cli": "4.0.9",
    "@tarojs/webpack5-runner": "4.0.9",
    "@types/react": "^18.0.0",
    "@types/webpack-env": "^1.13.6",
    "babel-preset-taro": "4.0.9",
    "eslint": "^8.12.0",
    "eslint-config-taro": "4.0.9",
    "eslint-plugin-import": "^2.12.0",
    "eslint-plugin-react": "^7.8.2",
    "eslint-plugin-react-hooks": "^4.2.0",
    "stylelint": "^14.4.0",
    "webpack": "5.78.0"
  }
}
EOF

echo "=== 设置完成 ==="
echo "现在尝试运行:"
echo "yarn dev:weapp"
