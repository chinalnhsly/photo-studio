import React, { useState, useEffect } from 'react';
import { history, useParams } from 'umi';
import {
  Card,
  Descriptions,
  Button,
  Tabs,
  Table,
  Tag,
  Row,
  Col,
  Statistic,
  Avatar,
  Typography,
  Space,
  List,
  Empty,
  Divider,
  Timeline,
  Badge,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  CalendarOutlined,
  TeamOutlined,
  PlusOutlined,
  MinusOutlined,
  HistoryOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { 
  getMemberById, 
  getMemberOrders, 
  getMemberLogs, 
  getMemberBookings,
  addMemberPoints 
} from '../../services/member';
import { PointLogType } from '../../types/member';
import './MemberDetail.scss';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const MemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [pointLogs, setPointLogs] = useState<any[]>([]);
  const [pointsModalVisible, setPointsModalVisible] = useState(false);
  const [pointsForm] = Form.useForm();
  
  // 加载会员数据
  useEffect(() => {
    fetchMemberData();
  }, [id]);
  
  const fetchMemberData = async () => {
    setLoading(true);
    try {
      // 获取会员基本信息
      const memberResponse = await getMemberById(parseInt(id));
      setMember(memberResponse.data);
      
      // 获取会员订单
      const ordersResponse = await getMemberOrders(parseInt(id));
      setOrders(ordersResponse.data.items);
      
      // 获取会员预约
      const bookingsResponse = await getMemberBookings(parseInt(id));
      setBookings(bookingsResponse.data.items);
      
      // 获取积分记录
      const pointLogsResponse = await getMemberLogs(parseInt(id), {
        sortField: 'createdAt',
        sortOrder: 'desc'
      });
      setPointLogs(pointLogsResponse.data.items);
      
    } catch (error) {
      console.error('获取会员数据失败:', error);
      message.error('获取会员数据失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理调整积分
  const handleAdjustPoints = async (values: any) => {
    try {
      const { points, type, description } = values;
      await addMemberPoints(parseInt(id), {
        points: parseInt(points),
        type: type as PointLogType,
        description
      });
      
      message.success('积分调整成功');
      setPointsModalVisible(false);
      
      // 刷新会员数据和积分记录
      fetchMemberData();
    } catch (error) {
      console.error('积分调整失败:', error);
      message.error('积分调整失败');
    }
  };
  
  // 订单表格列
  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: any) => (
        <a onClick={() => history.push(`/order/detail/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'orange', text: '待处理' },
          processing: { color: 'blue', text: '处理中' },
          completed: { color: 'green', text: '已完成' },
          cancelled: { color: 'red', text: '已取消' },
          refunded: { color: 'red', text: '已退款' },
        };
        const statusInfo = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        type BadgeStatusType = 'default' | 'error' | 'success' | 'processing' | 'warning';
        const statusMap: Record<string, { color: BadgeStatusType; text: string }> = {
          unpaid: { color: 'warning', text: '未支付' },
          paid: { color: 'success', text: '已支付' },
          refunded: { color: 'error', text: '已退款' },
          partial_paid: { color: 'processing', text: '部分支付' },
        };
        const statusInfo = statusMap[status] || { color: 'default', text: '未知' };
        return <Badge status={statusInfo.color} text={statusInfo.text} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          size="small" 
          onClick={() => history.push(`/order/detail/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];
  
  // 预约表格列
  const bookingColumns = [
    {
      title: '预约日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '时间段',
      key: 'timeRange',
      render: (_: any, record: any) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: '拍摄类型',
      dataIndex: 'shootingType',
      key: 'shootingType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          standard: '标准',
          wedding: '婚礼',
          portrait: '人像',
          family: '家庭',
          children: '儿童',
          maternity: '孕妇',
          newborn: '新生儿',
          event: '活动',
          product: '产品',
          commercial: '商业',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: '摄影师',
      dataIndex: 'photographer',
      key: 'photographer',
      render: (photographer: any) => photographer?.name || '未分配',
    },
    {
      title: '工作室',
      dataIndex: 'studio',
      key: 'studio',
      render: (studio: any) => studio?.name || '未指定',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          pending: { color: 'orange', text: '待确认' },
          confirmed: { color: 'green', text: '已确认' },
          cancelled: { color: 'red', text: '已取消' },
          completed: { color: 'blue', text: '已完成' },
          in_progress: { color: 'purple', text: '进行中' },
          no_show: { color: 'black', text: '未到店' },
          rescheduled: { color: 'geekblue', text: '已改期' },
        };
        const statusInfo = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          size="small" 
          onClick={() => history.push(`/booking/detail/${record.id}`)}
        >
          详情
        </Button>
      ),
    },
  ];
  
  // 渲染会员基本信息
  const renderMemberInfo = () => {
    if (!member) return null;
    
    // 确保user属性存在
    const user = member.user || {};
    
    return (
      <div className="member-basic-info">
        <div className="member-header">
          <div className="member-avatar">
            <Avatar 
              size={84} 
              src={user.avatar} 
              icon={<UserOutlined />}
            />
          </div>
          <div className="member-title">
            <Title level={4}>
              {user.username || '未设置姓名'}
              {member.isActive ? (
                <Tag color="green" className="status-tag">活跃</Tag>
              ) : (
                <Tag color="red" className="status-tag">停用</Tag>
              )}
            </Title>
            <div className="member-metadata">
              <Space size="large">
                {member.level && (
                  <div className="member-level">
                    <CreditCardOutlined />
                    <span>{member.level.name}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="member-phone">
                    <PhoneOutlined />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.email && (
                  <div className="member-email">
                    <MailOutlined />
                    <span>{user.email}</span>
                  </div>
                )}
              </Space>
            </div>
            <div className="member-tags">
              {member.isSubscribed && <Tag color="blue">订阅营销信息</Tag>}
              {user.isMember && <Tag color="purple">注册会员</Tag>}
              {member.notes && (
                <Tooltip title={member.notes}>
                  <Tag color="orange" icon={<InfoCircleOutlined />}>会员备注</Tag>
                </Tooltip>
              )}
            </div>
          </div>
          <div className="member-actions">
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => history.push(`/member/edit/${id}`)}
            >
              编辑信息
            </Button>
          </div>
        </div>
        
        <Row gutter={24} className="stats-row">
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="积分"
                value={member.points || 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <div className="stat-actions">
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => {
                    pointsForm.resetFields();
                    pointsForm.setFieldsValue({
                      type: 'admin_adjust',
                      points: 0
                    });
                    setPointsModalVisible(true);
                  }}
                >
                  调整积分
                </Button>
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="累计消费"
                value={member.totalSpent || 0}
                precision={2}
                prefix="¥"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="订单数"
                value={member.orderCount || 0}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className="stat-card">
              <Statistic
                title="注册天数"
                value={
                  member.createdAt 
                    ? Math.ceil((new Date().getTime() - new Date(member.createdAt).getTime()) / (1000 * 3600 * 24))
                    : 0
                }
                suffix="天"
              />
              <div className="stat-note">
                注册于 {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : '未知'}
              </div>
            </Card>
          </Col>
        </Row>
        
        <Card title="会员详细信息" className="info-card">
          <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="会员ID">{member.id}</Descriptions.Item>
            <Descriptions.Item label="用户ID">{member.userId}</Descriptions.Item>
            <Descriptions.Item label="会员等级">{member.level ? member.level.name : '无等级'}</Descriptions.Item>
            <Descriptions.Item label="生日">
              {member.birthday ? new Date(member.birthday).toLocaleDateString() : '未设置'}
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {member.isActive ? '活跃' : '停用'}
            </Descriptions.Item>
            <Descriptions.Item label="营销订阅">
              {member.isSubscribed ? '已订阅' : '未订阅'}
            </Descriptions.Item>
            <Descriptions.Item label="最近消费" span={2}>
              {member.lastPurchaseDate ? new Date(member.lastPurchaseDate).toLocaleString() : '无消费记录'}
            </Descriptions.Item>
            <Descriptions.Item label="最近活动" span={2}>
              {member.lastActivityDate ? new Date(member.lastActivityDate).toLocaleString() : '无活动记录'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {member.createdAt ? new Date(member.createdAt).toLocaleString() : '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {member.updatedAt ? new Date(member.updatedAt).toLocaleString() : '未知'}
            </Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {member.notes || '无'}
            </Descriptions.Item>
            <Descriptions.Item label="地址" span={3}>
              {member.address || '未设置'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  };
  
  // 渲染积分记录
  const renderPointsHistory = () => {
    return (
      <Card title="积分记录" className="points-card">
        <div className="point-actions">
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              pointsForm.resetFields();
              pointsForm.setFieldsValue({
                type: 'admin_adjust',
                points: 0
              });
              setPointsModalVisible(true);
            }}
          >
            调整积分
          </Button>
        </div>
        
        {pointLogs.length === 0 ? (
          <Empty description="暂无积分记录" />
        ) : (
          <Timeline mode="left" className="points-timeline">
            {pointLogs.map((log) => {
              const isPositive = log.points > 0;
              const pointClass = isPositive ? 'positive' : 'negative';
              
              return (
                <Timeline.Item 
                  key={log.id} 
                  color={isPositive ? 'green' : 'red'}
                >
                  <div className="point-log-item">
                    <div className="point-log-content">
                      <div className="point-log-title">
                        <span className="point-log-type">
                          {log.type === 'purchase' && '消费'}
                          {log.type === 'refund' && '退款'}
                          {log.type === 'register' && '注册'}
                          {log.type === 'sign_in' && '签到'}
                          {log.type === 'exchange' && '积分兑换'}
                          {log.type === 'admin_adjust' && '管理员调整'}
                          {log.type === 'expired' && '积分过期'}
                          {log.type === 'event' && '活动'}
                          {log.type === 'referral' && '推荐'}
                          {log.type === 'review' && '评价'}
                          {log.type === 'other' && '其他'}
                        </span>
                        <span className={`point-change ${pointClass}`}>
                          {isPositive ? '+' : ''}{log.points}
                        </span>
                      </div>
                      <div className="point-log-description">
                        {log.description || (isPositive ? '增加积分' : '减少积分')}
                      </div>
                      <div className="point-log-balance">
                        积分余额: <strong>{log.balanceAfter}</strong>
                      </div>
                    </div>
                    <div className="point-log-time">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </Card>
    );
  };
  
  return (
    <div className="member-detail-page">
      <div className="page-header">
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => history.push('/member/list')}
        >
          返回列表
        </Button>
        <h2>会员详情</h2>
      </div>
      
      {loading ? (
        <div className="loading-container">正在加载数据...</div>
      ) : (
        <div className="member-detail-content">
          {renderMemberInfo()}
          
          <Tabs defaultActiveKey="orders" className="detail-tabs">
            <TabPane tab="订单记录" key="orders">
              <Card className="table-card">
                <Table
                  dataSource={orders}
                  columns={orderColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: '暂无订单记录' }}
                />
              </Card>
            </TabPane>
            
            <TabPane tab="积分记录" key="points">
              {renderPointsHistory()}
            </TabPane>
            
            <TabPane tab="预约记录" key="bookings">
              <Card className="table-card">
                <Table
                  dataSource={bookings}
                  columns={bookingColumns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  locale={{ emptyText: '暂无预约记录' }}
                />
              </Card>
            </TabPane>
          </Tabs>
        </div>
      )}
      
      {/* 积分调整弹窗 */}
      <Modal
        title="调整积分"
        visible={pointsModalVisible}
        onCancel={() => setPointsModalVisible(false)}
        onOk={() => {
          pointsForm.submit();
        }}
        okButtonProps={{ loading }}
      >
        <Form
          form={pointsForm}
          layout="vertical"
          onFinish={handleAdjustPoints}
        >
            <Form.Item
            name="points"
            label="积分变动"
            rules={[
              { required: true, message: '请输入积分变动值' },
              { type: 'number', message: '请输入有效的数字' }
            ]}
            >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="正数为增加，负数为减少"
              formatter={(value: string | number | undefined | null): string => {
              if (value === undefined || value === null) return '';
              const numValue = Number(value);
              return numValue >= 0 ? `+${value}` : `${value}`;
              }}
              onChange={(value: number | null): void => {
              // 这里是现有代码
              }}
            />
            </Form.Item>
          
          <Form.Item
            name="type"
            label="变动类型"
            rules={[{ required: true, message: '请选择变动类型' }]}
          >
            <Select placeholder="选择变动类型">
              <Select.Option value="admin_adjust">管理员调整</Select.Option>
              <Select.Option value="event">活动奖励</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="变动说明"
          >
            <Input.TextArea rows={3} placeholder="请输入积分变动的说明" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MemberDetail;
