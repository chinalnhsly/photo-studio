import React from 'react';
import { Swiper, SwiperItem, Image } from '@tarojs/components';
import './index.scss';

/**
 * Banner 轮播图组件
 * @param {Object} props - 组件属性
 * @param {Array} props.banners - Banner图片列表
 * @param {Function} props.onClick - 点击事件处理函数
 */
const Banner = ({ banners = [], onClick }) => {
  const defaultBanners = banners.length > 0 ? banners : [
    { id: '1', image: 'https://placehold.co/750x300/FFC0CB/fff?text=促销活动' },
    { id: '2', image: 'https://placehold.co/750x300/E6E6FA/fff?text=新品上线' },
    { id: '3', image: 'https://placehold.co/750x300/F0FFF0/fff?text=限时优惠' }
  ];
  
  const handleClick = (banner) => {
    if (onClick) {
      onClick(banner);
    }
  };
  
  return (
    <Swiper 
      className='banner-swiper'
      indicatorColor='#ffffff50'
      indicatorActiveColor='#ffffff'
      circular
      indicatorDots
      autoplay
    >
      {defaultBanners.map(banner => (
        <SwiperItem key={banner.id} onClick={() => handleClick(banner)}>
          <Image className='banner-image' src={banner.image} mode='aspectFill' />
        </SwiperItem>
      ))}
    </Swiper>
  );
};

export default Banner;
