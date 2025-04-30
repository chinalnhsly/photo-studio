import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, List, Typography, Spin, Button, Progress, Avatar, Tag, Empty, DatePicker } from 'antd';
import moment from 'moment';
type Moment = moment.Moment;
import {
  UserOutlined,
  CameraOutlined,
  CalendarOutlined,
  ShopOutlined,
  DollarOutlined,
  RiseOutlined,
  TeamOutlined,
  FileImageOutlined,
  StarOutlined,
  CheckCircleOutlined,
  FallOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { history } from '../../utils/compatibility';
import { getStatistics } from './service';
import './style.less';
import { Line, Pie } from '@/components/Charts';
type StatusType = "PENDING" | "CONFIRMED" | "COMPLETED" | "IN_PROGRESS" | "CANCELLED" | "NO_SHOW" | "RESCHEDULED"
const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [revenueLoading, setRevenueLoading] = useState<boolean>(true);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(true);
  
  const [stats, setStats] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  
  const [dateRange, setDateRange] = useState<[Moment, Moment]>([
    moment().subtract(30, 'days'),
    moment()
  ]);
  
  // 加载数据
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 加载收入数据
  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

  // 获取仪表盘数据
  const fetchDashboardData = async () => {
    setLoading(true);
    setStatsLoading(true);
    setBookingsLoading(true);
    
    try {
      // 并行请求数据
      const [statsResponse, bookingsResponse, popularServicesResponse] = await Promise.all([
        getDashboardStats(),
        getRecentBookings({ limit: 5 }),
        getPopularServices()
      ]);
      
      setStats(statsResponse.data);
      setRecentBookings(bookingsResponse.data);
      setPopularServices(popularServicesResponse.data);
    } catch (error) {
      console.error('获取仪表盘数据失败', error);
    } finally {
      setLoading(false);
      setStatsLoading(false);
      setBookingsLoading(false);
    }
  };

  // 获取收入数据
  const fetchRevenueData = async () => {
    setRevenueLoading(true);
    try {
      const response = await getRevenueStats({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD')
      });
      setRevenueData(response.data);
    } catch (error) {
      console.error('获取收入数据失败', error);
    } finally {
      setRevenueLoading(false);
    }
  };

  // 获取状态色彩
  const getStatusColor = (status: string) => {
    const colorMap: Record<StatusType, string> = { 
      'PENDING': 'orange',
      'CONFIRMED': 'green',
      'COMPLETED': 'blue',
      'IN_PROGRESS': 'purple',
      'CANCELLED': 'red',
      'NO_SHOW': 'default',
      'RESCHEDULED': 'geekblue' };
  
    return colorMap[status as StatusType] || 'default';
  };

  // 获取状态文字
  const getStatusText = (status: string) => {
    const statusMap = {
      'PENDING': '待确认',
      'CONFIRMED': '已确认',
      'COMPLETED': '已完成',
      'IN_PROGRESS': '进行中',
      'CANCELLED': '已取消',
      'NO_SHOW': '未到店',
      'RESCHEDULED': '已改期'
    };
    return statusMap[status as StatusType] || status;
  };

  // 配置折线图
  const lineConfig = {
    data: revenueData?.dailyRevenue || [],
    xField: 'date',
    yField: 'revenue',
    seriesField: 'type',
    yAxis: {
      title: {
        text: '金额 (元)',
      },
    },
    xAxis: {
      title: {
        text: '日期',
      },
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: `¥${datum.revenue}` };
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
    color: ['#1890ff', '#2fc25b'],
  };

  // 配置饼图
  const pieConfig = {
    appendPadding: 10,
    data: popularServices,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [{ type: 'element-active' }],
    legend: {
      layout: 'horizontal',
      position: 'bottom'
    }
  };

  return (
    <div className="dashboard-page">
      {/* 页面内容... */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="greeting">
            <h2>欢迎回来，管理员</h2>
            <p>{moment().format('YYYY年MM月DD日 dddd')}</p>
          </div>
          <div className="actions">
            <Button 
              type="primary" 
              icon={<CalendarOutlined />}
              onClick={() => history.push('/booking/create')}
            >
              创建预约
            </Button>
          </div>
        </div>
      </div>
      
      {/* 其余UI组件... */}
    </div>
  );
};

// 获取状态徽章颜色
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'CONFIRMED':
      return 'processing';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'IN_PROGRESS':
      return 'processing';
    case 'NO_SHOW':
      return 'default';
    case 'RESCHEDULED':
      return 'purple';
    default:
      return 'default';
  }
};

// 这些是需要在组件外部定义的辅助函数
const getDashboardStats = () => {
  // 此处应该是一个真实的API调用
  return Promise.resolve({
    data: {
      todayBookings: 5,
      todayBookingsChange: 20,
      monthRevenue: 12500,
      monthRevenueChange: -5,
      activeCustomers: 42,
      studioUsageRate: 85,
      // 其他统计数据...
    }
  });
};

const getRecentBookings = (params: any) => {
  // 此处应该是一个真实的API调用
  return Promise.resolve({
    data: [
      // 模拟数据...
    ]
  });
};

const getPopularServices = () => {
  // 此处应该是一个真实的API调用
  return Promise.resolve({
    data: [
      // 模拟数据...
    ]
  });
};

const getRevenueStats = (params: any) => {
  // 此处应该是一个真实的API调用
  return Promise.resolve({
    data: {
      // 模拟数据...
    }
  });
};

export default Dashboard;