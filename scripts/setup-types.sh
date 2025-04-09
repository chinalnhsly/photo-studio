#!/bin/bash

# 使用绝对路径
cd /home/liyong/photostudio/mobile-app

# 清理已有的类型定义包
yarn remove @types/node @types/jest @types/webpack-env @types/react @types/react-dom

# 重新安装类型定义包
yarn add -D @types/node@18.0.0 \
         @types/jest@29.5.11 \
         @types/webpack-env@1.18.3 \
         @types/react@18.0.0 \
         @types/react-dom@18.0.0

# 安装其他必要的依赖
yarn add -D typescript@5.0.4
