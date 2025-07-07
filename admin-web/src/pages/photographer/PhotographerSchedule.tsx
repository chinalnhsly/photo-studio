import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Calendar,
  Badge,
  Select,
  Alert,
  Space,
  Row,
  Col,
  Divider,
  Typography,
  Spin,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Switch,
  message,
  Tabs,
  Radio
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DeleteOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { useParams, history } from 'umi';
import moment from 'moment';
type Moment = moment.Moment;
import {
  getPhotographerDetail
} from '../../services/photographer';
import './PhotographerSchedule.scss';

// 定义工作日设置类型
interface WeekdaySetting {
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

// 模拟的服务方法，实际项目中应该在服务文件中实现
const getPhotographerSchedule = async (id: number, startDate: string, endDate: string) => {
  console.log(`获取摄影师 ${id} 的排班，从 ${startDate} 到 ${endDate}`);
  return { data: { bookings: [], unavailableTimes: [] } };
};

const addUnavailableTime = async (id: number, data: any) => {
  console.log(`给摄影师 ${id} 添加不可用时间`, data);
  return { success: true };
};

const removeUnavailableTime = async (id: number, timeSlotId: number) => {
  console.log(`删除摄影师 ${id} 的不可用时间 ${timeSlotId}`);
  return { success: true };
};

const { Option } = Select;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface TimeSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
}

const PhotographerSchedule: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [photographer, setPhotographer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [unavailableTimes, setUnavailableTimes] = useState<TimeSlot[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState<string>('calendar');
  const [weekdaySettings, setWeekdaySettings] = useState<Record<string, WeekdaySetting>>({});
  const [copyModalVisible, setCopyModalVisible] = useState<boolean>(false);
  const [copyForm] = Form.useForm();

  // 加载摄影师基本信息
  useEffect(() => {
    fetchPhotographerData();
  }, [id]);

  // 根据选择日期加载排班数据
  useEffect(() => {
    if (photographer) {
      fetchScheduleData(selectedDate);
    }
  }, [selectedDate, photographer]);

  // 获取摄影师详情
  const fetchPhotographerData = async () => {
    setLoading(true);
    try {
      const response = await getPhotographerDetail(Number(id));
      setPhotographer(response.data);

      // 初始化工作日设置
      const weekdayData: Record<string, WeekdaySetting> = {};
      const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
      days.forEach(day => {
        weekdayData[day] = {
          isWorking: response.data.availableDays?.includes(day) || false,
          startTime: response.data.workStartTime || '09:00',
          endTime: response.data.workEndTime || '18:00',
        };
      });
      setWeekdaySettings(weekdayData);

    } catch (error) {
      message.error('获取摄影师信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取日程数据
  const fetchScheduleData = async (date: Moment) => {
    setScheduleLoading(true);
    try {
      const startDate = date.clone().startOf('month').format('YYYY-MM-DD');
      const endDate = date.clone().endOf('month').format('YYYY-MM-DD');

      const response = await getPhotographerSchedule(
        Number(id),
        startDate,
        endDate
      );

      setScheduleData(response.data.bookings || []);
      setUnavailableTimes(response.data.unavailableTimes || []);

    } catch (error) {
      message.error('获取排班信息失败');
    } finally {
      setScheduleLoading(false);
    }
  };

  // 添加不可用时间
  const handleAddUnavailableTime = async (values: any) => {
    try {
      // 如果是多日期范围
      if (values.dateRange) {
        const startDate = values.dateRange[0].format('YYYY-MM-DD');
        const endDate = values.dateRange[1].format('YYYY-MM-DD');

        // 计算范围内的每一天
        const diffDays = values.dateRange[1].diff(values.dateRange[0], 'days');
        const dates = [];
        for (let i = 0; i <= diffDays; i++) {
          dates.push(
            values.dateRange[0].clone().add(i, 'days').format('YYYY-MM-DD')
          );
        }

        for (const date of dates) {
          await addUnavailableTime(Number(id), {
            date,
            startTime: values.timeRange[0].format('HH:mm'),
            endTime: values.timeRange[1].format('HH:mm'),
            reason: values.reason,
          });
        }
      } else {
        // 单日期
        await addUnavailableTime(Number(id), {
          date: values.date.format('YYYY-MM-DD'),
          startTime: values.timeRange[0].format('HH:mm'),
          endTime: values.timeRange[1].format('HH:mm'),
          reason: values.reason,
        });
      }

      message.success('添加不可用时间成功');
      fetchScheduleData(selectedDate);
      setModalVisible(false);
    } catch (error) {
      message.error('添加不可用时间失败');
    }
  };

  // 删除不可用时间
  const handleRemoveUnavailableTime = async (timeSlotId: number) => {
    try {
      await removeUnavailableTime(Number(id), timeSlotId);
      message.success('删除不可用时间成功');
      fetchScheduleData(selectedDate);
    } catch (error) {
      message.error('删除不可用时间失败');
    }
  };

  // 日历单元格渲染
  const dateCellRender = (date: Moment) => {
    const dateStr = date.format('YYYY-MM-DD');
    const bookings = scheduleData.filter((booking: any) => booking.date === dateStr);
    const unavailable = unavailableTimes.filter((time: TimeSlot) => time.date === dateStr);

    return (
      <div className="date-cell">
        {bookings.length > 0 && (
          <Badge status="success" text={`${bookings.length} 个预约`} />
        )}
        {unavailable.length > 0 && (
          <Badge status="error" text={`${unavailable.length} 个不可用时间`} />
        )}
      </div>
    );
  };

  // 处理工作日开关变化
  const handleWeekdaySwitchChange = (day: string, checked: boolean) => {
    setWeekdaySettings({
      ...weekdaySettings,
      [day]: { ...weekdaySettings[day], isWorking: checked }
    });
  };

  // 处理时间选择变化
  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', time: Moment | null) => {
    if (!time) return;

    setWeekdaySettings({
      ...weekdaySettings,
      [day]: { ...weekdaySettings[day], [field]: time.format('HH:mm') }
    });
  };

  return (
    <div className="photographer-schedule-page">
      <Card className="schedule-card">
        <Spin spinning={loading}>
          <Title level={4}>
            <ArrowLeftOutlined onClick={() => history.goBack()} style={{ marginRight: 8 }} />
            摄影师排班管理
          </Title>
          {photographer && (
            <Alert
              message={`当前摄影师: ${photographer.name}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
            <TabPane tab="日历视图" key="calendar">
              <Spin spinning={scheduleLoading}>
                <Calendar
                  dateCellRender={dateCellRender}
                  onSelect={setSelectedDate}
                />
              </Spin>
            </TabPane>
            <TabPane tab="工作日设置" key="weekday">
              <Divider orientation="left">工作日设置</Divider>
              {Object.keys(weekdaySettings).map(day => (
                <Row key={day} gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={6}>
                    <Text>{day}</Text>
                  </Col>
                  <Col span={6}>
                    <Switch
                      checked={weekdaySettings[day].isWorking}
                      onChange={(checked: boolean) => handleWeekdaySwitchChange(day, checked)}
                    />
                  </Col>
                  <Col span={6}>
                    <TimePicker
                      value={moment(weekdaySettings[day].startTime, 'HH:mm')}
                      onChange={(time: Moment | null) => handleTimeChange(day, 'startTime', time)}
                    />
                  </Col>
                  <Col span={6}>
                    <TimePicker
                      value={moment(weekdaySettings[day].endTime, 'HH:mm')}
                      onChange={(time: Moment | null) => handleTimeChange(day, 'endTime', time)}
                    />
                  </Col>
                </Row>
              ))}
            </TabPane>
          </Tabs>
        </Spin>
      </Card>
    </div>
  );
};

export default PhotographerSchedule;
