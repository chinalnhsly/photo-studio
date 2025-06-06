请输入项目介绍 影楼商城,用户中心,商品展示,订单系统,活动预约,评价系统,营销系统
? 请选择框架 React
? 是否需要使用 TypeScript ？ Yes
? 是否需要编译为 ES5 ？ Yes
? 请选择 CSS 预处理器（Sass/Less/Stylus） Sass
? 请选择包管理工具 yarn
? 请选择编译工具 Webpack5
? 请选择模板源 Gitee（最快）
✔ 拉取远程模板仓库成功！
? 请选择模板 (Use arrow keys)
❯ redux
  /home/liyong/photostudio/fix-typescript.sh
# 《影楼商城》管理系统技术文档

## 一、系统架构图
```
┌─────────────────────────────────────────────────┐
│                  客户端层                       │
│  ┌─────────────┐         ┌───────────────┐     │
│  │ 微信小程序  │         │    Web前端     │     │
│  │ (Taro/React)│         │    (React)     │     │
│  └─────────────┘         └───────────────┘     │
└───────────────┬───────────────────┬─────────────┘
                │ HTTP/HTTPS API    │
                ▼                   ▼
┌─────────────────────────────────────────────────┐
│                  服务层                         │
│  ┌─────────────────────────────────────────┐    │
│  │              NestJS Server              │    │
│  │ ┌─────────┐ ┌─────────┐ ┌───────────┐  │    │
│  │ │Auth模块 │ │Order模块│ │Product模块│  │    │
│  │ └─────────┘ └─────────┘ └───────────┘  │    │
│  └─────────────────────────────────────────┘    │
└───────────────┬───────────────────┬─────────────┘
                │ 数据交互          │
                ▼                   ▼
┌─────────────────────────────────────────────────┐
│                  数据层                         │
│  ┌─────────────────┐    ┌──────────────────┐   │
│  │  PostgreSQL     │    │      Redis       │   │
│  │  - 用户数据     │    │  - 会话缓存      │   │
│  │  - 商品数据     │    │  - 热点数据缓存  │   │
│  │  - 订单数据     │    └──────────────────┘   │
│  └─────────────────┘                           │
└─────────────────────────────────────────────────┘
```

## 二、技术栈说明

### 前端技术栈
| 技术          | 版本   | 用途说明                                                                 |
|---------------|--------|--------------------------------------------------------------------------|
| React         | 18.x   | 构建响应式UI界面，支持组件化开发                                         |
| Taro          | 3.x    | 跨端开发框架，一套代码编译微信小程序+H5                                   |
| Ant Design    | 5.x    | 提供专业级UI组件库，加速界面开发                                         |
| Axios         | 1.x    | 处理HTTP请求，支持拦截器机制                                             |
| React Router  | 6.x    | 实现前端路由导航                                                         |

### 后端技术栈
| 技术          | 版本   | 用途说明                                                                 |
|---------------|--------|--------------------------------------------------------------------------|
| NestJS        | 9.x    | 基于TypeScript的渐进式Node.js框架，采用模块化架构                         |
| TypeORM       | 0.3.x  | ORM框架，支持PostgreSQL关系映射                                          |
| Redis         | 4.x    | 缓存会话数据和热点数据，提升系统响应速度                                 |
| JWT           | 9.x    | 实现安全的身份认证机制                                                   |
| Swagger       | 6.x    | API文档自动生成工具                                                      |

### 数据库技术
| 技术          | 版本   | 用途说明                                                                 |
|---------------|--------|--------------------------------------------------------------------------|
| PostgreSQL    | 15     | 主业务数据库，支持ACID事务                                               |
| Redis         | 7.x    | 高速缓存数据库，QPS可达10万+                                             |

## 三、数据库词典（核心表）

### 1. 用户体系
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL CHECK (contact_info ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 2. 商品系统
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);
```

### 3. 订单系统
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NOT NULL REFERENCES users(id),
    product_id INT NOT NULL REFERENCES products(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    total_amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL 
        CHECK (status IN ('pending','paid','shipped','completed','refunded')),
    payment_method VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

### 4. 活动系统
```sql
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL CHECK (end_time > start_time),
    location VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    max_participants INT NOT NULL CHECK (max_participants > 0)
);

CREATE TABLE activity_registrations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    activity_id INT NOT NULL REFERENCES activities(id),
    register_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, activity_id)
);
```

## 四、关键接口设计

### 1. 认证模块
| 端点                | 方法 | 描述                          | 参数示例                      |
|---------------------|------|-------------------------------|-------------------------------|
| /auth/login        | POST | 用户登录                      | {username, password}         |
| /auth/register     | POST | 用户注册                      | {username, password, contact}|

### 2. 商品模块
| 端点                | 方法 | 描述                          | 参数示例                      |
|---------------------|------|-------------------------------|-------------------------------|
| /products          | GET  | 获取商品列表（分页）          | ?page=1&limit=10             |
| /products/:id      | GET  | 获取商品详情                  | -                            |

### 3. 订单模块
| 端点                | 方法 | 描述                          | 参数示例                      |
|---------------------|------|-------------------------------|-------------------------------|
| /orders            | POST | 创建新订单                    | {productId, quantity}        |
| /orders/:id/pay    | POST | 订单支付                      | {paymentMethod}              |

## 五、非功能性要求

1. **性能指标**：
   - API响应时间 ≤ 500ms（95%请求）
   - 系统支持500+并发用户

2. **安全要求**：
   - 所有接口HTTPS加密
   - 密码存储使用bcrypt哈希
   - JWT有效期控制在2小时

3. **数据可靠性**：
   - 每日凌晨3点自动数据库备份
   - 关键业务数据双写校验

4. **扩展性设计**：
   - 采用微服务友好架构
   - 数据库读写分离预留接口

---
该文档可作为开发团队的基准技术规范，建议配合Swagger API文档和详细设计说明书共同使用。实际开发时应根据需求变化进行版本控制管理。

# 项目结构及界面设计方案：

### 六、项目目录结构
```
photostudio/
├── mobile-app/          # 手机端商城（Taro跨端）
│   ├── src/
│   │   ├── assets/      # 静态资源
│   │   ├── components/  # 公共组件
│   │   │   ├── ProductCard.tsx
│   │   │   ├── NavBar.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/       # 页面组件
│   │   │   ├── home/    # 首页
│   │   │   ├── product/ # 商品详情
│   │   │   ├── order/   # 订单相关
│   │   │   └── user/    # 用户中心
│   │   ├── services/    # API服务
│   │   └── app.config.ts # 小程序配置
│
├── web-app/            # Web端商城（React）
│   ├── public/         # 静态资源
│   ├── src/
│   │   ├── features/   # 功能模块
│   │   │   ├── auth/   # 认证相关
│   │   │   ├── product/
│   │   │   └── order/
│   │   ├── layouts/    # 页面布局
│   │   └── routes/     # 路由配置
│
├── admin-mobile/       # 手机端管理后台（Taro）
│   └── src/
│       ├── pages/
│       │   ├── dashboard/ # 数据看板
│       │   ├── goods/     # 商品管理
│       │   └── orders/    # 订单处理
│
├── admin-web/          # Web端管理后台（React+Ant Design Pro）
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Admin/
│   │   │   │   ├── UserManager/
│   │   │   │   ├── ProductCRUD/
│   │   │   │   └── DataAnalysis/
│
└── server/             # 后端服务
    ├── src/
    │   ├── modules/    # 功能模块
    │   │   ├── auth/
    │   │   │   ├── auth.controller.ts
    │   │   │   └── auth.service.ts
    │   │   ├── product/
    │   │   └── order/
    │   ├── entities/   # TypeORM实体
    │   └── main.ts     # 入口文件
```

### 七、功能模块清单
#### 1. 商城前端功能
| 模块        | 功能点                      | 实现方式               |
|-------------|----------------------------|-----------------------|
| 用户中心    | 登录/注册/个人信息          | JWT认证               |
| 商品展示    | 分类浏览/搜索/详情          | 分页查询+Redis缓存    |
| 订单系统    | 创建/支付/退单              | 微信支付接入          |
| 活动预约    | 档期选择/在线预约           | 日历组件+库存校验     |
| 评价系统    | 星级评价+图文评论           | 富文本编辑器          |

#### 2. 后台管理功能
| 模块        | 功能点                      | 技术实现               |
|-------------|----------------------------|-----------------------|
| 数据看板    | 销售数据可视化              | ECharts集成           |
| 商品管理    | CRUD/批量上架               | Excel导入导出         |
| 订单处理    | 状态追踪/物流对接           | 快递鸟API             |
| 用户管理    | 权限分配/行为分析           | RBAC权限模型          |
| 营销中心    | 优惠券/满减活动             | 定时任务调度          |

### 八、界面设计方案

#### 手机端商城界面（Taro实现）
![Mobile Shop Interface]
1. **首页布局**：
   - 顶部搜索栏 + 轮播广告
   - 快捷分类入口（婚纱/亲子/写真）
   - 热门套餐瀑布流展示
   - 底部导航栏（首页/分类/预约/我的）

2. **商品详情页**：
   - 图片画廊（支持缩放）
   - 价格标签+促销信息
   - 档期选择日历组件
   - 浮动底部操作栏（收藏/预约）

#### Web端商城界面（React）
![Web Shop Interface]
1. **主页面**：
   - 响应式网格布局（Bootstrap）
   - 左侧分类导航树
   - 右侧商品卡片网格
   - 悬浮客服窗口

2. **订单流程**：
   - 步骤进度条（1.选片 2.选套餐 3.支付）
   - 订单概要折叠面板
   - 微信支付二维码弹窗

#### 手机端管理后台
![Mobile Admin]
1. **工作台**：
   - 当日关键指标卡片（订单数/销售额）
   - 快捷操作入口（新增商品/处理订单）
   - 消息通知中心

2. **订单处理**：
   - 状态筛选选项卡
   - 订单卡片列表（滑动操作）
   - 物流信息录入表单

#### Web端管理后台（Ant Design Pro）
![Web Admin]
1. **数据分析**：
   - 销售趋势折线图
   - 热销商品排行榜
   - 客户地域分布地图

2. **商品管理**：
   - 表格筛选+批量操作
   - 图片拖拽上传组件
   - SKU组合设置器

### 九、技术实现要点
1. **跨端适配方案**：
   - 使用Taro的`@tarojs/plugin-platform-weapp`编译微信小程序
   - 通过CSS媒体查询实现响应式布局

2. **性能优化**：
   ```javascript
   // 商品列表懒加载示例
   const { data, loading } = useLoadMore('/api/products', {
     initialPageSize: 10,
     threshold: 300 // 滚动提前加载阈值
   });
   ```

3. **典型页面结构示例（React）**：
```jsx
// 商品详情页
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductDetail(id).then(res => {
      setProduct(res.data);
      // 记录浏览历史
      trackViewHistory(res.data); 
    });
  }, [id]);

  return (
    <PageContainer>
      <ImageGallery images={product?.images} />
      <PriceDisplay 
        price={product.price} 
        discount={product.discount} 
      />
      <DatePicker 
        availableDates={product.available_dates}
      />
      <ActionBar 
        onAddToCart={handleAddCart}
      />
    </PageContainer>
  );
}
```

建议使用Figma/Sketch制作高保真原型，并配合Storybook建立组件库。实际开发时应优先实现核心业务流程（商品浏览->下单支付->订单管理），再逐步完善辅助功能模块。