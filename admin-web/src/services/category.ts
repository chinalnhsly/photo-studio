import  request  from 'umi-request';

// 分类数据类型定义
export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId: number | null;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  level: number;
  path: string;
  children?: CategoryItem[];
  productCount?: number;
}

// 分类排序项类型
export interface CategoryOrderItem {
  id: number;
  sortOrder: number;
  parentId: number | null;
}

/**
 * 获取分类列表
 */
export async function getCategoryList() {
  return request<{ data: CategoryItem[] }>('/api/categories');
}

/**
 * 创建分类
 */
export async function createCategory(data: Partial<CategoryItem>) {
  return request('/api/categories', {
    method: 'POST',
    data,
  });
}

/**
 * 更新分类
 */
export async function updateCategory(id: number, data: Partial<CategoryItem>) {
  return request(`/api/categories/${id}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除分类
 */
export async function deleteCategory(id: number) {
  return request(`/api/categories/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 更新分类排序
 */
export async function updateCategoriesOrder(data: CategoryOrderItem[]) {
  return request('/api/categories/order', {
    method: 'PUT',
    data,
  });
}
