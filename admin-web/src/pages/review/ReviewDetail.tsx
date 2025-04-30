import React from 'react';
import { Modal, Rate, Tag, Image, Space, Button, Divider, Typography } from 'antd';
import { UserOutlined, StarFilled, ClockCircleOutlined, MessageOutlined } from '@ant-design/icons';
import './ReviewDetail.scss';

const { Text, Paragraph } = Typography;

interface ReviewDetailProps {
  visible: boolean;
  review: any;
  onClose: () => void;
  onReply: () => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ 
  visible, 
  review, 
  onClose, 
  onReply 
}) => {
  if (!review) return null;
  
  // 格式化时间
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // 计算好评、中评、差评
  const getRatingTag = (rating: number) => {
    if (rating >= 4) return <Tag color="green">好评</Tag>;
    if (rating >= 3) return <Tag color="orange">中评</Tag>;
    return <Tag color="red">差评</Tag>;
  };

  return (
    <Modal
      title="评价详情"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>关闭</Button>,
        <Button 
          key="reply" 
          type="primary" 
          icon={<MessageOutlined />}
          onClick={onReply}
        >
          {review.reply ? '修改回复' : '回复'}
        </Button>
      ]}
      width={720}
      className="review-detail-modal"
    >
      <div className="review-detail-container">
        {/* 商品信息 */}
        <div className="product-section">
          <div className="product-image">
            <Image 
              src={review.product?.image} 
              width={80} 
              alt={review.product?.name}
              preview={false}
            />
          </div>
          <div className="product-info">
            <div className="product-name">{review.product?.name}</div>
            <div className="product-price">¥{review.product?.price?.toFixed(2)}</div>
          </div>
        </div>
        
        <Divider />
        
        {/* 评价内容 */}
        <div className="review-section">
          <div className="review-header">
            <div className="user-info">
              <UserOutlined />
              <Text className="username">
                {review.isAnonymous ? '匿名用户' : review.user?.username}
              </Text>
            </div>
            
            <div className="review-rating">
              <Rate disabled value={review.rating} />
              {getRatingTag(review.rating)}
            </div>
          </div>
          
          <div className="review-time">
            <ClockCircleOutlined />
            <Text type="secondary">评价时间: {formatDate(review.createdAt)}</Text>
          </div>
          
          <div className="review-content">
            <Paragraph>{review.content}</Paragraph>
          </div>
          
          {/* 评价标签 */}
          {review.tags && review.tags.length > 0 && (
            <div className="review-tags">
              <Space wrap>
                {review.tags.map((tag: string, index: number) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </Space>
            </div>
          )}
          
          {/* 评价图片 */}
          {review.images && review.images.length > 0 && (
            <div className="review-images">
              <Space wrap size={[16, 16]}>
                {review.images.map((image: any, index: number) => (
                  <Image 
                    key={index}
                    src={image.url} 
                    width={120}
                    height={120}
                    alt={`评价图片${index + 1}`}
                    style={{ objectFit: 'cover' }}
                  />
                ))}
              </Space>
            </div>
          )}
          
          {/* 关联订单信息 */}
          <div className="order-info">
            <Text type="secondary">订单编号: {review.order?.orderNumber}</Text>
          </div>
        </div>
        
        <Divider />
        
        {/* 商家回复 */}
        {review.reply && (
          <div className="reply-section">
            <div className="reply-header">
              <StarFilled style={{ color: '#1890ff' }} />
              <Text strong>商家回复:</Text>
              <Text type="secondary">
                {review.replyTime ? formatDate(review.replyTime) : ''}
              </Text>
            </div>
            
            <div className="reply-content">
              <Paragraph>{review.reply}</Paragraph>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReviewDetail;
