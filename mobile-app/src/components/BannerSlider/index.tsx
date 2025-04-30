import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { Swiper, SwiperItem, Image, View } from '@tarojs/components';
import { getBanners } from '../../services/banner';
import './index.scss';

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  description?: string;
}

interface BannerSliderProps {
  /**
   * 轮播图位置，如: home, category等
   */
  position?: string;
  /**
   * 自动轮播间隔时间(ms)
   */
  interval?: number;
  /**
   * 是否显示面板指示点
   */
  indicatorDots?: boolean;
  /**
   * 指示点颜色
   */
  indicatorColor?: string;
  /**
   * 当前选中的指示点颜色
   */
  indicatorActiveColor?: string;
  /**
   * 是否自动切换
   */
  autoplay?: boolean;
  /**
   * 是否循环轮播
   */
  circular?: boolean;
  /**
   * 轮播图高度
   */
  height?: string;
  /**
   * 图片模式
   */
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix';
  /**
   * 点击轮播图事件
   */
  onClick?: (banner: Banner) => void;
  /**
   * 自定义轮播数据
   */
  banners?: Banner[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  position = 'home',
  interval = 3000,
  indicatorDots = true,
  indicatorColor = 'rgba(0, 0, 0, .3)',
  indicatorActiveColor = '#1890ff',
  autoplay = true,
  circular = true,
  height = '350rpx',
  mode = 'aspectFill',
  onClick,
  banners: propBanners
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 加载轮播图数据
  useEffect(() => {
    // 如果外部传入了轮播数据，直接使用
    if (propBanners) {
      setBanners(propBanners);
      setLoading(false);
      return;
    }

    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await getBanners(position);
        if (res.data && res.data.length > 0) {
          setBanners(res.data);
        } else {
          // 如果没有数据，设置默认轮播图
          setBanners([
            {
              id: 1,
              title: '默认轮播图',
              imageUrl: 'https://via.placeholder.com/750x350/1890ff/ffffff?text=Banner+1',
            }
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error('获取轮播图失败:', err);
        setError('获取轮播图数据失败');
        setLoading(false);
        // 设置默认轮播图
        setBanners([
          {
            id: 1,
            title: '默认轮播图',
            imageUrl: 'https://via.placeholder.com/750x350/1890ff/ffffff?text=Banner+1',
          }
        ]);
      }
    };

    fetchBanners();
  }, [position, propBanners]);

  // 处理轮播图点击
  const handleBannerClick = (banner: Banner) => {
    if (onClick) {
      onClick(banner);
      return;
    }

    // 默认处理方式 - 如果有链接则跳转
    if (banner.linkUrl) {
      // 判断链接类型
      if (banner.linkUrl.startsWith('/pages/')) {
        // 内部页面跳转
        Taro.navigateTo({
          url: banner.linkUrl
        });
      } else if (banner.linkUrl.startsWith('http')) {
        // 外部链接跳转到web-view
        Taro.navigateTo({
          url: `/pages/webview/index?url=${encodeURIComponent(banner.linkUrl)}`
        });
      }
    }
  };

  // 轮播变化事件
  const handleSwiperChange = (e) => {
    setCurrentIndex(e.detail.current);
  };

  // 如果数据为空且没有加载中
  if (!loading && banners.length === 0) {
    return null;
  }

  return (
    <View className="banner-slider-container">
      {loading ? (
        <View className="banner-slider-loading" style={{ height }}>
          加载中...
        </View>
      ) : error ? (
        <View className="banner-slider-error" style={{ height }}>
          {error}
        </View>
      ) : (
        <Swiper
          className="banner-slider"
          style={{ height }}
          indicatorDots={indicatorDots}
          indicatorColor={indicatorColor}
          indicatorActiveColor={indicatorActiveColor}
          autoplay={autoplay}
          interval={interval}
          circular={circular}
          current={currentIndex}
          onChange={handleSwiperChange}
        >
          {banners.map(banner => (
            <SwiperItem 
              key={banner.id} 
              className="banner-slider-item"
              onClick={() => handleBannerClick(banner)}
            >
              <Image
                className="banner-slider-image"
                src={banner.imageUrl}
                mode={mode}
                lazyLoad
              />
              {banner.title && (
                <View className="banner-slider-title">
                  {banner.title}
                </View>
              )}
            </SwiperItem>
          ))}
        </Swiper>
      )}

      {/* 自定义指示器 */}
      {!indicatorDots && banners.length > 1 && (
        <View className="banner-slider-indicators">
          {banners.map((_, index) => (
            <View 
              key={index} 
              className={`banner-slider-indicator ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default BannerSlider;
