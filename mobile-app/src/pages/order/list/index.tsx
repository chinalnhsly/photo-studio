import React, { useState, useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtTabs, AtTabsPane, AtLoadMore, AtTag, AtIcon } from 'taro-ui';
import { getUserOrders } from '../../../services/order';
import { formatDate, formatPrice } from '../../../utils/format';
import './index.scss';

const OrderList: React.FC = () => {
  // 标签页配置
  const tabList = [
    { title: '全部' },
    { title: '待支付' },
    { title: '待预约' },
    { title: '已完成' },
    { title: '已取消' }
  ];

  const [currentTab, setCurrentTab] = useState(0);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // 获取订单数据
  const fetchOrders = async (pageNum: number = 1, status?: string) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // 确定要查询的状态
      let orderStatus;
      switch (currentTab) {
        case 1: orderStatus = 'pending'; break;   // 待支付
        case 2: orderStatus = 'paid'; break;      // 待预约
        case 3: orderStatus = 'completed'; break; // 已完成
        case 4: orderStatus = 'cancelled'; break; // 已取消
        default: orderStatus = undefined;         // 全部
      }

      const res = await getUserOrders({
        page: pageNum,
        limit: 10,
        status: orderStatus
      });

      if (pageNum === 1) {
        setOrders(res.data);
      } else {
        setOrders(prev => [...prev, ...res.data]);
      }

      setHasMore(res.data.length === 10);
      setPage(pageNum);
    } catch (error) {
      Taro.showToast({
        title: '获取订单失败',
        icon: 'none'
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 处理标签页切换
  const handleTabClick = (index) => {
    setCurrentTab(index);
    setPage(1);
    setOrders([]);
    fetchOrders(1);
  };

  // 加载更多数据
  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchOrders(page + 1);
    }
  };

  // 页面显示时加载数据
  useDidShow(() => {
    setPage(1);
    fetchOrders(1);
  });

  // 处理订单操作
  const handleOrderAction = (orderId: string, action: string) => {
    switch (action) {
      case 'pay':
        Taro.navigateTo({
          url: `/pages/order/payment/index?orderId=${orderId}`
        });
        break;
      case 'cancel':
        Taro.showModal({
          title: '提示',
          content: '确定要取消此订单吗？',
          success: res => {
            if (res.confirm) {
              // TODO: 调用取消订单接口
              Taro.showToast({
                title: '订单已取消',
                icon: 'success'
              });
              // 刷新订单列表
              fetchOrders(1);
            }
          }
        });
        break;
      case 'delete':
        Taro.showModal({
          title: '提示',
          content: '确定要删除此订单吗？删除后不可恢复',
          success: res => {
            if (res.confirm) {
              // TODO: 调用删除订单接口
              Taro.showToast({
                title: '删除成功',
                icon: 'success'
              });
              // 刷新订单列表
              fetchOrders(1);
            }
          }
        });
        break;
      default:
        // 查看订单详情
        Taro.navigateTo({
          url: `/pages/order/detail/index?id=${orderId}`
        });
    }
  };

  // 获取订单状态标签颜色和文本
  const getOrderStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { color: 'orange', text: '待支付' };
      case 'paid':
        return { color: 'blue', text: '待预约' };
      case 'completed':
        return { color: 'green', text: '已完成' };
      case 'cancelled':
        return { color: 'gray', text: '已取消' };
      default:
        return { color: 'gray', text: '未知状态' };
    }
  };

  return (
    <View className="order-list-page">
      <AtTabs 
        current={currentTab} 
        tabList={tabList} 
        onClick={handleTabClick}
        swipeable={false}
      >
        {tabList.map((tab, index) => (
          <AtTabsPane current={currentTab} index={index} key={index}>
            {loading ? (
              <View className="loading-container">
                <Text>加载中...</Text>
              </View>
            ) : orders.length === 0 ? (
              <View className="empty-container">
                <Image 
                  className="empty-image" 
                  src="/assets/images/empty-order.png"
                />
                <Text className="empty-text">暂无订单</Text>
              </View>
            ) : (
              <ScrollView
                className="order-scroll-view"
                scrollY
                scrollWithAnimation
                onScrollToLower={loadMore}
              >
                {orders.map(order => {
                  const statusInfo = getOrderStatusInfo(order.status);
                  
                  return (
                    <View 
                      key={order.id} 
                      className="order-card"
                      onClick={() => handleOrderAction(order.id, 'view')}
                    >
                      <View className="order-header">
                        <Text className="order-number">订单号: {order.orderNumber}</Text>
                        <AtTag 
                          size="small" 
                          type="primary" 
                          color={statusInfo.color}
                        >
                          {statusInfo.text}
                        </AtTag>
                      </View>
                      
                      <View className="order-content">
                        <Image 
                          className="product-image" 
                          src={order.productImage}
                          mode="aspectFill"
                        />
                        
                        <View className="product-info">
                          <Text className="product-name">{order.productName}</Text>
                          <Text className="appointment-date">{order.appointmentDate ? formatDate(order.appointmentDate, 'YYYY-MM-DD HH:mm') : '待预约'}</Text>
                          <View className="price-container">
                            <Text className="price">¥{formatPrice(order.totalAmount)}</Text>
                            <Text className="quantity">x{order.quantity}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View className="order-footer">
                        <Text className="order-time">{formatDate(order.createdAt)}</Text>
                        
                        <View className="action-buttons">
                          {order.status === 'pending' && (
                            <>
                              <View 
                                className="action-button cancel"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderAction(order.id, 'cancel');
                                }}
                              >
                                取消订单
                              </View>
                              <View 
                                className="action-button pay"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderAction(order.id, 'pay');
                                }}
                              >
                                立即支付
                              </View>
                            </>
                          )}
                          
                          {(order.status === 'completed' || order.status === 'cancelled') && (
                            <View 
                              className="action-button delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderAction(order.id, 'delete');
                              }}
                            >
                              删除订单
                            </View>
                          )}
                          
                          {order.status === 'paid' && (
                            <View 
                              className="action-button contact"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: 跳转到客服页面
                              }}
                            >
                              联系客服
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })}
                
                {loadingMore && (
                  <AtLoadMore status="loading" />
                )}
                
                {!hasMore && orders.length > 0 && (
                  <View className="no-more-data">
                    <Text>没有更多订单了</Text>
                  </View>
                )}
              </ScrollView>
            )}
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  );
};

export default OrderList;
