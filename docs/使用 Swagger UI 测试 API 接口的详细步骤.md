访问 http://localhost:3000/ 查看主页
访问 http://localhost:3000/api 查看API文档
访问 http://localhost:3000/auth-test.html 测试认证功能
访问 http://localhost:3000/status.html 监控服务器状态

# 使用 Swagger UI 测试 API 接口的详细步骤

在 Swagger UI 界面中，你可以不仅查看 API 文档，还能直接测试这些接口。以下是具体操作步骤：、API 测试中的注意事项
权限测试：

确保先获取 JWT 令牌并正确设置 Authorization 头
测试不同角色 (user/admin) 对资源的访问限制
事务一致性：

测试创建订单时库存是否正确减少
测试支付失败时是否会回滚相关操作
边界情况测试：

测试用户注册时使用无效的邮箱格式
测试创建商品时使用负数价格或库存
API 响应速度：

记录常用接口的响应时间，确保符合《影楼商城》文档中的性能指标要求

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
        your-secret-key-here
Bearer: your-secret-key-here

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




# Swagger UI 测试 User 接口指南

根据您的 `User` 实体定义，以下是在 Swagger UI (http://localhost:3000/api) 中测试用户相关接口的示例请求体和参数。

## 1. 创建用户 (POST /users)

### 请求体示例:

```json
{
  "username": "test_user",
  "password": "SecureP@ssw0rd",
  "contactInfo": "用户联系信息",
  "role": "user",
  "email": "user@example.com",
  "phone": "13800138000",
  "avatar": "https://example.com/avatar.jpg",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "zh-CN"
  }
}
```

### 精简版 (仅必填字段):

```json
{
  "username": "minimal_user",
  "password": "P@ssw0rd"
}
```

## 2. 查询用户列表 (GET /users)

### 查询参数示例:

```
?page=1&limit=10&role=user
```

## 3. 查询单个用户 (GET /users/{id})

### 路径参数:

使用已创建用户的 ID，例如 `1`

## 4. 更新用户 (PATCH /users/{id})

### 请求体示例:

```json
{
  "email": "updated@example.com",
  "phone": "13900139000",
  "avatar": "https://example.com/new-avatar.jpg",
  "preferences": {
    "theme": "light",
    "notifications": false
  }
}
```

## 5. 更新用户密码 (PATCH /users/{id}/password)

### 请求体示例:

```json
{
  "currentPassword": "OldP@ssw0rd",
  "newPassword": "NewSecureP@ssw0rd"
}
```

## 6. 删除用户 (DELETE /users/{id})

### 路径参数:

使用要删除的用户 ID，例如 `2`

## 7. 管理员创建用户 (适用于管理员)

### 请求体示例:

```json
{
  "username": "staff_member",
  "password": "StaffP@ss",
  "role": "staff",
  "email": "staff@example.com",
  "phone": "13700137000",
  "isActive": true
}
```

## 测试步骤

1. 打开 http://localhost:3000/api
2. 找到 `Users` 标签并展开
3. 选择要测试的端点
4. 点击 "Try it out" 按钮
5. 填入上方提供的示例请求体或参数
6. 点击 "Execute" 按钮执行请求
7. 查看响应结果

**注意事项:** 
- 密码会自动进行哈希处理，无法直接查看
- 创建用户成功后，使用返回的用户 ID 进行后续操作
- 某些操作可能需要先获取认证 token 并通过 Swagger UI 顶部的 "Authorize" 按钮进行授权









# 
# Swagger UI 后端服务测试指南与错误修复方案

## 一、使用 Swagger UI 测试后端服务

### 1. 访问 Swagger UI 页面

1. 确认 NestJS 服务已正常运行在 http://localhost:3000
2. 打开浏览器访问 http://localhost:3000/api

### 2. 系统性的 API 测试步骤

#### 2.1 用户认证模块测试

1. **注册新用户**
   - 找到 `/auth/register` 端点
   - 点击"Try it out"按钮
   - 填写请求体:
   ```json
   {
     "username": "testuser",
     "password": "Test123456!",
     "contact_info": "test@example.com"
   }
   ```
   - 点击"Execute"，确认返回状态码为 201 并获取用户 ID

2. **用户登录**
   - 找到 `/auth/login` 端点
   - 点击"Try it out"
   - 填写刚才注册的凭据:
   ```json
   {
     "username": "testuser",
     "password": "Test123456!"
   }
   ```
   - 点击"Execute"，记录返回的 JWT token
   - 在 Swagger UI 顶部找到"Authorize"按钮，输入 `Bearer [你的token]`

#### 2.2 商品模块测试

1. **创建商品** (管理员权限)
   - 找到 `/products` POST 端点
   - 点击"Try it out"
   - 填写请求体:
   ```json
   {
     "name": "婚纱摄影基础套餐",
     "price": 2999.99,
     "description": "包含10张精修照片和2小时拍摄时间",
     "image": "http://example.com/photo1.jpg",
     "stock": 100,
     "category": "wedding"
   }
   ```
   - 点击"Execute"，确认商品创建成功

2. **获取商品列表**
   - 找到 `/products` GET 端点
   - 设置查询参数: `page=1&limit=10`
   - 点击"Execute"，查看返回的商品列表

#### 2.3 订单模块测试

1. **创建订单**
   - 找到 `/orders` POST 端点
   - 点击"Try it out"
   - 填写请求体:
   ```json
   {
     "productId": 1,
     "quantity": 1
   }
   ```
   - 点击"Execute"，确认订单创建成功并记录订单ID

2. **支付订单**
   - 找到 `/orders/{id}/pay` 端点
   - 输入上一步的订单ID
   - 填写请求体:
   ```json
   {
     "paymentMethod": "wechat"
   }
   ```
   - 点击"Execute"，确认支付状态更新

## 二、常见错误修复方案

### 1. 认证相关错误

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('用户名不存在');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '2h' }),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      }
    };
  }

  async register(userData: { username: string, password: string, contact_info: string }) {
    // 检查用户是否已存在
    const existingUser = await this.usersRepository.findOne({ 
      where: { username: userData.username } 
    });
    
    if (existingUser) {
      throw new UnauthorizedException('用户名已存在');
    }
    
    // 验证邮箱格式
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    if (!emailRegex.test(userData.contact_info)) {
      throw new UnauthorizedException('邮箱格式不正确');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // 创建新用户
    const newUser = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
      role: 'user', // 默认角色
    });
    
    return this.usersRepository.save(newUser);
  }
}
```

### 2. JWT 策略修复

```typescript


已进行更改。

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'photostudio_secret_key',
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      username: payload.username,
      role: payload.role
    };
  }
}
```

### 3. 商品模块数据验证修复

```typescript
```typescript
```typescript
```typescript
```typescript


已进行更改。

import { IsNotEmpty, IsNumber, IsString, Min, IsUrl, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: '商品名称不能为空' })
  @IsString({ message: '商品名称必须是字符串' })
  name: string;

  @IsNotEmpty({ message: '商品价格不能为空' })
  @IsNumber({}, { message: '商品价格必须是数字' })
  @Min(0.01, { message: '商品价格必须大于0' })
  price: number;

  @IsNotEmpty({ message: '商品描述不能为空' })
  @IsString({ message: '商品描述必须是字符串' })
  description: string;

  @IsNotEmpty({ message: '商品图片不能为空' })
  @IsUrl({}, { message: '商品图片必须是有效的URL' })
  image: string;

  @IsNotEmpty({ message: '商品库存不能为空' })
  @IsNumber({}, { message: '商品库存必须是数字' })
  @Min(0, { message: '商品库存不能为负数' })
  stock: number;

  @IsNotEmpty({ message: '商品分类不能为空' })
  @IsString({ message: '商品分类必须是字符串' })
  category: string;

  @IsOptional()
  is_active: boolean = true;
}
```

### 4. 订单模块错误修复

```typescript


已进行更改。

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { User } from '../../entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: number) {
    // 查找商品
    const product = await this.productRepository.findOne({
      where: { id: createOrderDto.productId },
    });
    
    if (!product) {
      throw new NotFoundException('商品不存在');
    }
    
    if (product.stock < createOrderDto.quantity) {
      throw new BadRequestException('商品库存不足');
    }
    
    // 查找用户
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    
    // 生成订单号
    const orderNumber = `ORD-${Date.now()}-${uuidv4().substr(0, 8)}`;
    
    // 创建订单
    const order = this.orderRepository.create({
      order_number: orderNumber,
      user,
      product,
      quantity: createOrderDto.quantity,
      total_amount: product.price * createOrderDto.quantity,
      status: 'pending',
      payment_method: 'none',
    });
    
    // 更新商品库存
    product.stock -= createOrderDto.quantity;
    await this.productRepository.save(product);
    
    return this.orderRepository.save(order);
  }

  async findAll(userId: number) {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['product', 'user'],
    });
  }

  async findOne(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['product', 'user'],
    });
    
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    
    return order;
  }

  async updatePaymentStatus(id: number, payOrderDto: PayOrderDto, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
    });
    
    if (!order) {
      throw new NotFoundException('订单不存在');
    }
    
    if (order.status !== 'pending') {
      throw new BadRequestException('订单状态不允许支付');
    }
    
    order.status = 'paid';
    order.payment_method = payOrderDto.paymentMethod;
    
    return this.orderRepository.save(order);
  }
}
```

### 5. 添加 Swagger 文档增强

```typescript


已进行更改。

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 配置全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('影楼商城 API')
    .setDescription('影楼商城管理系统的API文档')
    .setVersion('1.0')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 启用CORS
  app.enableCors();

  await app.listen(3000);
  console.log(`服务已启动: http://localhost:3000`);
  console.log(`Swagger文档: http://localhost:3000/api`);
}
bootstrap();
```

### 6. 测试功能路由装饰器添加

```typescript


已进行更改。

import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('商品')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '创建新商品' })
  @ApiResponse({ status: 201, description: '商品创建成功' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: '获取商品列表' })
  @ApiResponse({ status: 200, description: '返回商品列表' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.productService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个商品详情' })
  @ApiResponse({ status: 200, description: '返回单个商品详情' })
  @ApiResponse({ status: 404, description: '商品不存在' })
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }
}
```

## 三、API 测试中的注意事项

1. **权限测试**：
   - 确保先获取 JWT 令牌并正确设置 Authorization 头
   - 测试不同角色 (user/admin) 对资源的访问限制

2. **事务一致性**：
   - 测试创建订单时库存是否正确减少
   - 测试支付失败时是否会回滚相关操作

3. **边界情况测试**：
   - 测试用户注册时使用无效的邮箱格式
   - 测试创建商品时使用负数价格或库存

4. **API 响应速度**：
   - 记录常用接口的响应时间，确保符合《影楼商城》文档中的性能指标要求

## 四、后续前端开发准备

完成后端 API 测试后，可以开始前端部分的开发：

1. 准备前端环境：
   ```bash
   # 创建前端管理后台项目（Web 版）
   cd /home/liyong/photo-studio-1.2.4
   npx create-react-app admin-web --template typescript
   
   # 创建 Taro 手机端管理后台项目
   cd /home/liyong/photo-studio-1.2.4
   npx @tarojs/cli init admin-mobile
   
   # 创建小程序商城前端
   cd /home/liyong/photo-studio-1.2.4
   npx @tarojs/cli init mobile-app
   
   # 创建 Web 商城前端
   cd /home/liyong/photo-studio-1.2.4
   npx create-react-app web-app --template typescript
   ```

2. 配置 API 请求库和全局状态管理，确保能从 Swagger 测试通过的 API 获取数据

现在，您的后端服务已经进行了系统性的测试和错误修复，可以作为前端开发的可靠基础。按照《影楼商城》.md 文档中的项目结构和功能规划，继续开发四个前端应用。

已进行更改。

找到具有 2 个许可证类型的类似代码