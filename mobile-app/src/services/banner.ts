import Taro from '@tarojs/taro';
import { Banner } from '../components/BannerSlider';
import { BASE_URL } from '../config';

/**
 * 获取轮播图数据
 * @param position 轮播图位置，如: home, category等
 * @returns 轮播图数据
 */
export const getBanners = (position: string = 'home') => {
  return Taro.request<{
    code: number;
    message: string;
    data: Banner[];
  }>({
    url: `${BASE_URL}/api/banner`,
    method: 'GET',
    data: { position }
  });
};
