import request from '../utils/request';

/**
 * 获取评价列表
 * @param params 查询参数
 */
export async function getReviews(params?: any) {
  return request('/api/reviews', {
    method: 'GET',
    params,
  });
}

/**
 * 获取评价详情
 * @param id 评价ID
 */
export async function getReviewDetail(id: number) {
  return request(`/api/reviews/${id}`, {
    method: 'GET',
  });
}

/**
 * 获取指定摄影师的评价
 * @param photographerId 摄影师ID
 * @param params 查询参数
 */
export async function getPhotographerReviews(photographerId: number, params?: any) {
  return request(`/api/reviews/photographer/${photographerId}`, {
    method: 'GET',
    params,
  });
}

/**
 * 回复评价
 * @param id 评价ID
 * @param content 回复内容
 */
export async function replyReview(id: number, content: string) {
  return request(`/api/reviews/${id}/reply`, {
    method: 'POST',
    data: { content },
  });
}

/**
 * 更新评价
 * @param id 评价ID
 * @param data 更新数据
 */
export async function updateReview(id: number, data: any) {
  return request(`/api/reviews/${id}`, {
    method: 'PATCH',
    data,
  });
}

/**
 * 删除评价
 * @param id 评价ID
 */
export async function deleteReview(id: number) {
  return request(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 获取评价统计数据
 * @param params 查询参数
 */
export async function getReviewStats(params?: any) {
  return request('/api/reviews/stats', {
    method: 'GET',
    params,
  });
}

/**
 * 获取评价趋势数据
 * @param params 查询参数
 */
export async function getReviewTrends(params?: any) {
  return request('/api/reviews/trends', {
    method: 'GET',
    params,
  });
}

/**
 * 获取评价关键词分析
 * @param params 查询参数
 */
export async function getReviewKeywords(params?: any) {
  return request('/api/reviews/keywords', {
    method: 'GET',
    params,
  });
}

/**
 * 获取热门评价产品
 * @param params 查询参数
 */
export async function getTopReviewedProducts(params?: any) {
  return request('/api/reviews/top-products', {
    method: 'GET',
    params,
  });
}

/**
 * 获取摄影师评价汇总
 * @param params 查询参数
 */
export async function getPhotographerReviewSummary(params?: any) {
  return request('/api/reviews/photographer-summary', {
    method: 'GET',
    params,
  });
}
