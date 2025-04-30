import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Card,
  Select,
  DatePicker,
  Modal,
  Form,
  TimePicker,
  Input,
  message,
  Tag,
  Tooltip,
  Popconfirm,
  Spin,
  Button,
  Row,
  Col,
  Badge,
  Space,
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  CameraOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import moment from 'moment';
type Moment = moment.Moment;
import { getBookingList } from '@/services/booking';
import { getPhotographerList } from '@/services/photographer';
import './BookingCalendar.less';

interface BookingEvent {
  id: number;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  customerId: number;
  customerName: string;
  photographerId: number;
  photographerName: string;
  studioId: number;
  studioName: string;
  status: string;
  color?: string;
}

// 定义表单数据类型
interface BookingFormValues {
  date: Moment;
  timeRange: [Moment, Moment];
  customerId: number;
  photographerId: number;
  studioId: number;
  notes?: string;
}

// 定义API响应类型
interface ApiResponse {
  data: {
    list?: any[];
    [key: string]: any;
  } | any[];
  success?: boolean;
  total?: number;
}

interface BookingFilter {
  photographerId?: number;
  studioId?: number;
  startDate?: string;
  endDate?: string;
  status?: string[];
}

const BookingCalendar: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [photographers, setPhotographers] = useState<any[]>([]);
  const [filter, setFilter] = useState<BookingFilter>({});
  const [form] = Form.useForm();

  // 加载预约数据
  useEffect(() => {
    fetchEvents();
  }, [currentDate, filter]);

  // 加载摄影师数据
  useEffect(() => {
    fetchPhotographers();
  }, []);

  // 获取预约数据
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // 计算月份的开始和结束日期
      const startDate = moment(currentDate).startOf('month').format('YYYY-MM-DD');
      const endDate = moment(currentDate).endOf('month').format('YYYY-MM-DD');
      
      const params = {
        startDate,
        endDate,
        ...filter,
      };
      
      const response: ApiResponse = await getBookingList(params);
      
      // 转换为日历事件格式
      // API 返回格式适配处理
      let bookingList: any[] = [];
      if (Array.isArray(response.data)) {
        bookingList = response.data;
      } else if (response.data && response.data.list) {
        bookingList = response.data.list;
      }
      
      const bookingEvents = bookingList.map((booking: any) => ({
        id: booking.id,
        title: `${booking.customerName} - ${booking.shootingType || '预约'}`,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        customerId: booking.customerId,
        customerName: booking.customerName,
        photographerId: booking.photographerId,
        photographerName: booking.photographerName,
        studioId: booking.studioId,
        studioName: booking.studioName,
        status: booking.status,
        color: getStatusColor(booking.status),
      }));
      
      setEvents(bookingEvents);
    } catch (error) {
      console.error('获取预约数据失败:', error);
      message.error('获取预约数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取摄影师列表
  const fetchPhotographers = async () => {
    try {
      const response: ApiResponse = await getPhotographerList({ isActive: true });
      if (Array.isArray(response.data)) {
        setPhotographers(response.data);
      } else if (response.data && typeof response.data === 'object') {
        // 确保response.data是对象且有list属性
        const dataObj = response.data as { list?: any[] };
        setPhotographers(dataObj.list || []);
      } else {
        setPhotographers([]);
      }
    } catch (error) {
      console.error('获取摄影师列表失败:', error);
    }
  };

  // 根据状态获取颜色
  const getStatusColor = (status: string) => {
    const statusColorMap: {[key: string]: string} = {
      'PENDING': '#faad14', // 待确认 - 黄色
      'CONFIRMED': '#52c41a', // 已确认 - 绿色
      'COMPLETED': '#1890ff', // 已完成 - 蓝色
      'IN_PROGRESS': '#722ed1', // 进行中 - 紫色
      'CANCELLED': '#f5222d', // 已取消 - 红色
      'NO_SHOW': '#bfbfbf', // 未到店 - 灰色
      'RESCHEDULED': '#13c2c2', // 已改期 - 青色
    };
    return statusColorMap[status] || '#d9d9d9';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusTextMap: {[key: string]: string} = {
      'PENDING': '待确认',
      'CONFIRMED': '已确认',
      'COMPLETED': '已完成',
      'IN_PROGRESS': '进行中',
      'CANCELLED': '已取消',
      'NO_SHOW': '未到店',
      'RESCHEDULED': '已改期',
    };
    return statusTextMap[status] || status;
  };

  // 处理日期单元格渲染
  const dateCellRender = (date: Moment) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dailyEvents = events.filter(event => event.date === dateStr);
    
    return (
      <ul className="booking-events">
        {dailyEvents.map(event => (
          <li key={event.id}>
            <Badge
              color={event.color}
              text={
                <Tooltip title={`${event.customerName} - ${event.photographerName}`}>
                  <span className="event-text" onClick={() => showEventDetails(event)}>
                    {event.startTime.substring(0, 5)}-{event.endTime.substring(0, 5)} {event.title}
                  </span>
                </Tooltip>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  // 显示预约详情
  const showEventDetails = (event: BookingEvent) => {
    setSelectedEvent(event);
    setDetailModalVisible(true);
  };

  // 选择日期处理
  const handleDateSelect = (date: Moment) => {
    setSelectedDate(date);
    setCreateModalVisible(true);
    form.setFieldsValue({
      date: date,
    });
  };

  // 切换月份
  const handlePanelChange = (date: Moment) => {
    setCurrentDate(date);
  };

  // 创建新预约
  const handleCreateBooking = () => {
    form.validateFields().then((values: BookingFormValues) => {
      // 通常这里会调用API保存预约
      message.success('创建预约功能正在开发中');
      setCreateModalVisible(false);
      form.resetFields();
    });
  };

  // 筛选处理
  const handleFilterChange = (key: string, value: number | string | null) => {
    setFilter({
      ...filter,
      [key]: value,
    });
  };

  // 渲染日历头部
  const calendarHeader = ({ value, onChange }: any) => {
    return (
      <div className="calendar-header">
        <div className="month-selector">
          <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>
            上个月
          </Button>
          <span className="current-month">{value.format('YYYY年MM月')}</span>
          <Button onClick={() => onChange(value.clone().add(1, 'month'))}>
            下个月
          </Button>
        </div>
        <Button onClick={() => onChange(moment())}>
          今天
        </Button>
      </div>
    );
  };

  // 渲染预约详情
  const renderEventDetails = () => {
    if (!selectedEvent) return null;
    
    return (
      <div className="event-details">
        <p>
          <strong>客户:</strong> {selectedEvent.customerName}
        </p>
        <p>
          <strong>时间:</strong> {selectedEvent.date} {selectedEvent.startTime} - {selectedEvent.endTime}
        </p>
        <p>
          <strong>摄影师:</strong> {selectedEvent.photographerName}
        </p>
        <p>
          <strong>工作室:</strong> {selectedEvent.studioName}
        </p>
        <p>
          <strong>状态:</strong> <Tag color={selectedEvent.color}>{getStatusText(selectedEvent.status)}</Tag>
        </p>
      </div>
    );
  };

  return (
    <div className="booking-calendar-page">
      <Card
        title="预约日历"
        extra={
          <div className="calendar-filters">
            <Select
              placeholder="选择摄影师"
              allowClear
              style={{ width: 150, marginRight: 16 }}
              onChange={(value: number | null) => handleFilterChange('photographerId', value)}
            >
              {photographers.map(photographer => (
                <Select.Option key={photographer.id} value={photographer.id}>
                  {photographer.name}
                </Select.Option>
              ))}
            </Select>
            
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedDate(moment());
                setCreateModalVisible(true);
                form.setFieldsValue({
                  date: moment(),
                });
              }}
            >
              新增预约
            </Button>
          </div>
        }
      >
        <Spin spinning={loading}>
          <div className="status-legend">
            <div className="legend-title">状态图例:</div>
            {Object.entries(getStatusText('')).map(([key]) => (
              key && (
                <Tag key={key} color={getStatusColor(key)}>
                  {getStatusText(key)}
                </Tag>
              )
            ))}
          </div>
          
          <Calendar
            value={currentDate}
            onSelect={handleDateSelect}
            onPanelChange={handlePanelChange}
            dateCellRender={dateCellRender}
            headerRender={calendarHeader}
          />
        </Spin>
      </Card>
      
      {/* 预约详情模态框 */}
      <Modal
        title="预约详情"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Space key="actions">
            <Button
              onClick={() => {
                setDetailModalVisible(false);
                window.open(`/booking/edit/${selectedEvent?.id}`, '_blank');
              }}
              icon={<EditOutlined />}
              type="primary"
            >
              编辑预约
            </Button>
            <Button
              onClick={() => setDetailModalVisible(false)}
            >
              关闭
            </Button>
          </Space>
        ]}
      >
        {renderEventDetails()}
      </Modal>
      
      {/* 创建预约模态框 */}
      <Modal
        title="创建预约"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onOk={handleCreateBooking}
        okText="创建"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="date"
            label="预约日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>
          
          <Form.Item
            name="timeRange"
            label="时间段"
            rules={[{ required: true, message: '请选择时间段' }]}
          >
            {/* 直接使用RangePicker组件处理时间范围 */}
            <DatePicker.RangePicker
              picker="time"
              format="HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="customerId"
            label="客户"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select
              placeholder="选择客户"
              showSearch
              optionFilterProp="children"
            >
              {/* 这里应该动态加载客户列表 */}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="photographerId"
            label="摄影师"
            rules={[{ required: true, message: '请选择摄影师' }]}
          >
            <Select
              placeholder="选择摄影师"
              optionFilterProp="children"
            >
              {photographers.map(photographer => (
                <Select.Option key={photographer.id} value={photographer.id}>
                  {photographer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="studioId"
            label="工作室"
            rules={[{ required: true, message: '请选择工作室' }]}
          >
            <Select
              placeholder="选择工作室"
            >
              {/* 这里应该动态加载工作室列表 */}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入预约备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookingCalendar;
