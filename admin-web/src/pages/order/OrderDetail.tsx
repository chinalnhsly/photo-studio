import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Button, 
  message, 
  Steps, 
  Divider, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Spin, 
  Statistic,
  Typography,
  Row,
  Col,
  Timeline,
  Table
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { useParams } from 'umi';
// 使用兼容层导入 history
import { history } from '../../utils/compatibility';
// 修改为相对路径导入
import api from '../../services/api';
import './OrderDetail.less';

const { Step } = Steps;
const { Title, Text } = Typography;

// 订单状态枚举
enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',  // 待支付
  PAID = 'paid',                       // 已支付
  PROCESSING = 'processing',            // 处理中
  COMPLETED = 'completed',              // 已完成
  CANCELLED = 'cancelled',              // 已取消
  REFUNDED = 'refunded'                 // 已退款
}

// 订单项目接口
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

// OrderDetail 组件
const OrderDetail: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
  const [cancelForm] = Form.useForm();
  const [refundForm] = Form.useForm();
  
  useEffect(() => {
    if (params.id) {
      fetchOrderData(params.id);
    }
  }, [params.id]);
  
  // 获取订单数据
  const fetchOrderData = async (orderId: string) => {
    try {
      setLoading(true);
      
      // 在实际项目中，应该调用API获取数据
      // 这里使用模拟数据
      setTimeout(() => {
        setOrderData({
          id: orderId,
          orderNumber: 'ORD' + orderId.padStart(8, '0'),
          status: OrderStatus.PAID,
          customerName: '张三',
          customerPhone: '13800138000',
          packageName: '婚纱摄影高级套餐',
          totalAmount: 6999,
          paidAmount: 6999,
          createdAt: '2023-06-10 14:30:00',
          paymentTime: '2023-06-10 14:35:20',
          shootingTime: '2023-06-15 09:00:00',
          photographer: '李四',
          remarks: '客户要求拍摄自然风格',
          address: '北京市朝阳区摄影基地',
          logs: [
            { time: '2023-06-10 14:30:00', action: '订单创建', operator: '系统' },
            { time: '2023-06-10 14:35:20', action: '订单支付', operator: '张三' },
            { time: '2023-06-14 10:15:00', action: '确认拍摄时间', operator: '客服' }
          ],
          items: [
            { name: '婚纱摄影基础套餐', quantity: 1, price: 4999, total: 4999 },
            { name: '额外拍摄地点', quantity: 1, price: 1000, total: 1000 },
            { name: '额外精修照片', quantity: 10, price: 100, total: 1000 }
          ]
        });
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      message.error('获取订单信息失败');
      setLoading(false);
    }
  };
  
  // 返回列表
  const handleBack = () => {
    history.push('/order/list');
  };
  
  // 获取订单状态标签
  const getStatusTag = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return <Tag color="warning">待支付</Tag>;
      case OrderStatus.PAID:
        return <Tag color="processing">已支付</Tag>;
      case OrderStatus.PROCESSING:
        return <Tag color="blue">处理中</Tag>;
      case OrderStatus.COMPLETED:
        return <Tag color="success">已完成</Tag>;
      case OrderStatus.CANCELLED:
        return <Tag color="default">已取消</Tag>;
      case OrderStatus.REFUNDED:
        return <Tag color="error">已退款</Tag>;
      default:
        return <Tag>未知状态</Tag>;
    }
  };
  
  // 获取订单当前步骤
  const getCurrentStep = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return 0;
      case OrderStatus.PAID:
      case OrderStatus.PROCESSING:
        return 1;
      case OrderStatus.COMPLETED:
        return 2;
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return 3;
      default:
        return 0;
    }
  };
  
  // 处理取消订单
  const handleCancelOrder = async () => {
    try {
      const values = await cancelForm.validateFields();
      
      // 在实际项目中，应该调用API取消订单
      message.loading('正在取消订单...', 1.5)
        .then(() => {
          setOrderData({
            ...orderData,
            status: OrderStatus.CANCELLED
          });
          setCancelModalVisible(false);
          message.success('订单已成功取消');
        });
        
    } catch (error) {
      console.error('取消订单验证失败:', error);
    }
  };
  
  // 处理退款
  const handleRefund = async () => {
    try {
      const values = await refundForm.validateFields();
      
      // 在实际项目中，应该调用API申请退款
      message.loading('正在处理退款...', 1.5)
        .then(() => {
          setOrderData({
            ...orderData,
            status: OrderStatus.REFUNDED
          });
          setRefundModalVisible(false);
          message.success('退款申请已提交');
        });
        
    } catch (error) {
      console.error('退款验证失败:', error);
    }
  };
  
  // 渲染操作按钮
  const renderActionButtons = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return (
          <Space>
            <Button onClick={() => setCancelModalVisible(true)}>取消订单</Button>
            <Button type="primary">去支付</Button>
          </Space>
        );
      case OrderStatus.PAID:
        return (
          <Space>
            <Button onClick={() => setRefundModalVisible(true)}>申请退款</Button>
            <Button type="primary">确认信息</Button>
          </Space>
        );
      case OrderStatus.PROCESSING:
        return (
          <Space>
            <Button onClick={() => setRefundModalVisible(true)}>申请退款</Button>
            <Button type="primary">完成服务</Button>
          </Space>
        );
      case OrderStatus.COMPLETED:
        return <Button type="primary">评价服务</Button>;
      default:
        return null;
    }
  };
  
  // 表格列配置
  const columns = [
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { 
      title: '单价', 
      dataIndex: 'price', 
      key: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`
    },
    { 
      title: '小计', 
      dataIndex: 'total', 
      key: 'total',
      render: (total: number) => `¥${total.toFixed(2)}`
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="order-detail-page">
        <Card 
          title={
            <div className="page-title">
              <Button onClick={handleBack} icon={<i className="fas fa-arrow-left" />} style={{ marginRight: 16 }}>
                返回
              </Button>
              订单详情
            </div>
          }
        >
          {orderData ? (
            <>
              <div className="order-header">
                <div className="order-title">
                  <Title level={4}>{orderData.orderNumber}</Title>
                  {getStatusTag(orderData.status)}
                </div>
                <div className="order-actions">
                  {renderActionButtons(orderData.status)}
                </div>
              </div>
              
              <Steps current={getCurrentStep(orderData.status)} className="order-steps">
                <Step title="创建订单" description={orderData.createdAt} />
                <Step title="已支付" description={orderData.paymentTime || '--'} />
                <Step title="已完成" description={orderData.completedTime || '--'} />
                {orderData.status === OrderStatus.CANCELLED || orderData.status === OrderStatus.REFUNDED ? (
                  <Step 
                    status={orderData.status === OrderStatus.REFUNDED ? "finish" : "error"} 
                    title={orderData.status === OrderStatus.REFUNDED ? "已退款" : "已取消"} 
                    icon={orderData.status === OrderStatus.REFUNDED ? <CheckCircleOutlined /> : <CloseCircleOutlined />} 
                    description={orderData.cancelTime || orderData.refundTime || '--'} 
                  />
                ) : (
                  <Step title="其他操作" />
                )}
              </Steps>
              
              <Divider />
              
              <Row gutter={24}>
                <Col xs={24} lg={16}>
                  <Card title="订单信息" bordered={false}>
                    <Descriptions column={{ xs: 1, sm: 2 }}>
                      <Descriptions.Item label="客户姓名">{orderData.customerName}</Descriptions.Item>
                      <Descriptions.Item label="联系电话">{orderData.customerPhone}</Descriptions.Item>
                      <Descriptions.Item label="套餐名称">{orderData.packageName}</Descriptions.Item>
                      <Descriptions.Item label="拍摄时间">{orderData.shootingTime}</Descriptions.Item>
                      <Descriptions.Item label="拍摄地点">{orderData.address}</Descriptions.Item>
                      <Descriptions.Item label="摄影师">{orderData.photographer}</Descriptions.Item>
                      <Descriptions.Item label="创建时间" span={2}>{orderData.createdAt}</Descriptions.Item>
                      <Descriptions.Item label="备注" span={2}>{orderData.remarks || '无'}</Descriptions.Item>
                    </Descriptions>
                  </Card>
                  
                  <Card title="订单明细" bordered={false} style={{ marginTop: 16 }}>
                    <Table 
                      dataSource={orderData.items}
                      columns={columns}
                      pagination={false}
                      rowKey="name"
                      summary={(pageData: OrderItem[]) => {
                        let totalPrice = 0;
                        pageData.forEach(({ total }: OrderItem) => {
                          totalPrice += total;
                        });
                        
                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell index={0} colSpan={3} align="right">
                                <Text strong>总计</Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={1}>
                                <Text type="danger" strong>¥{totalPrice.toFixed(2)}</Text>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
                    />
                  </Card>
                </Col>
                
                <Col xs={24} lg={8}>
                  <Card title="支付信息" bordered={false}>
                    <div className="payment-info">
                      <div className="amount-row">
                        <span className="label">订单金额</span>
                        <span className="value">¥{orderData.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="amount-row">
                        <span className="label">已支付</span>
                        <span className="value">¥{orderData.paidAmount.toFixed(2)}</span>
                      </div>
                      <div className="amount-row total">
                        <span className="label">应付金额</span>
                        <span className="value">¥{(orderData.totalAmount - orderData.paidAmount).toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card title="订单日志" bordered={false} style={{ marginTop: 16 }}>
                    <Timeline>
                      {orderData.logs.map((log: any, index: number) => (
                        <Timeline.Item key={index}>
                          <p>{log.action}</p>
                          <p className="timeline-time">
                            <small>{log.time}</small>
                            <small style={{ marginLeft: 8 }}>操作人: {log.operator}</small>
                          </p>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div className="empty-data">找不到该订单信息</div>
          )}
        </Card>
      </div>
      
      {/* 取消订单对话框 */}
      <Modal
        title="取消订单"
        open={cancelModalVisible}
        onOk={handleCancelOrder}
        onCancel={() => setCancelModalVisible(false)}
        okText="确认取消"
        cancelText="返回"
      >
        <Form form={cancelForm} layout="vertical">
          <Form.Item
            name="reason"
            label="取消原因"
            rules={[{ required: true, message: '请填写取消原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请填写取消原因" />
          </Form.Item>
        </Form>
        <div className="modal-tip">
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          取消订单后将无法恢复，请确认您的操作。
        </div>
      </Modal>
      
      {/* 申请退款对话框 */}
      <Modal
        title="申请退款"
        open={refundModalVisible}
        onOk={handleRefund}
        onCancel={() => setRefundModalVisible(false)}
        okText="提交申请"
        cancelText="返回"
      >
        <Form form={refundForm} layout="vertical">
          <Form.Item label="订单金额">
            <Statistic value={orderData?.totalAmount || 0} precision={2} prefix="¥" />
          </Form.Item>
          <Form.Item
            name="refundAmount"
            label="退款金额"
            rules={[
              { required: true, message: '请填写退款金额' },
              {
                validator: (_: unknown, value: number) => {
                  if (value > (orderData?.totalAmount || 0)) {
                    return Promise.reject('退款金额不能超过订单金额');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input prefix="¥" type="number" placeholder="请填写退款金额" />
          </Form.Item>
          <Form.Item
            name="refundReason"
            label="退款原因"
            rules={[{ required: true, message: '请填写退款原因' }]}
          >
            <Input.TextArea rows={4} placeholder="请填写退款原因" />
          </Form.Item>
        </Form>
        <div className="modal-tip">
          <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          退款申请提交后，需等待管理员审核，请耐心等待。
        </div>
      </Modal>
    </Spin>
  );
};

export default OrderDetail;
