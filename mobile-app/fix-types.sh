#!/bin/bash

# 进入项目目录
cd /home/liyong/photostudio/mobile-app

# 安装缺失的类型定义
yarn add -D @types/node@18.16.0
yarn add @tarojs/components @tarojs/runtime

# 更新tsconfig.json的types设置
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
      "node_modules/@types",
      "./node_modules/@tarojs/components/types",
      "./node_modules/@tarojs/taro/types"
    ],
    "paths": {
      "@/*": ["src/*"]
    },
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src", "global.d.ts"],
  "exclude": ["node_modules", "dist"]
}
EOL

# 创建全局声明文件
cat > global.d.ts << 'EOL'
/// <reference path="node_modules/@tarojs/taro/types/index.d.ts" />
/// <reference path="node_modules/@tarojs/components/types/index.d.ts" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
  }
}
EOL

echo "已修复类型定义问题，请重新运行编译"
