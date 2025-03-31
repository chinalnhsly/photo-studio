import useSWR from 'swr';
import { api } from '@/services/api';
import { message } from 'antd';

export function useCategories() {
  const { data: response, error, mutate } = useSWR(
    '/categories',
    async () => {
      try {
        const result = await api.get('/categories');
        console.log('分类数据响应:', result.data);
        
        // 确保返回的数据格式正确
        const categories = result.data?.data || [];
        if (!Array.isArray(categories)) {
          console.error('分类数据格式错误:', categories);
          return { data: [] };
        }
        
        return { data: categories };
      } catch (error) {
        console.error('获取分类列表失败:', error);
        message.error('获取分类列表失败');
        return { data: [] };
      }
    },
    {
      // 添加自动重新获取配置
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10秒内不重复请求
    }
  );

  return {
    data: response?.data || [],
    loading: !error && !response,
    error,
    refresh: mutate
  };
}
