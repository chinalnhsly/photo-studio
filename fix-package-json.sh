#!/bin/bash

echo "=== 修复package.json中的命令定义 ==="

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

# 检查并修复scripts部分
cat > fix-scripts.js << 'EOF'
const fs = require('fs');
const path = require('path');

// 读取package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
let packageJson;

try {
  const packageData = fs.readFileSync(packageJsonPath, 'utf8');
  packageJson = JSON.parse(packageData);
} catch (err) {
  console.error('读取package.json失败:', err);
  process.exit(1);
}

// 确保scripts对象存在
packageJson.scripts = packageJson.scripts || {};

// 添加或更新必要的命令
const requiredScripts = {
  "build:weapp": "taro build --type weapp",
  "dev:weapp": "taro build --type weapp --watch",
  "build:h5": "taro build --type h5",
  "dev:h5": "taro build --type h5 --watch",
  "dev": "npm run dev:weapp"
};

// 更新scripts
let hasChanges = false;
Object.entries(requiredScripts).forEach(([key, value]) => {
  if (!packageJson.scripts[key]) {
    packageJson.scripts[key] = value;
    hasChanges = true;
    console.log(`添加命令: ${key}`);
  }
});

if (hasChanges) {
  // 写回package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('package.json已更新');
} else {
  console.log('package.json无需修改');
}
EOF

# 执行脚本
node fix-scripts.js

# 清理临时文件
rm fix-scripts.js

echo "=== 脚本修复完成 ==="
echo "现在尝试运行正确的命令:"
echo "yarn dev:weapp   # 开发模式"
echo "yarn build:weapp # 生产构建"
