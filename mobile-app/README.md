# 影楼商城小程序

## 开发指南

### 开发环境启动

1. **启动开发服务**
   ```bash
   # 在项目根目录执行
   yarn dev:weapp
   ```
   此命令会启动 Taro 开发服务器，实时编译代码并输出到 `dist` 目录

2. **使用微信开发者工具预览**
   - 打开微信开发者工具
   - 导入项目，选择路径: `/home/liyong/photostudio/mobile-app/dist`
   - 填入小程序 AppID (或使用测试号)
   
3. **开发调试技巧**
   - 控制台输出会同时显示在终端和微信开发者工具的 Console 面板
   - 修改代码后会自动重新编译
   - 如果遇到缓存问题，可以在微信开发者工具中清除缓存

### 目录结构说明

```
/mobile-app
├── config/             # Taro 配置文件
├── dist/               # 编译输出目录 (不要手动修改)
├── src/
│   ├── app.scss        # 全局样式
│   ├── app.ts          # 应用入口
│   ├── components/     # 公共组件
│   └── pages/          # 页面文件夹
│       └── index/      # 首页
└── package.json        # 项目依赖
```

### 常见问题解决

- **如果编译失败**：检查 config/index.js 中的 framework 配置
- **如果样式异常**：确认 app.scss 中的全局样式是否正确
- **如果页面不显示**：检查 app.ts 中的页面配置
