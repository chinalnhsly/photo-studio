# 使用 Swagger UI 测试 API 接口的详细步骤

在 Swagger UI 界面中，你可以不仅查看 API 文档，还能直接测试这些接口。以下是具体操作步骤：

## 1. 基础操作流程

### 步骤一：展开接口组
在 Swagger UI 界面中，首先你会看到按标签分组的接口列表（如 auth、bookings、photographers、products 等）。点击任一组名称可以展开该组下的所有接口。

### 步骤二：选择具体接口
每个接口前面会有对应的 HTTP 方法标识（GET、POST、PUT、DELETE 等，以不同颜色区分）。找到你想测试的接口，点击展开详情面板。

### 步骤三：查看接口信息
展开后，你可以看到：
- 接口描述
- 请求参数说明
- 请求体格式
- 响应码和响应内容示例

### 步骤四：填写测试参数
- **路径参数**：直接在对应输入框填写
- **查询参数**：在 Parameters 区域填写
- **请求体**：在 Request Body 区域填写 JSON 数据

### 步骤五：执行请求
点击右上角的 "Try it out" 按钮，然后点击 "Execute" 按钮发送请求。

### 步骤六：查看结果
执行后，下方会显示：
- 请求 URL
- 服务器响应状态
- 响应头信息
- 响应体内容
- 请求耗时

## 2. 实战示例

### 示例一：测试获取商品列表 API
1. 展开 `products` 标签组
2. 找到 `GET /products` 接口
3. 点击 "Try it out"
4. 可以设置查询参数（如 page=1&limit=10）
5. 点击 "Execute"
6. 查看返回的商品列表数据

### 示例二：测试用户登录 API
1. 展开 `auth` 标签组
2. 找到 `POST /auth/login` 接口
3. 点击 "Try it out"
4. 在请求体中填写登录信息：
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
5. 点击 "Execute"
6. 查看返回的 token 和用户信息

### 示例三：测试创建预约 API（需要授权）
1. 首先通过登录接口获取 token
2. 点击 Swagger UI 页面顶部的 "Authorize" 按钮
3. 在弹出的窗口中，输入 "Bearer " 加上你的 token（例如："Bearer eyJhbGciOiJ..."）
4. 点击 "Authorize" 按钮确认
5. 现在你已经授权，可以测试需要认证的接口了
6. 展开 `bookings` 标签组
7. 找到 `POST /bookings` 接口
8. 点击 "Try it out"
9. 填写预约信息
10. 点击 "Execute"
11. 查看新创建的预约信息

## 3. 调试技巧

- **测试带授权的接口**：记得使用顶部的 "Authorize" 按钮设置 JWT token
- **查看请求错误**：当请求失败时，查看响应体中的详细错误信息
- **复制 curl 命令**：Swagger UI 提供了对应的 curl 命令，方便在其他地方测试
- **批量测试**：按照业务流程顺序测试多个相关接口，例如：用户注册 → 登录 → 浏览商品 → 创建订单

现在你可以打开 http://localhost:3000/api 开始探索和测试所有可用的 API 接口了！