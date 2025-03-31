import useSWR from 'swr';
import { api } from '@/services/api';
import type { Product } from '@prisma/client';

interface ProductsResponse {
  items: Product[];
  total: number;
}

export function useProducts(params?: any) {
  const { data, error, mutate } = useSWR<ProductsResponse>(
    '/products',
    () => api.get('/products', { params }).then(res => res.data)
  );

  return {
    data,
    loading: !error && !data,
    error,
    refresh: mutate
  };
}
