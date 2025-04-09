#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

echo "=== 尝试替代修复方案 ==="

# 使用 npm 而不是 yarn
npm cache clean --force
rm -rf node_modules
npm install webpack webpack-cli --save-dev
npm install

# 尝试使用全局安装的 webpack
echo "export PATH=\$PATH:./node_modules/.bin" >> ~/.bashrc
source ~/.bashrc

echo "修复完成，请重启终端并重试"
