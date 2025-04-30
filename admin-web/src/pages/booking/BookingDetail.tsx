import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Steps,
  Descriptions,
  Tag,
  Divider,
  Spin,
  Space,
  Empty,
  Avatar,
  Modal,
  message,
  Input,
  Popconfirm,
  Timeline,
  Badge,
  Drawer,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Alert,
  Result
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ShopOutlined,
  HistoryOutlined,
  SendOutlined,
  PlusOutlined,
  PrinterOutlined,
  ScheduleOutlined,
  SwapOutlined,
  FileDoneOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useParams, Link } from 'umi';
import { history } from '../../utils/compatibility';
import moment from 'moment';
import './BookingDetail.scss';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;

// 模拟服务调用获取预约详情
const getBookingDetail = async (id: number) => {
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟数据
  return {
    data: {
      id,
      bookingNumber: `BK-${id.toString().padStart(6, '0')}`,
      customerId: 101,
      customerName: '张小明',
      customerPhone: '13800138000',
      customerEmail: 'zhangxm@example.com',
      customerAvatar: null,
      photographerId: 201,
      photographerName: '李摄影',
      studioId: 301,
      studioName: '阳光摄影工作室',
      studioAddress: '北京市海淀区中关村大街1号',
      date: '2023-05-15',
      startTime: '10:00',
      endTime: '12:00',
      shootingType: '个人写真',
      status: 'CONFIRMED', // PENDING, CONFIRMED, COMPLETED, CANCELLED, IN_PROGRESS, NO_SHOW, RESCHEDULED
      createdAt: '2023-05-01 14:30:45',
      totalPrice: 1200,
      deposit: 300,
      balance: 900,
      paid: true,
      paymentMethod: '微信支付',
      paymentTime: '2023-05-01 15:00:22',
      notes: '客户需要准备3套服装，偏好自然风格',
      staffNotes: '客户之前来过，拍摄过婚纱照，对光线要求较高',
      cancelReason: null,
      cancelTime: null,
      cancelledBy: null,
      rescheduledFrom: null,
      products: [
        {
          id: 1,
          name: '标准个人写真套餐',
          description: '2小时拍摄，20张精修照片',
          price: 1200,
          quantity: 1,
          totalPrice: 1200
        }
      ],
      timeline: [
        {
          time: '2023-05-01 14:30:45',
          status: 'CREATED',
          description: '预约已创建',
          operator: '系统'
        },
        {
          time: '2023-05-01 15:00:22',
          status: 'PAID',
          description: '客户已支付定金300元',
          operator: '张小明'
        },
        {
          time: '2023-05-02 09:23:15',
          status: 'CONFIRMED',
          description: '预约已确认',
          operator: '王店长'
        },
      ]
    }
  };
};

// 模拟服务调用获取客户其他预约
const getCustomerOtherBookings = async (customerId: number) => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟数据
  return {
    data: [
      {
        id: 102,
        bookingNumber: 'BK-000102',
        date: '2023-03-10',
        shootingType: '婚纱照',
        status: 'COMPLETED'
      },
      {
        id: 103,
        bookingNumber: 'BK-000103',
        date: '2023-06-20',
        shootingType: '全家福',
        status: 'PENDING'
      }
    ]
  };
};

// 更新预约状态
const updateBookingStatus = async (id: number, status: string, note?: string) => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功响应
  return { success: true };
};

// 取消预约
const cancelBooking = async (id: number, reason: string) => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功响应
  return { success: true };
};

// 添加预约备注
const addBookingNote = async (id: number, note: string) => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功响应
  return { success: true };
};

// 重新安排预约
const rescheduleBooking = async (id: number, date: string, startTime: string, endTime: string, reason: string) => {
  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功响应
  return { success: true };
};

// 获取步骤状态
const getStepStatus = (currentStatus: string, stepStatus: string) => {
  const statusOrder: { [key: string]: number } = {
    'PENDING': 0,
    'CONFIRMED': 1,
    'IN_PROGRESS': 2,
    'COMPLETED': 3,
    'CANCELLED': -1,
    'NO_SHOW': -1,
    'RESCHEDULED': 0, // 重新安排后回到待确认状态
  };
  
  const currentIndex = statusOrder[currentStatus];
  const stepIndex = statusOrder[stepStatus];
  
  if (currentIndex === -1) return 'error'; // 取消或未到店
  if (stepIndex < currentIndex) return 'finish'; // 已完成的步骤
  if (stepIndex === currentIndex) return 'process'; // 当前步骤
  return 'wait'; // 未到达的步骤
};

// 获取状态颜色
const getStatusColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    'PENDING': 'orange',
    'CONFIRMED': 'green',
    'COMPLETED': 'blue',
    'CANCELLED': 'red',
    'IN_PROGRESS': 'purple',
    'NO_SHOW': 'black',
    'RESCHEDULED': 'geekblue',
  };
  return colorMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'IN_PROGRESS': '进行中',
    'NO_SHOW': '未到店',
    'RESCHEDULED': '已改期',
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

// 获取时间线图标
const getTimelineIcon = (status: string) => {
  switch (status) {
    case 'CREATED':
      return <CalendarOutlined />;
    case 'CONFIRMED':
      return <CheckCircleOutlined />;
    case 'PAID':
      return <FileDoneOutlined />;
    case 'CANCELLED':
      return <CloseCircleOutlined />;
    case 'COMPLETED':
      return <FileDoneOutlined />;
    case 'RESCHEDULED':
      return <SwapOutlined />;
    case 'IN_PROGRESS':
      return <ScheduleOutlined />;
    case 'NO_SHOW':
      return <ExclamationCircleOutlined />;
    default:
      return <CalendarOutlined />;
  }
};

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<any>(null);
  const [otherBookings, setOtherBookings] = useState<any[]>([]);
  const [cancelModalVisible, setCancelModalVisible] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('');
  const [noteModalVisible, setNoteModalVisible] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>('');
  const [rescheduleDrawerVisible, setRescheduleDrawerVisible] = useState<boolean>(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [completeModalVisible, setCompleteModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 获取预约详情
  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  // 获取预约详情
  const fetchBookingDetail = async () => {
    setLoading(true);
    try {
      const response = await getBookingDetail(Number(id));
      setBooking(response.data);
      
      // 获取客户的其他预约
      fetchOtherBookings(response.data.customerId);
    } catch (error) {
      message.error('获取预约详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取客户其他预约
  const fetchOtherBookings = async (customerId: number) => {
    try {
      const response = await getCustomerOtherBookings(customerId);
      setOtherBookings(response.data || []);
    } catch (error) {
      console.error('获取客户其他预约失败', error);
    }
  };

  // 确认预约
  const handleConfirmBooking = async () => {
    try {
      await updateBookingStatus(Number(id), 'CONFIRMED');
      message.success('预约已确认');
      setConfirmModalVisible(false);
      fetchBookingDetail();
    } catch (error) {
      message.error('确认预约失败');
    }
  };

  // 开始拍摄
  const handleStartBooking = async () => {
    try {
      await updateBookingStatus(Number(id), 'IN_PROGRESS');
      message.success('预约已标记为进行中');
      fetchBookingDetail();
    } catch (error) {
      message.error('更新预约状态失败');
    }
  };

  // 完成预约
  const handleCompleteBooking = async () => {
    try {
      await updateBookingStatus(Number(id), 'COMPLETED');
      message.success('预约已标记为已完成');
      setCompleteModalVisible(false);
      fetchBookingDetail();
    } catch (error) {
      message.error('完成预约失败');
    }
  };

  // 取消预约
  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      message.error('请填写取消原因');
      return;
    }

    try {
      await cancelBooking(Number(id), cancelReason);
      message.success('预约已取消');
      setCancelModalVisible(false);
      fetchBookingDetail();
    } catch (error) {
      message.error('取消预约失败');
    }
  };

  // 添加备注
  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      message.error('请填写备注内容');
      return;
    }

    try {
      await addBookingNote(Number(id), noteContent);
      message.success('备注已添加');
      setNoteModalVisible(false);
      setNoteContent('');
      fetchBookingDetail();
    } catch (error) {
      message.error('添加备注失败');
    }
  };

  // 重新安排预约
  const handleRescheduleBooking = async () => {
    try {
      const values = await form.validateFields();
      
      const formattedDate = values.date.format('YYYY-MM-DD');
      const formattedStartTime = values.timeRange[0].format('HH:mm');
      const formattedEndTime = values.timeRange[1].format('HH:mm');
      
      await rescheduleBooking(
        Number(id),
        formattedDate,
        formattedStartTime,
        formattedEndTime,
        values.reason
      );
      
      message.success('预约已重新安排');
      setRescheduleDrawerVisible(false);
      fetchBookingDetail();
    } catch (error) {
      message.error('重新安排预约失败');
    }
  };

  // 打印预约单
  const handlePrintBooking = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <Card>
        <Empty description="未找到预约信息" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button type="primary" onClick={() => history.push('/booking/list')}>
            返回预约列表
          </Button>
        </div>
      </Card>
    );
  }

  // 预约已取消
  const isCancelled = booking.status === 'CANCELLED';
  
  // 预约已改期
  const isRescheduled = booking.status === 'RESCHEDULED';
  
  // 预约未到店
  const isNoShow = booking.status === 'NO_SHOW';

  // 渲染预约状态提醒
  const renderStatusAlert = () => {
    if (isCancelled) {
      return (
        <div className="booking-cancelled">
          <CloseCircleOutlined className="cancel-icon" />
          <div className="cancel-info">
            <div className="cancel-title">此预约已取消</div>
            <div className="cancel-reason">取消原因: {booking.cancelReason}</div>
            <div className="cancel-time">取消时间: {booking.cancelTime} 由 {booking.cancelledBy} 取消</div>
          </div>
        </div>
      );
    }
    
    if (isRescheduled) {
      return (
        <div className="booking-rescheduled">
          <div className="reschedule-message">
            <SwapOutlined /> 此预约已改期
          </div>
          <div className="reschedule-info">
            <div>原预约日期: {booking.rescheduledFrom?.date} {booking.rescheduledFrom?.startTime} - {booking.rescheduledFrom?.endTime}</div>
            <div>新预约日期: {booking.date} {booking.startTime} - {booking.endTime}</div>
          </div>
        </div>
      );
    }
    
    if (isNoShow) {
      return (
        <Alert
          message="客户未到店"
          description="此预约已标记为客户未到店。"
          type="error"
          showIcon
        />
      );
    }
    
    return null;
  };

  // 渲染操作按钮
  const renderActionButtons = () => {
    // 已取消或未到店的预约不显示操作按钮
    if (isCancelled || isNoShow) return null;
    
    const actions = [];
    
    // 根据不同状态显示不同按钮
    switch (booking.status) {
      case 'PENDING':
        actions.push(
          <Button 
            key="confirm" 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={() => setConfirmModalVisible(true)}
          >
            确认预约
          </Button>
        );
        break;
      case 'CONFIRMED':
        actions.push(
          <Button 
            key="start" 
            type="primary" 
            icon={<CameraOutlined />} 
            onClick={handleStartBooking}
          >
            开始拍摄
          </Button>
        );
        break;
      case 'IN_PROGRESS':
        actions.push(
          <Button 
            key="complete" 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            onClick={() => setCompleteModalVisible(true)}
          >
            完成拍摄
          </Button>
        );
        break;
    }
    
    // 只有未完成的预约可以取消
    if (!['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(booking.status)) {
      actions.push(
        <Button 
          key="cancel" 
          danger 
          icon={<CloseCircleOutlined />} 
          onClick={() => setCancelModalVisible(true)}
        >
          取消预约
        </Button>
      );
    }
    
    // 只有未完成的预约可以重新安排
    if (!['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(booking.status)) {
      actions.push(
        <Button 
          key="reschedule" 
          icon={<SwapOutlined />} 
          onClick={() => {
            form.setFieldsValue({
              date: moment(booking.date),
              timeRange: [moment(booking.startTime, 'HH:mm'), moment(booking.endTime, 'HH:mm')],
              reason: ''
            });
            setRescheduleDrawerVisible(true);
          }}
        >
          重新安排
        </Button>
      );
    }
    
    return (
      <div className="action-buttons">
        <Space>{actions}</Space>
      </div>
    );
  };
  const { RangePicker } = TimePicker as any;
  return (
    <div className="booking-detail-page">
      <div className="page-header">
        <div className="page-title">
          <Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()}>
            返回
          </Button>
          <span className="booking-number">预约号: {booking.bookingNumber}</span>
        </div>
        <div className="page-actions">
          <Space>
            <Button 
              icon={<EditOutlined />} 
              onClick={() => history.push(`/booking/edit/${id}`)}
            >
              编辑预约
            </Button>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={handlePrintBooking}
            >
              打印预约单
            </Button>
          </Space>
        </div>
      </div>
      
      <div className="booking-content">
        {/* 预约状态和操作卡片 */}
        <Card className="booking-main-card">
          {/* 取消/改期提示 */}
          {renderStatusAlert()}
          
          {/* 预约步骤 */}
          <div className="booking-status">
            <Steps current={
              booking.status === 'PENDING' ? 0 :
              booking.status === 'CONFIRMED' ? 1 :
              booking.status === 'IN_PROGRESS' ? 2 :
              booking.status === 'COMPLETED' ? 3 : 0
            }>
              <Step 
                title="待确认" 
                status={getStepStatus(booking.status, 'PENDING')} 
              />
              <Step 
                title="已确认" 
                status={getStepStatus(booking.status, 'CONFIRMED')} 
              />
              <Step 
                title="进行中" 
                status={getStepStatus(booking.status, 'IN_PROGRESS')} 
              />
              <Step 
                title="已完成" 
                status={getStepStatus(booking.status, 'COMPLETED')} 
              />
            </Steps>
          </div>
          
          {/* 操作按钮 */}
          <div className="status-actions">
            <div className="current-status">
              <Tag color={getStatusColor(booking.status)} style={{ padding: '4px 8px', fontSize: '14px' }}>
                {getStatusText(booking.status)}
              </Tag>
            </div>
            {renderActionButtons()}
          </div>
          
          <Divider />
          
          {/* 预约详情 */}
          <div className="section">
            <div className="section-title">
              <CalendarOutlined /> 预约详情
            </div>
            <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }} className="description-content">
              <Descriptions.Item label="预约日期">{booking.date}</Descriptions.Item>
              <Descriptions.Item label="预约时间">{booking.startTime} - {booking.endTime}</Descriptions.Item>
              <Descriptions.Item label="拍摄类型">{booking.shootingType}</Descriptions.Item>
              
              <Descriptions.Item label="预约客户">
                <Link to={`/customer/detail/${booking.customerId}`}>
                  <Space>
                    <Avatar icon={<UserOutlined />} src={booking.customerAvatar} size="small" />
                    {booking.customerName}
                  </Space>
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label="联系电话">{booking.customerPhone}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱">{booking.customerEmail || '-'}</Descriptions.Item>
              
              <Descriptions.Item label="摄影师">
                <Link to={`/photographer/detail/${booking.photographerId}`}>
                  <Space>
                    <Avatar icon={<CameraOutlined />} size="small" />
                    {booking.photographerName}
                  </Space>
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label="拍摄工作室">
                <Link to={`/studio/detail/${booking.studioId}`}>
                  <Space>
                    <ShopOutlined />
                    {booking.studioName}
                  </Space>
                </Link>
              </Descriptions.Item>
              <Descriptions.Item label="工作室地址">
                {booking.studioAddress}
              </Descriptions.Item>
            </Descriptions>
          </div>
          
          {/* 费用信息 */}
          <div className="section">
            <div className="section-title">
              <FileDoneOutlined /> 费用信息
            </div>
            <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 1, sm: 1, xs: 1 }} className="description-content">
              <Descriptions.Item label="套餐价格">¥{booking.totalPrice.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="已付定金">¥{booking.deposit.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="待付余额">¥{booking.balance.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="支付状态">{booking.paid ? <Tag color="green">已支付</Tag> : <Tag color="orange">待支付</Tag>}</Descriptions.Item>
              <Descriptions.Item label="支付方式">{booking.paymentMethod || '-'}</Descriptions.Item>
              <Descriptions.Item label="支付时间">{booking.paymentTime || '-'}</Descriptions.Item>
            </Descriptions>
            
            {/* 预约包含的产品 */}
            <div style={{ marginTop: 16 }}>
              <Title level={5}>预约包含的产品</Title>
              {booking.products && booking.products.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>产品名称</th>
                      <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>单价</th>
                      <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>数量</th>
                      <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>总价</th>
                    </tr>
                  </thead>
                  <tbody>
                    {booking.products.map((product: {
                      id: number;
                      name: string;
                      description: string;
                      price: number;
                      quantity: number;
                      totalPrice: number;
                    }) => (
                      <tr key={product.id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                        <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-desc" style={{ fontSize: '12px', color: '#999' }}>{product.description}</div>
                        </div>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>¥{product.price.toFixed(2)}</td>
                      <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>{product.quantity}</td>
                      <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>¥{product.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={3} style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>总计:</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#f5222d' }}>¥{booking.totalPrice.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <Empty description="没有产品信息" image="simple" />
              )}
            </div>
          </div>
          
          {/* 备注信息 */}
          <div className="section">
            <div className="section-title">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><FileTextOutlined /> 备注信息</span>
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<PlusOutlined />}
                  onClick={() => setNoteModalVisible(true)}
                >
                  添加备注
                </Button>
              </div>
            </div>
            
            <div className="notes-section">
              <div className="note-item">
                <div className="note-label">客户备注</div>
                <div className="note-content">
                  {booking.notes || '无客户备注'}
                </div>
              </div>
              
              <div className="note-item">
                <div className="note-label">内部备注</div>
                <div className="note-content">
                  {booking.staffNotes || '无内部备注'}
                </div>
              </div>
            </div>
          </div>
          
          {/* 预约状态历史 */}
          <div className="section">
            <div className="section-title">
              <HistoryOutlined /> 状态历史
            </div>
            
            <Timeline>
                {/* Define the interface for timeline items */}
                {booking.timeline.map((item: {
                time: string;
                status: string;
                description: string;
                operator: string;
                }, index: number) => (
                <Timeline.Item 
                  key={index} 
                  dot={getTimelineIcon(item.status)}
                >
                  <div style={{ marginBottom: 0 }}>{item.description}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                  {item.time} · {item.operator}
                  </div>
                </Timeline.Item>
                ))}
            </Timeline>
          </div>
          
          {/* 客户其他预约 */}
          {otherBookings.length > 0 && (
            <div className="section">
              <div className="section-title">
                <TeamOutlined /> 客户其他预约
              </div>
              
              <Row gutter={[16, 16]}>
                {otherBookings.map(item => (
                  <Col key={item.id} xs={24} sm={12} md={8}>
                    <Card size="small" hoverable onClick={() => history.push(`/booking/detail/${item.id}`)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div><strong>{item.bookingNumber}</strong></div>
                          <div style={{ fontSize: '12px', color: '#999' }}>{item.date} · {item.shootingType}</div>
                        </div>
                        <Tag color={getStatusColor(item.status)}>{getStatusText(item.status)}</Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card>
      </div>
      
      {/* 确认预约弹窗 */}
      <Modal
        title="确认预约"
        visible={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        onOk={handleConfirmBooking}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <p>您确定要确认此预约吗？</p>
        <p>确认后，系统将通知客户及摄影师。</p>
      </Modal>
      
      {/* 完成预约弹窗 */}
      <Modal
        title="完成预约"
        visible={completeModalVisible}
        onCancel={() => setCompleteModalVisible(false)}
        onOk={handleCompleteBooking}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <p>您确定要将此预约标记为已完成吗？</p>
        <p>完成后，系统将生成相关服务记录。</p>
      </Modal>
      
      {/* 取消预约弹窗 */}
      <Modal
        title="取消预约"
        visible={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        onOk={handleCancelBooking}
        okText="确认取消"
        cancelText="返回"
        okType="danger"
        destroyOnClose
      >
        <p>您确定要取消此预约吗？</p>
        <p>取消后，相关时段将重新开放预约。</p>
        <div style={{ margin: '16px 0' }}>
          <div style={{ marginBottom: '8px' }}>请输入取消原因:</div>
          <TextArea
            rows={4}
            value={cancelReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCancelReason(e.target.value)}
            placeholder="请输入取消原因（必填）"
          />
        </div>
      </Modal>
      
      {/* 添加备注弹窗 */}
      <Modal
        title="添加备注"
        visible={noteModalVisible}
        onCancel={() => setNoteModalVisible(false)}
        onOk={handleAddNote}
        okText="添加"
        cancelText="取消"
        destroyOnClose
      >
        <div style={{ marginBottom: '8px' }}>请输入备注内容:</div>
        <TextArea
          rows={6}
          value={noteContent}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)  => setNoteContent(e.target.value)}
          placeholder="请输入备注内容"
        />
      </Modal>
      
      {/* 重新安排预约抽屉 */}
      <Drawer
        title="重新安排预约"
        width={500}
        visible={rescheduleDrawerVisible}
        onClose={() => setRescheduleDrawerVisible(false)}
        footer={
          <div className="drawer-footer">
            <Space>
              <Button onClick={() => setRescheduleDrawerVisible(false)}>取消</Button>
              <Button type="primary" onClick={handleRescheduleBooking}>确认修改</Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical" initialValues={{
          date: moment(booking.date),
          timeRange: [moment(booking.startTime, 'HH:mm'), moment(booking.endTime, 'HH:mm')],
          reason: ''
        }}>
          <Form.Item
            name="date"
            label="选择新日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="timeRange"
            label="选择新时间段"
            rules={[{ required: true, message: '请选择时间段' }]}
          >
           < RangePicker style={{ width: '100%' }} format="HH:mm" />
           
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="改期原因"
            rules={[{ required: true, message: '请输入改期原因' }]}
          >
            <TextArea rows={4} placeholder="请输入改期原因" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default BookingDetail;
