#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

echo "===== SWC 修复脚本 ====="
echo "这个脚本将修复 SWC 相关的依赖问题"

# 检查系统信息
PLATFORM=$(node -e "console.log(process.platform)")
ARCH=$(node -e "console.log(process.arch)")
echo "检测到系统: $PLATFORM $ARCH"

# 步骤1: 清理现有依赖
echo "正在清理旧的依赖..."
rm -rf node_modules yarn.lock

# 步骤2: 安装SWC依赖
echo "安装SWC核心依赖..."
yarn add --ignore-platform @swc/core-linux-x64-gnu @swc/core @swc/helpers
yarn add -D @swc/cli

# 步骤3: 创建SWC配置文件
echo "创建.swcrc配置文件..."
cat > .swcrc << 'EOL'
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "target": "es5"
  }
}
EOL

# 步骤4: 更新package.json添加postinstall脚本
echo "更新package.json..."
# 使用临时文件来避免直接修改package.json的问题
if [ -f "package.json" ]; then
  # 检查是否已存在scripts部分
  if grep -q "\"scripts\"" package.json; then
    # 检查是否已存在postinstall脚本
    if grep -q "\"postinstall\"" package.json; then
      echo "postinstall脚本已存在，跳过..."
    else
      # 备份原始package.json
      cp package.json package.json.bak
      # 使用node添加postinstall脚本
      node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.scripts = pkg.scripts || {};
        pkg.scripts.postinstall = 'swc --version || yarn add --ignore-platform @swc/core-linux-x64-gnu';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
      "
      echo "已添加postinstall脚本"
    fi
  else
    # 如果没有scripts部分，添加整个scripts部分
    cp package.json package.json.bak
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      pkg.scripts = { postinstall: 'swc --version || yarn add --ignore-platform @swc/core-linux-x64-gnu' };
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
    echo "已添加scripts部分和postinstall脚本"
  fi
else
  echo "错误: 找不到package.json文件"
  exit 1
fi

# 步骤5: 重新安装所有依赖
echo "重新安装所有依赖..."
yarn install

# 步骤6: 验证SWC是否正确安装
echo "验证SWC安装..."
if yarn swc --version > /dev/null 2>&1; then
  SWC_VERSION=$(yarn swc --version 2>&1)
  echo "✅ SWC安装成功! 版本: $SWC_VERSION"
else
  echo "⚠️ SWC安装可能有问题，尝试备选方案..."
  
  # 备选方案：使用Babel
  echo "===== 备选方案: 切换到Babel ====="
  
  # 移除SWC相关依赖
  echo "移除SWC相关依赖..."
  yarn remove @swc/core @swc/cli @swc/helpers
  
  # 安装Babel相关依赖
  echo "安装Babel相关依赖..."
  yarn add -D @babel/core@7.23.9 @babel/preset-env@7.23.9 @babel/preset-typescript@7.23.3 @babel/preset-react@7.23.3 babel-loader@9.1.3
  
  # 创建babel.config.js
  echo "创建babel.config.js..."
  cat > babel.config.js << 'EOL'
module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    '@babel/preset-react'
  ]
}
EOL
  
  echo "✅ 已完成Babel备选方案设置"
fi

# 步骤7: 检查必要的系统工具
echo "检查系统构建工具..."
if ! command -v gcc > /dev/null; then
  echo "⚠️ 系统可能缺少必要的构建工具，建议运行:"
  echo "sudo apt-get update && sudo apt-get install -y build-essential"
else
  echo "✅ 系统已安装构建工具"
fi

echo ""
echo "===== 修复过程完成 ====="
echo "请尝试运行: yarn build:weapp 或 yarn dev:weapp"
echo "如果仍然有问题，请提供详细的错误信息以便进一步排查"
echo ""
echo "额外提示:"
echo " - 对于ARM架构(如M1 Mac)，可能需要使用: @swc/core-darwin-arm64"
echo " - 确保Node.js版本 >= 16 (当前: $(node -v))"
echo " - 避免项目路径包含特殊字符"
