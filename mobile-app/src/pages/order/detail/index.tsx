import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import { AtIcon, AtTimeline, AtDivider, AtModal } from 'taro-ui';
import { getOrderDetail, cancelOrder } from '../../../services/order';
import { formatDate, formatPrice } from '../../../utils/format';
import './index.scss';

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.params;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // 获取订单详情
  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await getOrderDetail(id);
        setOrder(res.data);
      } catch (error) {
        Taro.showToast({
          title: '获取订单详情失败',
          icon: 'none'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // 获取订单状态文本和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '等待支付', color: '#faad14' };
      case 'paid':
        return { text: '已支付，等待预约', color: '#1890ff' };
      case 'scheduled':
        return { text: '已预约，等待服务', color: '#52c41a' };
      case 'completed':
        return { text: '已完成', color: '#52c41a' };
      case 'cancelled':
        return { text: '已取消', color: '#999999' };
      default:
        return { text: '未知状态', color: '#999999' };
    }
  };

  // 处理订单操作
  const handleOrderAction = (action: string) => {
    switch (action) {
      case 'pay':
        Taro.navigateTo({
          url: `/pages/order/payment/index?orderId=${id}`
        });
        break;
      case 'cancel':
        setModalVisible(true);
        break;
      case 'contact':
        // 跳转到客服页面或拨打电话
        Taro.makePhoneCall({
          phoneNumber: '400-123-4567',
          fail: () => {
            Taro.showToast({
              title: '拨打电话失败',
              icon: 'none'
            });
          }
        });
        break;
      default:
        break;
    }
  };

  // 处理取消订单
  const handleCancelOrder = async () => {
    if (!cancelReason) {
      Taro.showToast({
        title: '请选择取消原因',
        icon: 'none'
      });
      return;
    }

    try {
      setCancelLoading(true);
      await cancelOrder(id, cancelReason);
      
      Taro.showToast({
        title: '订单已取消',
        icon: 'success'
      });
      
      setModalVisible(false);
      
      // 重新获取订单详情
      const res = await getOrderDetail(id);
      setOrder(res.data);
    } catch (error) {
      Taro.showToast({
        title: '取消订单失败',
        icon: 'none'
      });
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="order-detail-loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="order-detail-error">
        <Text>订单不存在或已删除</Text>
        <Button 
          className="back-button"
          onClick={() => Taro.navigateBack()}
        >
          返回订单列表
        </Button>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  
  return (
    <View className="order-detail-page">
      <ScrollView className="order-detail-scroll" scrollY>
        {/* 订单状态 */}
        <View className="status-section" style={{ backgroundColor: statusInfo.color }}>
          <View className="status-content">
            <Text className="status-text">{statusInfo.text}</Text>
            {order.status === 'pending' && (
              <Text className="status-desc">请在 {formatDate(order.expireTime)} 前完成支付</Text>
            )}
          </View>
        </View>
        
        {/* 订单进度时间轴 */}
        <View className="timeline-section">
          <AtTimeline
            items={[
              { title: '订单创建', content: [formatDate(order.createdAt)] },
              ...(order.paidAt ? [{ title: '支付完成', content: [formatDate(order.paidAt)] }] : []),
              ...(order.appointmentDate ? [{ title: '预约时间', content: [formatDate(order.appointmentDate)] }] : []),
              ...(order.completedAt ? [{ title: '服务完成', content: [formatDate(order.completedAt)] }] : []),
              ...(order.cancelledAt ? [{ title: '订单取消', content: [formatDate(order.cancelledAt), `原因: ${order.cancelReason || '用户取消'}`] }] : [])
            ]}
          />
        </View>
        
        {/* 预约信息 */}
        {order.status !== 'pending' && order.status !== 'cancelled' && (
          <View className="appointment-section">
            <View className="section-title">
              <AtIcon value="calendar" size="16" color="#333" />
              <Text>预约信息</Text>
            </View>
            
            <View className="info-item">
              <Text className="label">预约时间</Text>
              <Text className="value">{order.appointmentDate ? formatDate(order.appointmentDate, 'YYYY-MM-DD HH:mm') : '待预约'}</Text>
            </View>
            
            <View className="info-item">
              <Text className="label">预约人</Text>
              <Text className="value">{order.customerName}</Text>
            </View>
            
            <View className="info-item">
              <Text className="label">联系电话</Text>
              <Text className="value">{order.customerPhone}</Text>
            </View>
            
            {order.remark && (
              <View className="info-item">
                <Text className="label">备注</Text>
                <Text className="value">{order.remark}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* 商品信息 */}
        <View className="product-section">
          <View className="section-title">
            <AtIcon value="shopping-bag" size="16" color="#333" />
            <Text>商品信息</Text>
          </View>
          
          <View className="product-card">
            <Image 
              className="product-image" 
              src={order.productImage}
              mode="aspectFill"
            />
            
            <View className="product-info">
              <Text className="product-name">{order.productName}</Text>
              <View className="price-row">
                <Text className="price">¥{formatPrice(order.price)}</Text>
                <Text className="quantity">x{order.quantity}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* 订单信息 */}
        <View className="order-info-section">
          <View className="section-title">
            <AtIcon value="bookmark" size="16" color="#333" />
            <Text>订单信息</Text>
          </View>
          
          <View className="info-item">
            <Text className="label">订单编号</Text>
            <Text className="value">{order.orderNumber}</Text>
          </View>
          
          <View className="info-item">
            <Text className="label">创建时间</Text>
            <Text className="value">{formatDate(order.createdAt)}</Text>
          </View>
          
          <View className="info-item">
            <Text className="label">支付方式</Text>
            <Text className="value">{order.paymentMethod || '未支付'}</Text>
          </View>
          
          {order.transactionId && (
            <View className="info-item">
              <Text className="label">交易流水号</Text>
              <Text className="value">{order.transactionId}</Text>
            </View>
          )}
        </View>
        
        {/* 金额信息 */}
        <View className="price-section">
          <View className="price-item">
            <Text>商品金额</Text>
            <Text>¥{formatPrice(order.price * order.quantity)}</Text>
          </View>
          
          {order.discountAmount > 0 && (
            <View className="price-item">
              <Text>优惠金额</Text>
              <Text>-¥{formatPrice(order.discountAmount)}</Text>
            </View>
          )}
          
          <AtDivider height={1} lineColor="#f0f0f0" />
          
          <View className="price-item total">
            <Text>实付金额</Text>
            <Text className="total-price">¥{formatPrice(order.totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* 底部操作栏 */}
      {['pending', 'paid'].includes(order.status) && (
        <View className="action-bar">
          <View className="left-actions">
            <Button 
              className="action-button contact"
              onClick={() => handleOrderAction('contact')}
            >
              联系客服
            </Button>
          </View>
          
          <View className="right-actions">
            {order.status === 'pending' && (
              <>
                <Button 
                  className="action-button cancel"
                  onClick={() => handleOrderAction('cancel')}
                >
                  取消订单
                </Button>
                
                <Button 
                  className="action-button pay"
                  onClick={() => handleOrderAction('pay')}
                >
                  立即支付
                </Button>
              </>
            )}
            
            {order.status === 'paid' && (
              <Button 
                className="action-button contact-wide"
                onClick={() => handleOrderAction('contact')}
              >
                联系客服预约
              </Button>
            )}
          </View>
        </View>
      )}
      
      {/* 取消订单模态框 */}
      <AtModal
        isOpened={modalVisible}
        title="取消订单"
        cancelText="返回"
        confirmText="确认取消"
        onClose={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        onConfirm={handleCancelOrder}
      >
        <View className="cancel-modal-content">
          <Text className="modal-subtitle">请选择取消原因：</Text>
          
          {['我不想要了', '信息填写错误', '重新拍摄', '其他原因'].map(reason => (
            <View 
              key={reason}
              className={`reason-item ${cancelReason === reason ? 'active' : ''}`}
              onClick={() => setCancelReason(reason)}
            >
              <Text>{reason}</Text>
              {cancelReason === reason && (
                <AtIcon value="check" size="14" color="#1890ff" />
              )}
            </View>
          ))}
        </View>
      </AtModal>
    </View>
  );
};

export default OrderDetail;
