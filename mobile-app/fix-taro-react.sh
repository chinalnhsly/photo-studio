#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

# 确保类型目录存在
mkdir -p src/types

# 备份当前 package.json
cp package.json package.json.backup

# 安装指定版本的 React 以确保类型兼容
yarn add react@18.2.0 react-dom@18.2.0 --exact
yarn add -D @types/react@18.2.0 @types/react-dom@18.2.0 --exact

# 创建临时的入口文件
cat > src/temp-index.tsx << EOL
import React from 'react';
import { View, Text } from '@tarojs/components';

// 确保 Taro 组件可以正常使用
export default function TempComponent() {
  return (
    <View className='test-container'>
      <Text>测试组件</Text>
    </View>
  );
}
EOL

# 更新 tsconfig.json，增强类型兼容性
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "sourceMap": true,
    "rootDir": ".",
    "jsx": "react-jsx",
    "allowJs": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "typeRoots": [
      "./src/types",
      "./node_modules/@types"
    ],
    "types": ["node"],
    "allowSyntheticDefaultImports": true
  },
  "include": ["src", "global.d.ts"],
  "exclude": ["node_modules", "dist"]
}
EOL

# 测试编译
echo "运行测试编译..."
yarn tsc --noEmit src/temp-index.tsx

# 清理测试文件
rm src/temp-index.tsx

echo "修复完成！请重新构建项目"
