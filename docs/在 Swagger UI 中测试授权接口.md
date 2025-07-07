# JWT 认证使用指南

## 授权流程

1. **获取访问令牌**: 通过 `/auth/login` 接口获取 JWT 令牌
2. **使用访问令牌**: 在需要授权的请求中添加授权头
3. **令牌过期处理**: 使用 `/auth/refresh` 刷新令牌

## 正确的授权格式

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ 注意: 只需要一个 `Bearer` 前缀，后面直接跟 JWT 令牌，中间用空格分隔

## 在 Swagger UI 中测试授权接口

1. 点击 Swagger UI 页面顶部的 "Authorize" 按钮
2. 在弹出窗口中，**只输入** 以下格式的值:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   (替换为您的实际 JWT 令牌)
3. 点击 "Authorize" 按钮确认

## 常见错误

- ❌ `Bearer Bearer token...` (重复的 Bearer 前缀)
- ❌ `token...` (缺少 Bearer 前缀)
- ❌ `Bearer your-secret-key-here` (使用了占位符而非实际令牌)

## 完整测试流程

1. 登录获取令牌:
   ```bash

   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123"}'

     
   ```

2. 复制返回的 `accessToken` 值

3. 使用令牌访问受保护资源:
   ```bash
   curl -X GET http://localhost:3000/auth/profile \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDgyMjc3MjMsImV4cCI6MTc0ODIzNDkyM30.iHfoWDJLws-uSinSuZY2vK25dtS3WjVcAIDXwj_f_VU"
   ```


####
```bash

### 2. 如何正确在 Swagger UI 中进行授权测试

1. **首先获取真实的 JWT 令牌**:
   - 访问 `/auth/login` 接口并成功登录
   - 从返回结果中复制 `accessToken` 的值

2. **使用正确格式设置授权值**:
   - 点击 Swagger UI 顶部的 "Authorize" 按钮
   - 输入 `Bearer` 加一个空格，然后粘贴您的真实 JWT 令牌
   - 例如: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTY2ODM5ODYsImV4cCI6MTcxNjY5MTE4Nn0.P7X2...`
   - 点击 "Authorize" 按钮

3. **尝试创建订单**:
   - 展开 `/orders` POST 接口
   - 提供有效的商品数据
   - 执行请求

现在应该能够成功调用所有需要认证的接口，包括创建订单的接口。请记住，JWT 令牌有过期时间，如果过期了，您需要重新登录或使用刷新令牌获取新的访问令牌。
```