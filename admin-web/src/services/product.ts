import  request  from 'umi-request';

// 获取产品列表
export async function getProducts(params?: any) {
  return request('/api/products', {
    method: 'GET',
    params,
  });
}

// 获取单个产品详情
export async function getProductById(id: number) {
  return request(`/api/products/${id}`, {
    method: 'GET',
  });
}

// 创建产品
export async function createProduct(data: any) {
  return request('/api/products', {
    method: 'POST',
    data,
  });
}

// 更新产品
export async function updateProduct(id: number, data: any) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除产品
export async function deleteProduct(id: number) {
  return request(`/api/products/${id}`, {
    method: 'DELETE',
  });
}

// 更新产品状态（上下架）
export async function updateProductStatus(id: number, isActive: boolean) {
  return request(`/api/products/${id}/status`, {
    method: 'PUT',
    data: { isActive },
  });
}

// 复制产品
export async function duplicateProduct(id: number) {
  return request(`/api/products/${id}/duplicate`, {
    method: 'POST',
  });
}

// 批量操作产品
export async function batchUpdateProducts(ids: number[], action: string, data?: any) {
  return request('/api/products/batch', {
    method: 'POST',
    data: {
      ids,
      action,
      ...data,
    },
  });
}

// 获取产品分类列表
export async function getProductCategories() {
  return request('/api/product-categories', {
    method: 'GET',
  });
}

// 创建产品分类
export async function createProductCategory(data: any) {
  return request('/api/product-categories', {
    method: 'POST',
    data,
  });
}

// 更新产品分类
export async function updateProductCategory(id: number, data: any) {
  return request(`/api/product-categories/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除产品分类
export async function deleteProductCategory(id: number) {
  return request(`/api/product-categories/${id}`, {
    method: 'DELETE',
  });
}

// 获取产品统计数据
export async function getProductStats() {
  return request('/api/products/stats', {
    method: 'GET',
  });
}

// 获取产品销售趋势
export async function getProductSalesTrends(id: number, params: {
  startDate: string;
  endDate: string;
  period: 'day' | 'week' | 'month';
}) {
  return request(`/api/products/${id}/sales-trends`, {
    method: 'GET',
    params,
  });
}

// 设置产品推荐状态
export async function setProductRecommendation(id: number, isRecommended: boolean) {
  return request(`/api/products/${id}/recommend`, {
    method: 'PUT',
    data: { isRecommended },
  });
}

// 设置产品为新品
export async function setProductAsNew(id: number, isNew: boolean) {
  return request(`/api/products/${id}/new`, {
    method: 'PUT',
    data: { isNew },
  });
}

// 设置产品为热销
export async function setProductAsHot(id: number, isHot: boolean) {
  return request(`/api/products/${id}/hot`, {
    method: 'PUT',
    data: { isHot },
  });
}

// 管理产品图片
export async function updateProductImages(id: number, images: string[]) {
  return request(`/api/products/${id}/images`, {
    method: 'PUT',
    data: { images },
  });
}

// 添加产品选项
export async function addProductOption(productId: number, data: any) {
  return request(`/api/products/${productId}/options`, {
    method: 'POST',
    data,
  });
}

// 更新产品选项
export async function updateProductOption(productId: number, optionId: number, data: any) {
  return request(`/api/products/${productId}/options/${optionId}`, {
    method: 'PUT',
    data,
  });
}

// 删除产品选项
export async function deleteProductOption(productId: number, optionId: number) {
  return request(`/api/products/${productId}/options/${optionId}`, {
    method: 'DELETE',
  });
}

// 管理套餐内容
export async function updatePackageItems(packageId: number, items: Array<{
  productId: number;
  quantity: number;
  notes?: string;
}>) {
  return request(`/api/products/${packageId}/package-items`, {
    method: 'PUT',
    data: { items },
  });
}

// 获取套餐内容
export async function getPackageItems(packageId: number) {
  return request(`/api/products/${packageId}/package-items`, {
    method: 'GET',
  });
}
