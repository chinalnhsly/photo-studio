#!/bin/bash

echo "=== 修复Taro运行时错误 ==="

cd /home/liyong/photostudio/mobile-app

# 1. 创建资源目录
mkdir -p assets/icons

# 2. 创建基本图标文件（如果不存在）
if [ ! -f "assets/icons/home.png" ]; then
  echo "创建占位图标..."
  touch assets/icons/home.png
  touch assets/icons/home-active.png
  touch assets/icons/category.png 
  touch assets/icons/category-active.png
  touch assets/icons/user.png
  touch assets/icons/user-active.png
fi

# 3. 确保项目使用合适的依赖版本
cat > fix-dependencies.js << 'EOF'
const fs = require('fs');
const path = require('path');

try {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // 确保所有Taro依赖使用匹配的版本
  const taroVersion = '3.6.8'; // 使用较稳定的中间版本
  
  const taroPackages = [
    '@tarojs/cli',
    '@tarojs/components', 
    '@tarojs/plugin-framework-react',
    '@tarojs/react',
    '@tarojs/runtime',
    '@tarojs/taro',
    '@tarojs/webpack5-runner',
    '@tarojs/plugin-platform-weapp'
  ];

  let hasChanges = false;
  
  taroPackages.forEach(pkg => {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      packageJson.dependencies[pkg] = taroVersion;
      hasChanges = true;
    }
    if (packageJson.devDependencies && packageJson.devDependencies[pkg]) {
      packageJson.devDependencies[pkg] = taroVersion;
      hasChanges = true;
    }
  });
  
  if (hasChanges) {
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('package.json 已更新为统一的Taro版本');
  }
} catch (error) {
  console.error('修改package.json失败:', error);
}
EOF

node fix-dependencies.js
rm fix-dependencies.js

# 4. 修改project.config.json，确保设置了正确的appid和基础库版本
if [ -f "project.config.json" ]; then
  cat > update-project-config.js << 'EOF'
  const fs = require('fs');
  const path = require('path');
  
  try {
    const configPath = path.join(process.cwd(), 'project.config.json');
    const projectConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // 设置正确的基础库版本
    projectConfig.setting = projectConfig.setting || {};
    projectConfig.setting.minified = true;
    projectConfig.setting.es6 = true;
    projectConfig.setting.enhance = true;
    
    // 确保使用较新的基础库版本
    projectConfig.libVersion = '3.0.2';
    
    fs.writeFileSync(configPath, JSON.stringify(projectConfig, null, 2));
    console.log('project.config.json 已更新');
  } catch (error) {
    console.error('修改project.config.json失败:', error);
  }
EOF

  node update-project-config.js
  rm update-project-config.js
fi

# 5. 清理缓存
rm -rf .temp .cache dist

# 6. 使用产品模式构建，减少开发模式的问题
echo "=== 开始使用生产模式构建 ==="
NODE_ENV=production yarn build:weapp

echo "=== 修复完成 ==="
echo "请尝试在微信开发者工具中打开项目 dist 目录"
echo "如果仍然有问题，请尝试在开发者工具中: 详情 -> 本地设置 -> 调试基础库 选择 2.25.3 或更高版本"
