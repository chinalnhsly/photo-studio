#!/bin/bash

# 如果修复不起作用，可以考虑从头创建一个简单的演示项目
mkdir -p /home/liyong/photostudio/demo-mini-app
cd /home/liyong/photostudio/demo-mini-app

# 使用Taro CLI创建新项目
npx @tarojs/cli@4.0.9 init .

# 在交互选择中：
# 1. 选择"默认模板"
# 2. 选择"React"框架
# 3. 选择"TypeScript"
# 4. 选择"SCSS"
# 5. 其他选项使用默认值

# 等待安装完成后，运行开发服务器
yarn dev:weapp
