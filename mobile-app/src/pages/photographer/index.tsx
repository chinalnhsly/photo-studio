import React, { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtTag, AtSearchBar, AtIcon, AtLoadMore } from 'taro-ui';
import { getPhotographers, getPhotographStyles } from '../../services/photographer';
import './index.scss';

const PhotographerList: React.FC = () => {
  const [photographers, setPhotographers] = useState<any[]>([]);
  const [styles, setStyles] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<number | null>(null);

  useEffect(() => {
    fetchPhotographStyles();
    fetchPhotographers(1);
  }, []);

  // 获取摄影风格列表
  const fetchPhotographStyles = async () => {
    try {
      const response = await getPhotographStyles();
      setStyles(response.data);
    } catch (error) {
      console.error('获取摄影风格失败:', error);
      Taro.showToast({
        title: '获取摄影风格失败',
        icon: 'none'
      });
    }
  };

  // 获取摄影师列表
  const fetchPhotographers = async (pageNum: number, styleId?: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params: any = {
        page: pageNum,
        limit: 10,
        isActive: true
      };

      // 添加风格筛选
      if (styleId) {
        params.specialtyId = styleId;
      }

      // 添加搜索关键词
      if (searchValue) {
        params.keyword = searchValue;
      }

      const response = await getPhotographers(params);

      if (pageNum === 1) {
        setPhotographers(response.data.items);
      } else {
        setPhotographers([...photographers, ...response.data.items]);
      }

      setPage(pageNum);
      setHasMore(response.data.items.length === 10);
    } catch (error) {
      console.error('获取摄影师列表失败:', error);
      Taro.showToast({
        title: '获取摄影师列表失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 处理Tab切换
  const handleTabClick = (index: number) => {
    setCurrent(index);
    setPage(1);
    setHasMore(true);

    // 根据Tab选择筛选条件
    switch (index) {
      case 0: // 全部
        setSelectedStyle(null);
        fetchPhotographers(1);
        break;
      case 1: // 热门
        setSelectedStyle(null);
        fetchPopularPhotographers();
        break;
      default:
        break;
    }
  };

  // 获取热门摄影师
  const fetchPopularPhotographers = async () => {
    try {
      setLoading(true);
      const response = await getPhotographers({ popular: true, limit: 10 });
      setPhotographers(response.data.items);
      setHasMore(false);
    } catch (error) {
      console.error('获取热门摄影师失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理风格筛选
  const handleStyleSelect = (styleId: number) => {
    setSelectedStyle(styleId === selectedStyle ? null : styleId);
    setPage(1);
    fetchPhotographers(1, styleId === selectedStyle ? undefined : styleId);
  };

  // 处理搜索
  const handleSearch = () => {
    setPage(1);
    fetchPhotographers(1, selectedStyle);
  };

  // 处理搜索值变化
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  // 加载更多
  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchPhotographers(page + 1, selectedStyle);
    }
  };

  // 查看摄影师详情
  const viewPhotographerDetail = (id: number) => {
    Taro.navigateTo({
      url: `/pages/photographer/detail?id=${id}`
    });
  };

  return (
    <View className="photographer-list-page">
      <View className="search-container">
        <AtSearchBar
          value={searchValue}
          onChange={handleSearchValueChange}
          onActionClick={handleSearch}
          placeholder="搜索摄影师姓名"
        />
      </View>

      <AtTabs
        current={current}
        tabList={[
          { title: '全部摄影师' },
          { title: '热门摄影师' }
        ]}
        onClick={handleTabClick}
      >
        <AtTabsPane current={current} index={0}>
          <View className="filter-tags">
            <ScrollView scrollX className="tags-scroll">
              {styles.map(style => (
                <AtTag
                  key={style.id}
                  name={style.id.toString()}
                  type="primary"
                  active={selectedStyle === style.id}
                  onClick={() => handleStyleSelect(style.id)}
                  className={selectedStyle === style.id ? 'tag-active' : ''}
                >
                  {style.name}
                </AtTag>
              ))}
            </ScrollView>
          </View>

          {loading ? (
            <View className="loading-container">加载中...</View>
          ) : photographers.length === 0 ? (
            <View className="empty-container">
              <Text className="empty-text">暂无相关摄影师</Text>
            </View>
          ) : (
            <ScrollView
              scrollY
              className="photographer-scroll"
              onScrollToLower={loadMore}
            >
              <View className="photographer-grid">
                {photographers.map(photographer => (
                  <View
                    key={photographer.id}
                    className="photographer-card"
                    onClick={() => viewPhotographerDetail(photographer.id)}
                  >
                    <Image
                      className="photographer-avatar"
                      src={photographer.avatar}
                      mode="aspectFill"
                    />
                    <View className="photographer-info">
                      <Text className="photographer-name">{photographer.name}</Text>
                      
                      <View className="rating-row">
                        <View className="stars">
                          {Array(5).fill(0).map((_, i) => (
                            <Text 
                              key={i} 
                              className={`star ${i < Math.floor(photographer.rating) ? 'filled' : ''}`}
                            >
                              ★
                            </Text>
                          ))}
                        </View>
                        <Text className="rating-value">{photographer.rating.toFixed(1)}</Text>
                      </View>
                      
                      <View className="specialties">
                        {photographer.specialties?.slice(0, 2).map((specialty, index) => (
                          <Text key={index} className="specialty-tag">
                            {specialty.name}
                          </Text>
                        ))}
                        {photographer.specialties?.length > 2 && (
                          <Text className="specialty-tag more">+{photographer.specialties.length - 2}</Text>
                        )}
                      </View>

                      <View className="booking-info">
                        <AtIcon value="calendar" size="14" color="#999" />
                        <Text className="booking-count">已预约 {photographer.totalBookings} 次</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {loadingMore && <AtLoadMore status="loading" />}
              
              {!hasMore && photographers.length > 0 && (
                <View className="no-more">
                  <Text>没有更多摄影师了</Text>
                </View>
              )}
            </ScrollView>
          )}
        </AtTabsPane>

        <AtTabsPane current={current} index={1}>
          {loading ? (
            <View className="loading-container">加载中...</View>
          ) : photographers.length === 0 ? (
            <View className="empty-container">
              <Text className="empty-text">暂无热门摄影师</Text>
            </View>
          ) : (
            <View className="photographer-list">
              {photographers.map((photographer, index) => (
                <View 
                  key={photographer.id} 
                  className="photographer-rank-card"
                  onClick={() => viewPhotographerDetail(photographer.id)}
                >
                  <View className="rank-badge">{index + 1}</View>
                  <Image
                    className="photographer-avatar"
                    src={photographer.avatar}
                    mode="aspectFill"
                  />
                  <View className="photographer-info">
                    <Text className="photographer-name">{photographer.name}</Text>
                    
                    <View className="rating-row">
                      <View className="stars">
                        {Array(5).fill(0).map((_, i) => (
                          <Text 
                            key={i} 
                            className={`star ${i < Math.floor(photographer.rating) ? 'filled' : ''}`}
                          >
                            ★
                          </Text>
                        ))}
                      </View>
                      <Text className="rating-value">{photographer.rating.toFixed(1)}</Text>
                    </View>
                    
                    <View className="book-count">
                      <AtIcon value="calendar" size="14" color="#999" />
                      <Text>已预约 {photographer.totalBookings} 次</Text>
                    </View>
                  </View>
                  <View className="action-button">
                    <Text>立即预约</Text>
                    <AtIcon value="chevron-right" size="14" color="#fff" />
                  </View>
                </View>
              ))}
            </View>
          )}
        </AtTabsPane>
      </AtTabs>
    </View>
  );
};

export default PhotographerList;
