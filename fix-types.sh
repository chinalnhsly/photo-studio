#!/bin/bash

echo "=== 修复类型问题 ==="
cd admin-web

# 安装类型依赖
echo "安装关键类型依赖..."
npm install --save-dev @types/webpack@4.41.32 @umijs/preset-react@1.8.32

# 清除 TypeScript 缓存
echo "清除 TypeScript 缓存..."
rm -rf node_modules/.cache/typescript

# 创建类型覆盖文件
echo "创建临时类型修复..."
cat > temp-fix.js << 'EOF'
const fs = require('fs');
const path = require('path');

// 修复 .umirc.ts
const umircPath = path.resolve('./.umirc.ts');
let umircContent = fs.readFileSync(umircPath, 'utf8');
umircContent = umircContent.replace(
  /\/\/ 直接使用defineConfig.*\nimport routes/,
  "import { defineConfig } from '@umijs/preset-react';\nimport routes"
);
umircContent = umircContent.replace(
  /import webpack from ['"]webpack['"];/,
  "const webpack = require('webpack');"
);
fs.writeFileSync(umircPath, umircContent);

// 添加硬编码的 webpack ProvidePlugin 提供
const webpackTypesDir = path.resolve('./src/typings');
if (!fs.existsSync(webpackTypesDir)) {
  fs.mkdirSync(webpackTypesDir, { recursive: true });
}

console.log('类型修复完成！');
EOF

# 执行类型修复脚本
node temp-fix.js
rm temp-fix.js

echo "=== 修复完成 ==="
echo "请重新运行开发服务器: npm run start:admin"
