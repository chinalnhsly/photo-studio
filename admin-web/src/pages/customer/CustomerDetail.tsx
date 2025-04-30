import React, { useState, useEffect } from 'react';
import {
  Card, Descriptions, Tabs, Table, Tag, Avatar, Button, Spin,
  Timeline, Empty, Statistic, Row, Col, message, Typography, Divider
} from 'antd';
import {
  UserOutlined, PhoneOutlined, MailOutlined, EditOutlined,
  TagOutlined, ShoppingOutlined, CameraOutlined, HistoryOutlined,
  HeartOutlined, DollarOutlined, CalendarOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
// 添加 Link 导入
import { useParams, Link } from 'umi';
import { history } from '../../utils/compatibility';
// import moment from 'moment';
// import api from '@/services/api';
import './CustomerDetail.less';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [customerData, setCustomerData] = useState<any>(null);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>({});
  const [interactions, setInteractions] = useState<any[]>([]);

  // 加载客户数据
  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  // 获取客户详情
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // 实际项目中这里应该调用API获取数据
      // const response = await api.customer.detail(id);
      // setCustomerData(response.data.customer);
      // setOrderHistory(response.data.orders);
      // setBookingHistory(response.data.bookings);
      // setPreferences(response.data.preferences);
      // setInteractions(response.data.interactions);
      
      // 模拟API请求延迟
      setTimeout(() => {
        // 使用模拟数据
        setCustomerData(mockCustomerData);
        setOrderHistory(mockOrderHistory);
        setBookingHistory(mockBookingHistory);
        setPreferences(mockPreferences);
        setInteractions(mockInteractions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('获取客户数据失败');
      setLoading(false);
    }
  };

  // 编辑客户信息
  const handleEditCustomer = () => {
    history.push(`/customer/edit/${id}`);
  };

  // 添加客户标签
  const handleManageTags = () => {
    // 实现标签管理逻辑
    message.info('标签管理功能将在后续版本中实现');
  };

  // 添加预约记录
  const handleAddBooking = () => {
    history.push(`/booking/create?customerId=${id}`);
  };

  // 返回客户列表
  const handleBack = () => {
    history.push('/customer/list');
  };

  // 消费历史表格列
  const orderColumns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string, record: any) => (
        <Link to={`/order/detail/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: '套餐名称',
      dataIndex: 'packageName',
      key: 'packageName',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `¥${text.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          'completed': { color: 'green', text: '已完成' },
          'processing': { color: 'blue', text: '处理中' },
          'cancelled': { color: 'red', text: '已取消' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  // 预约记录表格列
  const bookingColumns = [
    {
      title: '预约日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '摄影师',
      dataIndex: 'photographer',
      key: 'photographer',
    },
    {
      title: '项目',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: any = {
          'CONFIRMED': { color: 'green', text: '已确认' },
          'CANCELLED': { color: 'red', text: '已取消' },
          'COMPLETED': { color: 'blue', text: '已完成' },
          'PENDING': { color: 'orange', text: '待确认' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
  ];

  // 渲染互动历史记录
  const renderInteractionTimeline = () => {
    if (interactions.length === 0) {
      return <Empty description="暂无互动记录" />;
    }

    return (
      <Timeline>
        {interactions.map((item, index) => (
          <Timeline.Item 
            key={index}
            color={
              item.type === 'visit' ? 'blue' :
              item.type === 'call' ? 'green' :
              item.type === 'message' ? 'purple' : 'gray'
            }
          >
            <div className="interaction-item">
              <div className="interaction-title">
                <Text strong>{item.title}</Text>
                <Text type="secondary"> - {item.date}</Text>
              </div>
              <div className="interaction-content">
                <Paragraph>{item.content}</Paragraph>
                {item.notes && (
                  <div className="interaction-notes">
                    <Text type="secondary">备注: {item.notes}</Text>
                  </div>
                )}
                {item.staff && (
                  <div className="interaction-staff">
                    <Text type="secondary">处理人: {item.staff}</Text>
                  </div>
                )}
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    );
  };

  // 客户偏好标签渲染
  const renderPreferenceTags = (items: string[]) => {
    if (!items || items.length === 0) return <Text type="secondary">未设置</Text>;
    
    return (
      <div className="preference-tags">
        {items.map((item, index) => (
          <Tag key={index}>{item}</Tag>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载客户数据中..." />
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="customer-not-found">
        <Empty 
          description="客户不存在或已被删除" 
          image={(Empty as any).PRESENTED_IMAGE_SIMPLE}
        />
        <div className="back-button">
          <Button type="primary" onClick={handleBack}>返回客户列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-detail-page">
      {/* 操作栏 */}
      <Card className="action-card">
        <div className="action-buttons">
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            返回列表
          </Button>
          <div>
            <Button 
              icon={<TagOutlined />} 
              onClick={handleManageTags} 
              style={{ marginRight: 8 }}
            >
              管理标签
            </Button>
            <Button 
              icon={<CalendarOutlined />} 
              onClick={handleAddBooking} 
              style={{ marginRight: 8 }}
            >
              添加预约
            </Button>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEditCustomer}
            >
              编辑客户
            </Button>
          </div>
        </div>
      </Card>

      {/* 基本信息 */}
      <Card className="info-card">
        <div className="customer-header">
          <div className="customer-avatar-section">
            <Avatar 
              size={80} 
              src={customerData.avatar}
              icon={!customerData.avatar && <UserOutlined />}
            />
            {customerData.vip && (
              <div className="customer-vip-badge">
                <Tag color="gold">VIP</Tag>
              </div>
            )}
          </div>
          <div className="customer-basic-info">
            <Title level={4}>{customerData.name}</Title>
            <div className="customer-tags">
              {(customerData.tags || []).map((tag: string, index: number) => (
                <Tag key={index} color={getTagColor(tag)}>{tag}</Tag>
              ))}
            </div>
            <div className="customer-contacts">
              <div className="contact-item">
                <PhoneOutlined /> {customerData.phone}
              </div>
              <div className="contact-item">
                <MailOutlined /> {customerData.email || '暂无'}
              </div>
            </div>
          </div>
          <div className="customer-stats">
            <Statistic title="消费总额" value={customerData.totalSpent} prefix="¥" />
            <Statistic title="预约次数" value={customerData.bookingCount} />
          </div>
        </div>

        <Divider />

        <Descriptions title="客户信息" bordered>
          <Descriptions.Item label="注册日期">{customerData.registerDate}</Descriptions.Item>
          <Descriptions.Item label="上次到访">{customerData.lastVisit || '暂无记录'}</Descriptions.Item>
          <Descriptions.Item label="会员等级">
            <Tag color={getMemberLevelColor(customerData.memberLevel)}>
              {getMemberLevelText(customerData.memberLevel)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="生日">{customerData.birthday || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="性别">{getGenderText(customerData.gender)}</Descriptions.Item>
          <Descriptions.Item label="地址">{customerData.address || '未设置'}</Descriptions.Item>
          <Descriptions.Item label="备注" span={3}>
            {customerData.remarks || '无备注'}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 详细信息标签页 */}
      <Card className="tabs-card">
        <Tabs defaultActiveKey="orders">
          <TabPane 
            tab={<span><ShoppingOutlined />消费历史</span>} 
            key="orders"
          >
            <Table 
              columns={orderColumns} 
              dataSource={orderHistory}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane 
            tab={<span><CalendarOutlined />预约记录</span>} 
            key="bookings"
          >
            <Table 
              columns={bookingColumns} 
              dataSource={bookingHistory}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
          
          <TabPane 
            tab={<span><HeartOutlined />客户偏好</span>} 
            key="preferences"
          >
            <div className="preferences-section">
              <Row gutter={24}>
                <Col span={24} md={12}>
                  <Card title="摄影偏好" bordered={false}>
                    <div className="preference-item">
                      <div className="preference-label">喜好风格：</div>
                      <div className="preference-value">
                        {renderPreferenceTags(preferences.styles)}
                      </div>
                    </div>
                    <div className="preference-item">
                      <div className="preference-label">常用场景：</div>
                      <div className="preference-value">
                        {renderPreferenceTags(preferences.scenes)}
                      </div>
                    </div>
                    <div className="preference-item">
                      <div className="preference-label">偏好摄影师：</div>
                      <div className="preference-value">
                        {preferences.photographer || <Text type="secondary">未指定</Text>}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={24} md={12}>
                  <Card title="购买偏好" bordered={false}>
                    <div className="preference-item">
                      <div className="preference-label">感兴趣产品：</div>
                      <div className="preference-value">
                        {renderPreferenceTags(preferences.interestedProducts)}
                      </div>
                    </div>
                    <div className="preference-item">
                      <div className="preference-label">价格敏感度：</div>
                      <div className="preference-value">
                        {preferences.priceSensitivity || <Text type="secondary">未知</Text>}
                      </div>
                    </div>
                    <div className="preference-item">
                      <div className="preference-label">决策因素：</div>
                      <div className="preference-value">
                        {renderPreferenceTags(preferences.decisionFactors)}
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
              
              <Card title="附加信息" bordered={false} style={{ marginTop: 24 }}>
                <Paragraph>
                  {preferences.additionalNotes || '暂无附加信息'}
                </Paragraph>
              </Card>
            </div>
          </TabPane>
          
          <TabPane 
            tab={<span><HistoryOutlined />互动记录</span>} 
            key="interactions"
          >
            <div className="interactions-section">
              {renderInteractionTimeline()}
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

// 工具函数 - 获取会员等级文字
const getMemberLevelText = (level: string) => {
  const levelMap: any = {
    'bronze': '铜牌会员',
    'silver': '银牌会员',
    'gold': '金牌会员',
    'platinum': '白金会员',
  };
  return levelMap[level] || level;
};

// 工具函数 - 获取会员等级颜色
const getMemberLevelColor = (level: string) => {
  const colorMap: any = {
    'bronze': '#cd9966',
    'silver': '#bfbfbf',
    'gold': '#faad14',
    'platinum': '#722ed1',
  };
  return colorMap[level] || 'default';
};

// 工具函数 - 获取性别文字
const getGenderText = (gender: string) => {
  if (gender === 'male') return '男';
  if (gender === 'female') return '女';
  return '未知';
};

// 工具函数 - 获取标签颜色
const getTagColor = (tag: string) => {
  const tagColorMap: any = {
    '重要客户': '#f50',
    'VIP': '#87d068',
    '有投诉': '#ff4d4f',
    '老客户': '#2db7f5',
    '有订金': '#108ee9',
    '需要跟进': '#faad14',
  };
  return tagColorMap[tag];
};

// 模拟数据
const mockCustomerData = {
  id: 1,
  name: '张先生',
  phone: '13800138000',
  email: 'zhang@example.com',
  avatar: 'https://via.placeholder.com/150',
  gender: 'male',
  birthday: '1985-05-15',
  address: '北京市朝阳区某某路123号',
  registerDate: '2022-01-10',
  lastVisit: '2023-06-15',
  totalSpent: 15800,
  bookingCount: 5,
  memberLevel: 'gold',
  vip: true,
  tags: ['重要客户', 'VIP', '婚纱客户'],
  remarks: '这位客户很注重照片质量，喜欢自然风格的摄影。',
};

const mockOrderHistory = [
  {
    id: 1,
    orderNo: 'ORD20220315001',
    packageName: '婚纱摄影豪华套餐',
    amount: 9999,
    status: 'completed',
    date: '2022-03-15',
  },
  {
    id: 2,
    orderNo: 'ORD20220716002',
    packageName: '全家福套餐',
    amount: 2999,
    status: 'completed',
    date: '2022-07-16',
  },
  {
    id: 3,
    orderNo: 'ORD20230605003',
    packageName: '儿童写真套餐',
    amount: 1999,
    status: 'processing',
    date: '2023-06-05',
  },
];

const mockBookingHistory = [
  {
    id: 1,
    date: '2022-03-20',
    time: '09:30 - 12:30',
    photographer: '李摄影',
    service: '婚纱照拍摄',
    status: 'COMPLETED',
  },
  {
    id: 2,
    date: '2022-07-25',
    time: '14:00 - 16:00',
    photographer: '王摄影',
    service: '全家福拍摄',
    status: 'COMPLETED',
  },
  {
    id: 3,
    date: '2023-06-10',
    time: '10:00 - 11:30',
    photographer: '赵摄影',
    service: '儿童写真拍摄',
    status: 'CONFIRMED',
  },
  {
    id: 4,
    date: '2023-07-15',
    time: '15:00 - 17:00',
    photographer: '李摄影',
    service: '写真拍摄',
    status: 'PENDING',
  },
];

const mockPreferences = {
  styles: ['自然风格', '时尚风格', '复古风格'],
  scenes: ['室内', '公园', '海边'],
  photographer: '李摄影',
  interestedProducts: ['婚纱照', '儿童照', '全家福'],
  priceSensitivity: '中等',
  decisionFactors: ['质量', '风格', '服务'],
  additionalNotes: '客户喜欢在拍摄前充分沟通，希望拍摄当天能有充足的时间准备和调整。同时注重照片后期处理的细节和质量。',
};

const mockInteractions = [
  {
    type: 'call',
    title: '电话咨询',
    date: '2023-06-01',
    content: '客户来电咨询儿童摄影套餐详情及价格',
    staff: '王客服',
  },
  {
    type: 'visit',
    title: '到店咨询',
    date: '2023-06-03',
    content: '客户到店查看样片，对"糖果系列"儿童照表示满意',
    notes: '客户询问是否可以在6月10日预约拍摄',
    staff: '李前台',
  },
  {
    type: 'message',
    title: '短信回访',
    date: '2023-06-12',
    content: '拍摄后回访，了解客户对拍摄体验的满意度',
    notes: '客户表示非常满意，期待看到照片成品',
    staff: '张经理',
  },
];

export default CustomerDetail;