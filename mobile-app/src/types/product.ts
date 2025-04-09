import type { ProductCategory } from './business'

// 商品基础类型
export interface BaseProduct {
  id: number
  name: string
  price: number
  description: string
  images: string[]
  category: ProductCategory
  tags: string[]
}

// 商品列表项类型
export interface ProductListItem extends BaseProduct {}

// 完整商品类型
export interface Product extends BaseProduct {
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 导出常用类型
export type ProductStatus = Product['status']
