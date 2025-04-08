#!/bin/bash

# 为mobile-app创建正确格式的package.json
cat > mobile-app/package.json << 'EOL'
{
  "name": "mobile-app",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "description": "影楼商城手机前端",
  "resolutions": {
    "glob": "^10.3.10",
    "rimraf": "^5.0.0",
    "memfs": "^4.6.0",
    "acorn-import-attributes": "^1.9.5",
    "@swc/core": "^1.4.13",
    "@swc/types": "^0.1.5"
  },
  "dependencies": {
    "@reduxjs/toolkit": "1.9.7",
    "@tarojs/components": "4.0.9",
    "@tarojs/plugin-framework-react": "4.0.9",
    "@tarojs/runtime": "4.0.9",
    "@tarojs/taro": "4.0.9",
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
    "eslint": "8.57.0",
    "typescript": "4.9.5",
    "sass": "1.69.7"
  }
}
EOL

# 为server创建基本的package.json
cat > server/package.json << 'EOL'
{
  "name": "server",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "description": "影楼商城后端服务"
}
EOL

# 清理并重新安装
cd mobile-app
yarn cache clean
yarn install --force
