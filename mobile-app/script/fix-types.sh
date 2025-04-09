#!/bin/bash

# 清理现有的 node_modules
rm -rf node_modules
rm -f yarn.lock

# 先安装 typescript
yarn add typescript@4.9.5 --dev --exact

# 安装必需的类型定义
yarn add @types/node@18.0.0 \
  @types/webpack-env@1.18.4 \
  @types/react@18.2.0 \
  @types/react-dom@18.2.0 \
  --dev \
  --exact

# 更新 tsconfig.json
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "removeComments": false,
    "preserveConstEnums": true,
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "noImplicitAny": false,
    "allowSyntheticDefaultImports": true,
    "outDir": "lib",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "strictNullChecks": true,
    "sourceMap": true,
    "baseUrl": ".",
    "rootDir": ".",
    "jsx": "react-jsx",
    "allowJs": true,
    "resolveJsonModule": true,
    "typeRoots": [
      "./node_modules/@types"
    ],
    "paths": {
      "@/*": ["./src/*"]
    },
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node", "webpack-env", "react", "react-dom"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"],
  "compileOnSave": false
}
EOL

# 重新安装所有依赖
yarn install

# 检查类型
echo "正在检查类型定义..."
yarn tsc --noEmit

echo "类型修复完成！"
