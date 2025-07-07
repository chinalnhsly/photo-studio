import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Tag } from '../entities/tag.entity';
import * as bcrypt from 'bcrypt';

export async function seed(connection: DataSource): Promise<void> {
  // 创建管理员用户
  const adminExists = await connection.getRepository(User).findOne({ where: { username: 'admin' } });
  if (!adminExists) {
    const admin = connection.getRepository(User).create({
      username: 'admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      email: 'admin@example.com',
      phone: '13800000000',
      avatar: 'https://example.com/avatar.jpg',
      isActive: true
    });
    await connection.getRepository(User).save(admin);
    console.log('Admin user created');
  }

  // 创建普通用户
  const user1Exists = await connection.getRepository(User).findOne({ where: { username: 'user1' } });
  if (!user1Exists) {
    const user1 = connection.getRepository(User).create({
      username: 'user1',
      password: await bcrypt.hash('user123', 10),
      role: 'user',
      email: 'user1@example.com',
      phone: '13800000001',
      avatar: 'https://example.com/avatar.jpg',
      isActive: true
    });
    await connection.getRepository(User).save(user1);
    console.log('Regular user created');
  }

  // 创建摄影师用户
  const photographerExists = await connection.getRepository(User).findOne({ where: { username: 'photographer1' } });
  if (!photographerExists) {
    const photographer = connection.getRepository(User).create({
      username: 'photographer1',
      password: await bcrypt.hash('photo123', 10),
      role: 'photographer',
      email: 'photographer1@example.com',
      phone: '13800000002',
      avatar: 'https://example.com/avatar.jpg',
      isActive: true
    });
    await connection.getRepository(User).save(photographer);
    console.log('Photographer user created');
  }

  // 创建示例标签
  const tags = [
    { name: '婚纱摄影', description: '专业婚纱照拍摄服务', sortOrder: 1 },
    { name: '儿童写真', description: '儿童主题摄影服务', sortOrder: 2 },
    { name: '全家福', description: '家庭合影摄影服务', sortOrder: 3 },
    { name: '个人写真', description: '个人写真服务', sortOrder: 4 },
  ];

  for (const tagData of tags) {
    const tagExists = await connection.getRepository(Tag).findOne({ where: { name: tagData.name } });
    if (!tagExists) {
      const tag = connection.getRepository(Tag).create(tagData);
      await connection.getRepository(Tag).save(tag);
    }
  }
  console.log('Tags created');

  // 创建示例产品
  const products = [
    {
      name: '标准婚纱套餐',
      description: '包含20张精修照片，3套服装，1天拍摄时间',
      price: 2999.99,
      image: 'https://example.com/images/wedding1.jpg',
      stock: 100,
      category: 'wedding',
      tags: ['婚纱摄影'],
      imageUrls: [
        'https://example.com/images/wedding1.jpg',
        'https://example.com/images/wedding2.jpg',
      ],
    },
    {
      name: '豪华婚纱套餐',
      description: '包含50张精修照片，5套服装，2天拍摄时间',
      price: 5999.99,
      image: 'https://example.com/images/wedding_premium.jpg',
      stock: 50,
      category: 'wedding',
      tags: ['婚纱摄影'],
      imageUrls: [
        'https://example.com/images/wedding_premium1.jpg',
        'https://example.com/images/wedding_premium2.jpg',
      ],
    },
    {
      name: '儿童主题写真',
      description: '适合3-10岁儿童，包含15张精修照片，2套服装',
      price: 1299.99,
      image: 'https://example.com/images/kids1.jpg',
      stock: 200,
      category: 'children',
      tags: ['儿童写真'],
      imageUrls: [
        'https://example.com/images/kids1.jpg',
        'https://example.com/images/kids2.jpg',
      ],
    },
    {
      name: '全家福套餐',
      description: '适合3-6人家庭，包含15张精修照片',
      price: 1599.99,
      image: 'https://example.com/images/family1.jpg',
      stock: 150,
      category: 'family',
      tags: ['全家福'],
      imageUrls: [
        'https://example.com/images/family1.jpg',
        'https://example.com/images/family2.jpg',
      ],
    },
  ];

  // 保存示例产品
  for (const productData of products) {
    const { tags: tagNames, ...productInfo } = productData;
    const productExists = await connection.getRepository(Product).findOne({ where: { name: productInfo.name } });
    
    if (!productExists) {
      const product = connection.getRepository(Product).create({
        ...productInfo,
        specifications: {
          duration: '120分钟',
          photos: 20,
          outfits: 3,
        },
        isActive: true,
      });
      
      await connection.getRepository(Product).save(product);
      console.log(`Product created: ${productInfo.name}`);
    }
  }

  console.log('Seed data created successfully');
}
