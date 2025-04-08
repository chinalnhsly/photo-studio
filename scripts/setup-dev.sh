#!/bin/bash

# 安装全局依赖
yarn global add @tarojs/cli@4.0.9 typescript@5.0.4

# 初始化移动端项目
cd mobile-app
yarn install
yarn add -D @tarojs/mini-runner@4.0.9 @tarojs/webpack-runner@4.0.9

# 创建开发环境配置文件
cat > .env.development << 'EOL'
# API 配置
TARO_APP_API_URL=http://localhost:3000
TARO_APP_ENV=development

# 微信小程序配置
TARO_APP_ID=your_app_id_here
EOL

# 创建生产环境配置文件
cat > .env.production << 'EOL'
# API 配置
TARO_APP_API_URL=https://api.yourdomain.com
TARO_APP_ENV=production

# 微信小程序配置
TARO_APP_ID=your_app_id_here
EOL

# 创建VSCode工作区配置
cd ..
cat > photostudio.code-workspace << 'EOL'
{
  "folders": [
    {
      "name": "移动端",
      "path": "mobile-app"
    },
    {
      "name": "服务端",
      "path": "server"
    },
    {
      "name": "文档",
      "path": "docs"
    }
  ],
  "settings": {
    "typescript.tsdk": "node_modules/typescript/lib",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
  }
}
EOL

echo "开发环境配置完成!"
