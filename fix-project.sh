#!/bin/bash

cd /home/liyong/photostudio/mobile-app

echo "=== 修复项目配置 ==="

# 1. 创建assets目录和临时图标
mkdir -p src/assets/icons
touch src/assets/icons/home.png
touch src/assets/icons/home-active.png
touch src/assets/icons/category.png
touch src/assets/icons/category-active.png
touch src/assets/icons/user.png
touch src/assets/icons/user-active.png

# 2. 确保所有必要的页面存在
mkdir -p src/pages/category
mkdir -p src/pages/user

# 创建缺失的页面
cat > src/pages/category/index.jsx << EOF
import React from 'react'
import { View, Text } from '@tarojs/components'

export default function Category() {
  return (
    <View className='category-page'>
      <Text>分类页面</Text>
    </View>
  )
}
EOF

cat > src/pages/user/index.jsx << EOF
import React from 'react'
import { View, Text } from '@tarojs/components'

export default function User() {
  return (
    <View className='user-page'>
      <Text>用户中心</Text>
    </View>
  )
}
EOF

# 3. 安装必要的依赖并清理缓存
yarn add rimraf --dev
yarn cache clean
rm -rf node_modules/.cache
rm -rf .temp
rm -rf dist

echo "=== 修复完成，重新启动开发服务器 ==="
echo "yarn dev:weapp"
