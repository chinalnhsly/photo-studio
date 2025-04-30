#!/bin/bash

echo "更新依赖以解决 React 警告问题..."

# 更新 antd 到修复 findDOMNode 警告的最新兼容版本
npm install antd@4.24.10 --save

# 更新 rc-motion 以减少 findDOMNode 警告
npm install rc-motion@^2.6.2 --save

# 安装 @ant-design/pro-components 兼容版本
npm install @ant-design/pro-components@^2.3.57 --save

echo "安装完成！现在请重启开发服务器。"
