import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Calendar, 
  Badge, 
  Modal, 
  Form, 
  Input, 
  Select, 
  TimePicker, // Keep TimePicker if needed elsewhere, otherwise remove
  DatePicker, // Import DatePicker
  Button, 
  message, 
  Tooltip, 
  Popconfirm, 
  Row, 
  Col,
  Typography
} from 'antd';
import moment from 'moment';
// 使用 moment 的类型定义
type Moment = moment.Moment;
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
// Import Booking type along with API functions
import { getBookingCalendar, createBooking, updateBooking, deleteBooking, Booking } from '@/services/booking';
import { getPhotographerOptions, getStudioOptions, getCustomerOptions } from '@/services/common';
import styles from './BookingCalendar.less';

const { Option } = Select;
// Directly use DatePicker.RangePicker
const { RangePicker } = DatePicker;
const { Title } = Typography;

// Use the Booking type directly or create a compatible interface
// Let's use Booking and add any specific UI state if needed later
type BookingEvent = Booking; // Use the imported Booking type

// 状态颜色映射
const statusColorMap: Record<string, string> = {
  pending: 'warning',
  confirmed: 'processing',
  cancelled: 'error',
  completed: 'success',
  in_progress: 'processing',
  no_show: 'default',
  rescheduled: 'warning',
};

// 拍摄类型
const shootingTypes = [
  { value: 'standard', label: '标准写真' },
  { value: 'wedding', label: '婚纱摄影' },
  { value: 'portrait', label: '人像摄影' },
  { value: 'family', label: '家庭照' },
  { value: 'children', label: '儿童摄影' },
  { value: 'maternity', label: '孕妇照' },
  { value: 'newborn', label: '新生儿' },
  { value: 'event', label: '活动跟拍' },
  { value: 'product', label: '商品摄影' },
  { value: 'commercial', label: '商业摄影' },
];

const BookingCalendar: React.FC = () => {
  const [form] = Form.useForm();
  const [events, setEvents] = useState<Booking[]>([]); // State now holds Booking[]
  const [visible, setVisible] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [currentEvent, setCurrentEvent] = useState<Booking | null>(null); // State holds Booking | null
  const [loading, setLoading] = useState<boolean>(false);
  const [photographers, setPhotographers] = useState<{ value: number; label: string }[]>([]);
  const [studios, setStudios] = useState<{ value: number; label: string }[]>([]);
  const [customers, setCustomers] = useState<{ value: number; label: string }[]>([]);
  
  // 初始化数据
  useEffect(() => {
    fetchCalendarData(moment());
    fetchOptions();
  }, []);

  // 获取预约日历数据
  const fetchCalendarData = async (date: Moment) => {
    setLoading(true);
    try {
      const startDate = date.clone().startOf('month').format('YYYY-MM-DD');
      const endDate = date.clone().endOf('month').format('YYYY-MM-DD');
      
      const response = await getBookingCalendar({ startDate, endDate });
      // Ensure response.data is Booking[] before setting state
      const bookings: Booking[] = response.data || [];
      setEvents(bookings);
    } catch (error) {
      console.error('获取预约日历数据失败:', error);
      message.error('获取预约日历数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取下拉选项数据
  const fetchOptions = async () => {
    try {
      const [photographerRes, studioRes, customerRes] = await Promise.all([
        getPhotographerOptions(),
        getStudioOptions(),
        getCustomerOptions(),
      ]);
      
      setPhotographers(photographerRes.data || []);
      setStudios(studioRes.data || []);
      setCustomers(customerRes.data || []);
    } catch (error) {
      console.error('获取选项数据失败:', error);
    }
  };

  // 日期单元格渲染
  const dateCellRender = (date: Moment) => {
    const dateStr = date.format('YYYY-MM-DD');
    const dateEvents = events.filter(event => event.date === dateStr);
    
    return (
      <ul className={styles.events}>
        {dateEvents.map(event => (
          <li key={event.id}>
            <Badge 
              status={statusColorMap[event.status] as any || 'default'} 
              text={
                <Tooltip title={`${event.customerName} - ${event.startTime}-${event.endTime}`}>
                  <span className={styles.eventText} onClick={() => handleEventClick(event)}>
                    {/* Use notes or construct a title */}
                    {event.notes || `${event.customerName} (${event.startTime})`}
                  </span>
                </Tooltip>
              } 
            />
          </li>
        ))}
      </ul>
    );
  };

  // 处理日期选择
  const handleSelect = (date: Moment) => {
    setSelectedDate(date);
    setMode('create');
    setCurrentEvent(null);
    form.resetFields();
    
    // 设置默认日期和时间
    form.setFieldsValue({
      date: date.format('YYYY-MM-DD'),
      timeRange: [moment('09:00', 'HH:mm'), moment('10:00', 'HH:mm')],
    });
    
    setVisible(true);
  };

  // 处理月份变化
  const handlePanelChange = (date: Moment) => {
    setCurrentDate(date);
    fetchCalendarData(date);
  };

  // 处理事件点击
  const handleEventClick = (event: Booking) => { // Parameter is now Booking
    setMode('edit');
    setCurrentEvent(event);
    form.setFieldsValue({
      customerName: event.customerName,
      customerPhone: event.customerPhone,
      date: moment(event.date),
      timeRange: [
        moment(event.startTime, 'HH:mm'),
        moment(event.endTime, 'HH:mm'),
      ],
      photographerId: event.photographerId,
      studioId: event.studioId,
      shootingType: event.shootingType,
      status: event.status,
      notes: event.notes, // Use notes field from Booking
    });
    setVisible(true);
  };

  // 处理表单提交
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const bookingData = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        date: moment.isMoment(values.date) ? values.date.format('YYYY-MM-DD') : values.date,
        startTime: values.timeRange[0].format('HH:mm'),
        endTime: values.timeRange[1].format('HH:mm'),
        photographerId: values.photographerId,
        studioId: values.studioId,
        shootingType: values.shootingType,
        status: values.status,
        notes: values.notes, // notes field from form
      };
      
      if (mode === 'create') {
        await createBooking(bookingData);
        message.success('预约创建成功');
      } else if (mode === 'edit' && currentEvent) {
        await updateBooking(currentEvent.id, bookingData);
        message.success('预约更新成功');
      }
      
      setVisible(false);
      fetchCalendarData(currentDate);
    } catch (error) {
      console.error('保存预约失败:', error);
      // Provide more specific error message if possible
      const errorMsg = error instanceof Error ? error.message : '保存预约失败';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 处理删除预约
  const handleDelete = async () => {
    if (!currentEvent) return;
    
    try {
      setLoading(true);
      await deleteBooking(currentEvent.id);
      message.success('预约删除成功');
      setVisible(false);
      fetchCalendarData(currentDate);
    } catch (error) {
      console.error('删除预约失败:', error);
      message.error('删除预约失败');
    } finally {
      setLoading(false);
    }
  };

  // 渲染预约表单
  const renderBookingForm = () => (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="customerName"
            label="客户姓名"
            rules={[{ required: true, message: '请输入客户姓名' }]}
          >
            <Input placeholder="请输入客户姓名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="customerPhone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="date"
            label="预约日期"
            rules={[{ required: true, message: '请选择预约日期' }]}
          >
            <Input disabled />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="timeRange"
            label="时间段"
            rules={[{ required: true, message: '请选择时间段' }]}
          >
            <RangePicker // Use the directly imported RangePicker
              picker="time" // Specify time picker mode
              format="HH:mm" 
              minuteStep={15}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="photographerId"
            label="摄影师"
          >
            <Select placeholder="请选择摄影师" allowClear>
              {photographers.map(item => (
                <Option key={item.value} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="studioId"
            label="工作室"
          >
            <Select placeholder="请选择工作室" allowClear>
              {studios.map(item => (
                <Option key={item.value} value={item.value}>{item.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="shootingType"
            label="拍摄类型"
            rules={[{ required: true, message: '请选择拍摄类型' }]}
          >
            <Select placeholder="请选择拍摄类型">
              {shootingTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="status"
            label="状态"
            initialValue="pending"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="pending">待确认</Option>
              <Option value="confirmed">已确认</Option>
              <Option value="cancelled">已取消</Option>
              <Option value="completed">已完成</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="no_show">未到店</Option>
              <Option value="rescheduled">已改期</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="notes" label="备注">
        <Input.TextArea rows={4} placeholder="请输入备注" />
      </Form.Item>
    </Form>
  );

  return (
    <div className="booking-calendar-container">
      <Card 
        title={
          <div className={styles.calendarHeader}>
            <Title level={4}>预约日历</Title>
            <div>
              <Button 
                type="link" 
                icon={<LeftOutlined />} 
                onClick={() => handlePanelChange(currentDate.clone().subtract(1, 'month'))} 
              />
              {currentDate.format('YYYY年MM月')}
              <Button 
                type="link" 
                icon={<RightOutlined />} 
                onClick={() => handlePanelChange(currentDate.clone().add(1, 'month'))} 
              />
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => handleSelect(moment())} 
            >
              新增预约
            </Button>
          </div>
        }
        bordered={false}
        loading={loading}
      >
        <Calendar 
          dateCellRender={dateCellRender} 
          onSelect={handleSelect}
          onPanelChange={handlePanelChange}
          value={currentDate}
        />
      </Card>
      
      <Modal
        title={mode === 'create' ? '新增预约' : '编辑预约'}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={[
          mode === 'edit' && (
            <Popconfirm
              key="delete"
              title="确定要删除这个预约吗?"
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button danger loading={loading}>删除</Button>
            </Popconfirm>
          ),
          <Button key="cancel" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            保存
          </Button>,
        ].filter(Boolean)}
        width={720}
        destroyOnClose
      >
        {renderBookingForm()}
      </Modal>
    </div>
  );
};

export default BookingCalendar;

