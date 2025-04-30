import React, { useRef, useState } from 'react';
import { 
  Card, Button, Rate, Tag, Avatar, Image, Modal, 
  Form, Input, Radio, message, Space, Popconfirm 
} from 'antd';
import {
  UserOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getReviews, replyReview, deleteReview, updateReview } from '../../services/review';
import './ReviewList.scss';

const { TextArea } = Input;

// 定义评价状态类型
type ReviewStatus = 'pending' | 'approved' | 'rejected';

const ReviewList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyForm] = Form.useForm();
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [reviewDetailVisible, setReviewDetailVisible] = useState(false);

  // 处理回复提交
  const handleReplySubmit = async () => {
    const values = await replyForm.validateFields();
    try {
      await replyReview(currentReview.id, values.reply);
      message.success('回复成功');
      setReplyModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('回复评论失败:', error);
      message.error('回复失败');
    }
  };

  // 打开回复对话框
  const openReplyModal = (review: any) => {
    setCurrentReview(review);
    replyForm.setFieldsValue({ reply: review.replyContent || '' });
    setReplyModalVisible(true);
  };

  // 查看评价详情
  const viewReviewDetail = (review: any) => {
    setCurrentReview(review);
    setReviewDetailVisible(true);
  };

  // 删除评价
  const handleDeleteReview = async (id: number) => {
    try {
      await deleteReview(id);
      message.success('评价已删除');
      actionRef.current?.reload();
    } catch (error) {
      console.error('删除评价失败:', error);
      message.error('删除失败');
    }
  };

  // 处理审核状态更改
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateReview(id, { status });
      message.success('评价状态更新成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('更新评价状态失败:', error);
      message.error('状态更新失败');
    }
  };

  // 表格列定义
  const columns: ProColumns<any>[] = [
    {
      title: '评价人',
      dataIndex: 'user',
      render: (_, record) => (
        <div className="review-user">
          <Avatar src={record.user?.avatar} icon={<UserOutlined />} />
          <span className="user-name">{record.user?.username || '匿名用户'}</span>
        </div>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      sorter: true,
      width: 150,
      render: (rating) => <Rate disabled defaultValue={rating} />,
      valueType: 'select',
      valueEnum: {
        1: { text: '1星' },
        2: { text: '2星' },
        3: { text: '3星' },
        4: { text: '4星' },
        5: { text: '5星' },
      },
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (content) => (
        <div className="review-content">{content}</div>
      ),
      search: {
        transform: (value) => ({ content: value }),
      },
    },
    {
      title: '评价对象',
      dataIndex: 'target',
      render: (_, record) => {
        const target = record.targetType === 'product' ? '商品' : 
                     record.targetType === 'photographer' ? '摄影师' : 
                     record.targetType === 'order' ? '订单' : '未知';
        return (
          <Tag color="blue">{target}: {record.targetName || record.targetId}</Tag>
        );
      },
      valueType: 'select',
      valueEnum: {
        product: { text: '商品' },
        photographer: { text: '摄影师' },
        order: { text: '订单' },
      },
    },
    {
      title: '评价图片',
      dataIndex: 'images',
      search: false,
      render: (_, record) => {
        const images = record.images || [];
        return images.length > 0 ? (
          <div className="review-images">
            <Image.PreviewGroup>
              {images.slice(0, 3).map((img: string, index: number) => (
                <Image
                  key={index}
                  src={img}
                  width={50}
                  height={50}
                  style={{ objectFit: 'cover', marginRight: 8 }}
                />
              ))}
              {images.length > 3 && <span>+{images.length - 3}</span>}
            </Image.PreviewGroup>
          </div>
        ) : (
          <span>无图片</span>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        pending: { text: '待审核', status: 'Warning' },
        approved: { text: '已通过', status: 'Success' },
        rejected: { text: '已拒绝', status: 'Error' },
      },
      render: (_, record) => renderStatus(record.status),
    },
    {
      title: '是否回复',
      dataIndex: 'replied',
      valueType: 'select',
      valueEnum: {
        true: { text: '已回复', status: 'Success' },
        false: { text: '未回复', status: 'Warning' },
      },
      render: (_, record) => {
        const hasReply = record.replyContent && record.replyContent.trim().length > 0;
        return hasReply ? (
          <Tag color="green" icon={<CheckOutlined />}>
            已回复
          </Tag>
        ) : (
          <Tag color="orange" icon={<CloseOutlined />}>
            未回复
          </Tag>
        );
      },
    },
    {
      title: '评价时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          onClick={() => viewReviewDetail(record)}
        >
          查看
        </Button>,
        <Button
          key="reply"
          type="link"
          onClick={() => openReplyModal(record)}
        >
          回复
        </Button>,
        record.status === 'pending' && (
          <Space key="actions" size="small">
            <Button
              type="link"
              onClick={() => handleStatusChange(record.id, 'approved')}
            >
              通过
            </Button>
            <Button
              danger
              type="link"
              onClick={() => handleStatusChange(record.id, 'rejected')}
            >
              拒绝
            </Button>
          </Space>
        ),
        <Popconfirm
          key="delete"
          title="确定要删除这条评价吗?"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          onConfirm={() => handleDeleteReview(record.id)}
        >
          <Button danger type="link">
            删除
          </Button>
        </Popconfirm>
      ],
    },
  ];

  // 渲染评价状态
  const renderStatus = (status: string) => {
    const statusConfig = {
      pending: { text: '待审核', color: 'orange' },
      approved: { text: '已通过', color: 'green' },
      rejected: { text: '已拒绝', color: 'red' }
    };
    
    const statusInfo = statusConfig[status as ReviewStatus];
    
    return (
      <Tag color={statusInfo?.color}>{statusInfo?.text}</Tag>
    );
  };

  return (
    <div className="review-list-page">
      <ProTable
        headerTitle="评价管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params = {}, sort, filter) => {
          const sortField = Object.keys(sort)[0];
          const sortOrder = sortField ? sort[sortField] : undefined;
          
          const response = await getReviews({
            page: params.current,
            limit: params.pageSize,
            content: params.content,
            rating: params.rating,
            targetType: params.target,
            status: params.status,
            replied: params.replied === 'true',
            sortField,
            sortOrder,
          });
          
          return {
            data: response.data.items,
            success: true,
            total: response.data.meta.total,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />

      {/* 回复评价对话框 */}
      <Modal
        title="回复评价"
        visible={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={handleReplySubmit}
      >
        <div className="reply-modal-content">
          <div className="original-review">
            <div className="review-header">
              <span className="review-user">{currentReview?.user?.username || '匿名用户'}</span>
              <Rate disabled defaultValue={currentReview?.rating || 5} />
            </div>
            <div className="review-body">{currentReview?.content}</div>
          </div>
          
          <Form
            form={replyForm}
            layout="vertical"
          >
            <Form.Item
              name="reply"
              label="回复内容"
              rules={[{ required: true, message: '请输入回复内容' }]}
            >
              <TextArea rows={4} placeholder="请输入回复内容" />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* 评价详情对话框 */}
      <Modal
        title="评价详情"
        visible={reviewDetailVisible}
        onCancel={() => setReviewDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReviewDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentReview && (
          <div className="review-detail">
            <div className="review-detail-header">
              <div className="user-info">
                <Avatar size={48} src={currentReview.user?.avatar} icon={<UserOutlined />} />
                <div className="user-meta">
                  <div className="username">{currentReview.user?.username || '匿名用户'}</div>
                  <div className="review-time">{new Date(currentReview.createdAt).toLocaleString()}</div>
                </div>
              </div>
              <div className="review-rating">
                <Rate disabled defaultValue={currentReview.rating} />
                <div className="rating-text">{currentReview.rating} 星</div>
              </div>
            </div>
            
            <div className="review-detail-content">
              <div className="content-text">{currentReview.content}</div>
              
              {(currentReview.images && currentReview.images.length > 0) && (
                <div className="review-images-gallery">
                  <Image.PreviewGroup>
                    <div className="images-grid">
                      {currentReview.images.map((image: string, index: number) => (
                        <div key={index} className="image-item">
                          <Image src={image} alt={`Review image ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </Image.PreviewGroup>
                </div>
              )}
              
              <div className="review-target">
                <div className="target-label">评价对象:</div>
                <div className="target-value">
                  {currentReview.targetType === 'product' ? '商品: ' : 
                   currentReview.targetType === 'photographer' ? '摄影师: ' : 
                   currentReview.targetType === 'order' ? '订单: ' : ''}
                  {currentReview.targetName || currentReview.targetId}
                </div>
              </div>
            </div>
            
            {currentReview.replyContent && (
              <div className="review-reply">
                <div className="reply-header">
                  <CommentOutlined /> 商家回复
                </div>
                <div className="reply-content">{currentReview.replyContent}</div>
                <div className="reply-time">
                  回复时间: {currentReview.replyTime ? new Date(currentReview.replyTime).toLocaleString() : '未知'}
                </div>
              </div>
            )}
            
            <div className="review-actions">
              <Space>
                {currentReview.status === 'pending' && (
                  <>
                    <Button 
                      type="primary" 
                      onClick={() => {
                        handleStatusChange(currentReview.id, 'approved');
                        setReviewDetailVisible(false);
                      }}
                    >
                      通过评价
                    </Button>
                    <Button 
                      danger 
                      onClick={() => {
                        handleStatusChange(currentReview.id, 'rejected');
                        setReviewDetailVisible(false);
                      }}
                    >
                      拒绝评价
                    </Button>
                  </>
                )}
                <Button
                  onClick={() => {
                    setReviewDetailVisible(false);
                    openReplyModal(currentReview);
                  }}
                >
                  {currentReview.replyContent ? '修改回复' : '回复'}
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewList;
