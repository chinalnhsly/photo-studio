// 定义Product接口
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  sales?: number;
  description?: string;
  images?: string[];
  originalPrice?: number;
  discount?: number;
  tags?: string[];
}

// 定义Order接口
export interface Order {
  id: string;
  products: Array<{productId: string; quantity: number}>;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createTime: string;
}

// 定义User接口
export interface User {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  level?: number;
}

// 无需重复导出，上面已经使用export interface导出了