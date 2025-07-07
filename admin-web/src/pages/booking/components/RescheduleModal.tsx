import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Space,
  Alert,
  Spin,
  Button,
  Divider,
  message,
} from 'antd';
import moment from 'moment';
import { getAvailableTimeSlots } from '../../../services/booking';
import{getPhotographerList} from '../../../services/photographer';
interface RescheduleModalProps {
  visible: boolean;
  booking: any;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  visible,
  booking,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photographersLoading, setPhotographersLoading] = useState(false);
  const [availableTimeslots, setAvailableTimeslots] = useState<any[]>([]);
  const [photographers, setPhotographers] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedPhotographer, setSelectedPhotographer] = useState<number | null>(null);
  const [timeslotsLoading, setTimeslotsLoading] = useState(false);

  // 当对话框打开时重置表单状态
  useEffect(() => {
    if (visible && booking) {
      form.resetFields();
      
      // 设置初始值
      const bookingDate = moment(booking.bookingDate);
      setSelectedDate(bookingDate);
      setSelectedPhotographer(booking.photographerId || null);
      
      // 设置表单的初始值
      form.setFieldsValue({
        date: bookingDate,
        photographerId: booking.photographerId,
        timeslot: null,
      });
      
      // 获取摄影师列表
      fetchPhotographers();
      
      // 获取可用时段
      if (booking.photographerId) {
        fetchAvailableTimeslots(bookingDate, booking.photographerId);
      }
    }
  }, [visible, booking]);

  // 获取摄影师列表
  const fetchPhotographers = async () => {
    setPhotographersLoading(true);
    try {
      const response = await getPhotographerList();
      // 现在 response.data 直接是列表数组
      setPhotographers(response.data || []);
    } catch (error) {
      console.error('获取摄影师列表失败:', error);
      message.error('获取摄影师列表失败');
    } finally {
      setPhotographersLoading(false);
    }
  };

  // 获取可用时段
  const fetchAvailableTimeslots = async (date: moment.Moment, photographerId?: number) => {
    if (!date) return;
    
    setTimeslotsLoading(true);
    try {
      // 只有当photographerId是有效的number时才调用API
      if (typeof photographerId === 'number') {
        const response = await getAvailableTimeSlots({
          date: date.format('YYYY-MM-DD'),
          photographerId,
          studioId: 0, // 提供一个默认值或从booking中获取
        });
        
        // 现在 response.data 直接是时段数组
        setAvailableTimeslots(response.data || []);
      } else {
        setAvailableTimeslots([]);
      }
    } catch (error) {
      console.error('获取可用时段失败:', error);
      message.error('获取可用时段失败');
    } finally {
      setTimeslotsLoading(false);
    }
  };

  // 处理日期变更
  const handleDateChange = (date: moment.Moment | null) => {
    if (date) {
      setSelectedDate(date);
      form.setFieldsValue({ timeslot: null });
      fetchAvailableTimeslots(date, selectedPhotographer || undefined);
    }
  };

  // 处理摄影师变更
  const handlePhotographerChange = (value: number) => {
    setSelectedPhotographer(value);
    form.setFieldsValue({ timeslot: null });
    if (selectedDate) {
      fetchAvailableTimeslots(selectedDate, value);
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const selectedTimeslot = availableTimeslots.find(
        timeslot => timeslot.id === values.timeslot
      );

      onOk({
        date: values.date.format('YYYY-MM-DD'),
        photographerId: values.photographerId,
        timeslotId: values.timeslot,
        startTime: selectedTimeslot?.startTime,
        endTime: selectedTimeslot?.endTime,
      });
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 获取工作室信息
  const getStudioName = (timeslotId: number) => {
    const timeslot = availableTimeslots.find(t => t.id === timeslotId);
    return timeslot?.studioName || '默认工作室';
  };

  // 检查时段是否被推荐
  const isRecommendedTimeslot = (timeslot: any) => {
    return timeslot.isRecommended;
  };

  return (
    <Modal
      title="重新安排预约时间"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          disabled={timeslotsLoading}
        >
          确认更改
        </Button>,
      ]}
      destroyOnClose
    >
      <Spin spinning={loading || photographersLoading}>
        <Alert
          message="您正在修改预约的时间，这将通知客户和相关人员。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form
          form={form}
          layout="vertical"
        >
            <Form.Item
            name="date"
            label="选择日期"
            rules={[{ required: true, message: '请选择日期' }]}
            >
            <DatePicker
              style={{ width: '100%' as React.CSSProperties["width"] }}
              disabledDate={(current: moment.Moment | null): boolean => {
              // 不能选择过去的日期
              return current ? current < moment().startOf('day') : false;
              }}
              onChange={handleDateChange}
              allowClear={false}
            />
            </Form.Item>
          
          <Form.Item
            name="photographerId"
            label="摄影师"
            rules={[{ required: true, message: '请选择摄影师' }]}
          >
            <Select
              placeholder="选择摄影师"
              onChange={handlePhotographerChange}
              loading={photographersLoading}
            >
              {photographers.map((photographer) => (
                <Select.Option key={photographer.id} value={photographer.id}>
                  {photographer.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="timeslot"
            label="可用时段"
            rules={[{ required: true, message: '请选择时段' }]}
            extra={timeslotsLoading ? "正在加载可用时段..." : null}
          >
            <Select 
              placeholder="选择时段"
              loading={timeslotsLoading}
              optionLabelProp="label"
            >
              {availableTimeslots.map(slot => (
                <Select.Option 
                  key={slot.id} 
                  value={slot.id} 
                  label={`${slot.startTime} - ${slot.endTime}`}
                >
                  <div className="time-slot-option">
                    <div>
                      <span className="time-range">{slot.startTime} - {slot.endTime}</span>
                      {isRecommendedTimeslot(slot) && (
                        <span className="recommended-tag">推荐</span>
                      )}
                    </div>
                    <div className="studio-name">{getStudioName(slot.id)}</div>
                  </div>
                </Select.Option>
              ))}
              {availableTimeslots.length === 0 && !timeslotsLoading && (
                <Select.Option disabled value="none">
                  所选日期无可用时段
                </Select.Option>
              )}
            </Select>
          </Form.Item>
          
          <Divider />
          
          <Form.Item label="当前预约信息">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>客户: <strong>{booking?.customerName}</strong></div>
              <div>项目: <strong>{booking?.serviceTypeName}</strong></div>
              <div>原定时间: <strong>{booking?.bookingDate} {booking?.startTime}-{booking?.endTime}</strong></div>
              <div>摄影师: <strong>{booking?.photographer?.name || '未指定'}</strong></div>
              {booking?.studioName && <div>工作室: <strong>{booking?.studioName}</strong></div>}
            </Space>
          </Form.Item>
        </Form>
      </Spin>
      
      <style>
      {`
        .time-slot-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .time-range {
          font-weight: 500;
        }
        .recommended-tag {
          background: #f50;
          color: white;
          padding: 0 5px;
          border-radius: 2px;
          font-size: 12px;
          margin-left: 8px;
        }
        .studio-name {
          color: rgba(0, 0, 0, 0.45);
          font-size: 12px;
        }
      `}
      </style>
    </Modal>
  );
};

export default RescheduleModal;
