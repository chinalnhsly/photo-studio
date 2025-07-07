import React, { useState, useEffect } from 'react';
import { 
  Calendar, Card, Badge, Select, Button, Modal, 
  Form, DatePicker, InputNumber, Radio, message, 
  Tooltip, Popconfirm, Spin, Switch, Space, Tag 
} from 'antd';
//import type { CalendarProps } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import {
  PlusOutlined, CalendarOutlined,
  DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
type Moment = moment.Moment;
import {  
  createTimeSlots, 
  batchCreateTimeSlots,
  deleteTimeSlot,
  updateTimeSlot
} from '../../services/schedule';
import { 
  getPhotographerList,
  getPhotographerAvailability,
  PhotographerData
} from '@/services/photographer';
import './ScheduleCalendar.less';

const { Option } = Select;
const { RangePicker } =DatePicker;

// 类型定义
interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  photographerId: number;
  capacity: number;
  bookedCount: number;
  isAvailable: boolean;
}

interface ScheduleData {
  [key: string]: TimeSlot[];
}

interface CalendarHeaderProps {
  value: Moment;
  onChange: (date: Moment) => void;
}

const ScheduleCalendar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [photographers, setPhotographers] = useState<PhotographerData[]>([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState<number>();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [form] = Form.useForm();
  const [batchForm] = Form.useForm();

  // 加载摄影师列表
  useEffect(() => {
    fetchPhotographers();
  }, []);

  useEffect(() => {
    if (selectedPhotographer !== undefined) {
      fetchScheduleData();
    }
  }, [selectedPhotographer, currentDate]);

  const fetchPhotographers = async () => {
    try {
      setLoading(true);
      const response = await getPhotographerList({ isActive: true, limit: 100 });
      setPhotographers(response.data.list);
      
      if (response.data.list.length > 0) {
        setSelectedPhotographer(response.data.list[0].id);
      }
    } catch (error) {
      message.error('获取摄影师列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleData = async () => {
    if (!selectedPhotographer) return;
    
    try {
      setLoading(true);
      const month = currentDate.format('YYYY-MM');
      const response = await getPhotographerAvailability(selectedPhotographer, month);
      
      const dateData: ScheduleData = {};
      response.data.forEach((slot: TimeSlot) => {
        const dateStr = slot.date.split('T')[0];
        dateData[dateStr] = [...(dateData[dateStr] || []), slot];
      });
      
      setScheduleData(dateData);
    } catch (error) {
      message.error('获取排班数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: Moment) => {
    if (date.isBefore(moment().startOf('day'))) {
      message.warning('不能为过去的日期添加时间段');
      return;
    }
    
    form.resetFields();
    form.setFieldsValue({ date, photographerId: selectedPhotographer, capacity: 1 });
    setAddModalVisible(true);
  };

  const handleEditSlot = (slot: TimeSlot) => {
    form.setFieldsValue({
      date: moment(slot.date),
      timeRange: [moment(slot.startTime, 'HH:mm'), moment(slot.endTime, 'HH:mm')],
      photographerId: slot.photographerId,
      capacity: slot.capacity,
      isAvailable: slot.isAvailable
    });
    setEditingSlot(slot);
    setAddModalVisible(true);
  };

  const handleDeleteSlot = async (slotId: number) => {
    try {
      await deleteTimeSlot(slotId);
      message.success('删除时间段成功');
      fetchScheduleData();
    } catch (error) {
      message.error('删除时间段失败');
    }
  };

  const handleSaveSlot = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        date: values.date.format('YYYY-MM-DD'),
        startTime: values.timeRange[0].format('HH:mm'),
        endTime: values.timeRange[1].format('HH:mm'),
        photographerId: values.photographerId,
        capacity: values.capacity,
        isAvailable: values.isAvailable
      };

      editingSlot 
        ? await updateTimeSlot(editingSlot.id, data)
        : await createTimeSlots(data);
      
      setAddModalVisible(false);
      fetchScheduleData();
    } catch (error) {
      message.error('保存时间段失败');
    }
  };

  const handleBatchCreate = async () => {
    try {
      const values = await batchForm.validateFields() as {
        dateRange: [Moment, Moment];
        repeatType: 'all' | 'days';
        weekdays: number[];
        photographerId: number;
        timeSlots: Array<{ timeRange: [Moment, Moment] }>;
        capacity: number;
        isAvailable: boolean;
      };

      const dateRange: string[] = [];
      const current = moment(values.dateRange[0]);
      const end = moment(values.dateRange[1]);

      while (current.isSameOrBefore(end)) {
        if (values.repeatType === 'days' 
          ? values.weekdays.includes(current.day())
          : true
        ) {
          dateRange.push(current.format('YYYY-MM-DD'));
        }
        current.add(1, 'days');
      }

      if (!dateRange.length) {
        message.warning('没有符合条件的日期');
        return;
      }

      await batchCreateTimeSlots({
        dates: dateRange,
        timeSlots: values.timeSlots.map(slot => ({
          startTime: slot.timeRange[0].format('HH:mm'),
          endTime: slot.timeRange[1].format('HH:mm')
        })),
        photographerId: values.photographerId,
        capacity: values.capacity,
        isAvailable: values.isAvailable
      });

      setBatchModalVisible(false);
      fetchScheduleData();
    } catch (error) {
      message.error('批量创建失败');
    }
  };

  const dateCellRender = (date: Moment) => {
    const dateStr = date.format('YYYY-MM-DD');
    const slots = scheduleData[dateStr] || [];

    return (
      <div className="date-cell">
        {slots.length > 0 ? (
          <ul className="slot-list">
            {slots.map(slot => (
              <li key={slot.id} className="slot-item">
                <Badge 
                  status={slot.isAvailable ? 'success' : 'error'} 
                  text={`${slot.startTime.slice(0,5)}-${slot.endTime.slice(0,5)}`} 
                />
                <span className="slot-capacity">
                  ({slot.capacity - slot.bookedCount}/{slot.capacity})
                </span>
                <div className="slot-actions">
                  <Tooltip title="编辑">
                    <EditOutlined 
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleEditSlot(slot);
                      }}
                    />
                  </Tooltip>
                  <Popconfirm
                    title="确定删除？"
                    onConfirm={(e?: React.MouseEvent) => {
                      e?.stopPropagation();
                      handleDeleteSlot(slot.id);
                    }}
                  >
                    <DeleteOutlined onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                  </Popconfirm>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div 
            className="empty-date-cell" 
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleDateClick(date);
            }}
          >
            {date.isBefore(moment().startOf('day')) ? (
              <span className="past-date">已过期</span>
            ) : (
              <span className="add-slot-btn">
                <PlusOutlined /> 添加
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const CalendarHeader: React.FC<CalendarHeaderProps> = ({ value, onChange }) => (
    <div className="calendar-header">
      <div className="date-picker">
        <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>&lt;</Button>
        <span className="current-date">{value.format('YYYY年MM月')}</span>
        <Button onClick={() => onChange(value.clone().add(1, 'month'))}>&gt;</Button>
      </div>
      <Button onClick={() => onChange(moment())}>今天</Button>
    </div>
  );

  return (
    <div className="schedule-calendar-page">
      <Card
        title="摄影师排班日历"
        extra={
          <Space>
            <Select
              value={selectedPhotographer}
              onChange={setSelectedPhotographer}
              loading={loading}
              style={{ width: 200 }}
            >
              {photographers.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => {
                batchForm.resetFields();
                batchForm.setFieldsValue({
                  dateRange: [moment(), moment().add(7, 'days')],
                  repeatType: 'all',
                  weekdays: [1,2,3,4,5],
                  photographerId: selectedPhotographer,
                  timeSlots: [
                    { timeRange: [moment('09:00', 'HH:mm'), moment('11:00', 'HH:mm')] },
                    { timeRange: [moment('14:00', 'HH:mm'), moment('16:00', 'HH:mm')] }
                  ],
                  capacity: 1,
                  isAvailable: true
                });
                setBatchModalVisible(true);
              }}
            >
              批量添加
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <div className="schedule-legend">
            <Badge status="success" text="可预约" />
            <Badge status="error" text="不可预约" />
          </div>
          <Calendar
            value={currentDate}
            onPanelChange={setCurrentDate}
            dateFullCellRender={dateCellRender}
            headerRender={({ value, onChange }: { value: Moment; onChange: (date: Moment) => void }) => (
              <CalendarHeader value={value} onChange={onChange} />
            )}
          />
        </Spin>
      </Card>

      {/* 单个时间段弹窗 */}
      <Modal
        title={`${editingSlot ? '编辑' : '添加'}时间段`}
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={handleSaveSlot}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="日期" rules={[{ required: true }]}>
            <span>{form.getFieldValue('date')?.format('YYYY-MM-DD')}</span>
          </Form.Item>
          <Form.Item name="timeRange" label="时间段" rules={[{ required: true }]}>
            <RangePicker format="HH:mm" minuteStep={15} />
          </Form.Item>
          <Form.Item name="photographerId" label="摄影师" rules={[{ required: true }]}>
            <Select>
              {photographers.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="capacity" label="可预约人数" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item name="photographerId" label="摄影师" rules={[{ required: true }]}>
            <Select>
              {photographers.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isAvailable" label="是否可用" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 批量添加弹窗 */}
      <Modal
        title="批量添加时间段"
        open={batchModalVisible}
        onCancel={() => setBatchModalVisible(false)}
        onOk={handleBatchCreate}
        width={800}
      >
        <Form form={batchForm} layout="vertical">
            <Form.Item name="dateRange" label="日期范围" rules={[{ required: true }]}>
            <RangePicker disabledDate={(d: Moment): boolean => d.isBefore(moment().startOf('day'))} />
            </Form.Item>
          <Form.Item name="repeatType" initialValue="all">
            <Radio.Group>
              <Radio.Button value="all">每天</Radio.Button>
              <Radio.Button value="days">指定星期</Radio.Button>
            </Radio.Group>
          </Form.Item>
            <Form.Item
            noStyle
            shouldUpdate={(prevValues: Record<string, any>, currentValues: Record<string, any>) => 
              prevValues.repeatType !== currentValues.repeatType
            }
            >
            {({ getFieldValue }: { getFieldValue: (name: string) => any }) => getFieldValue('repeatType') === 'days' && (
              <Form.Item name="weekdays" rules={[{ required: true }]}>
              <Select mode="multiple" placeholder="选择星期">
                {[0,1,2,3,4,5,6].map((d: number) => (
                <Option key={d} value={d}>
                  {moment().day(d).format('dddd')}
                </Option>
                ))}
              </Select>
              </Form.Item>
            )}
            </Form.Item>
          <Form.List name="timeSlots">
            {(fields: any[], { add, remove }: { 
              add: (defaultValue?: { timeRange?: [Moment, Moment] }) => void; 
              remove: (index: number) => void;
            }) => (
              <div className="time-slots-list">
              <div className="list-header">
                <span>时间段</span>
                <Button type="link" icon={<PlusOutlined />} onClick={() => add()}>
                添加
                </Button>
              </div>
              {fields.map(({ key, name, ...rest }: { 
                key: number; 
                name: number; 
                fieldKey?: number;
                [restProp: string]: any;
              }) => (
                <div key={key} className="time-slot-item">
                <Form.Item
                  {...rest}
                  name={[name, 'timeRange']}
                  rules={[{ required: true }]}
                >
                  <RangePicker format="HH:mm" />
                </Form.Item>
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => remove(name)}
                />
                </div>
              ))}
              </div>
            )}
          </Form.List>
          <Form.Item name="photographerId" label="摄影师" rules={[{ required: true }]}>
            <Select>
              {photographers.map(p => (
                <Option key={p.id} value={p.id}>{p.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="capacity" label="可预约人数" rules={[{ required: true }]}>
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item name="isAvailable" label="是否可用" valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleCalendar;