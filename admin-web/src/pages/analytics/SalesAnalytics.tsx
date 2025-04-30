import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, DatePicker, Button, Select, Tabs, 
  Statistic, Divider, Table, message, Spin, Radio, Space 
} from 'antd';
import {
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import moment from 'moment';
type Moment = moment.Moment;
// 修正导入路径
import { Line, Pie } from '../../components/Charts';
import api from '../../services/api';
import ExportButton from '../../components/ExportButton';
import { ReportType } from '../../services/export';
import './SalesAnalytics.less';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// 图表数据类型
interface ChartData {
  date: string;
  value: number;
  type: string;
}

// 销售摘要类型
interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  comparisonPercentage: number;
}

// 销售渠道类型
interface SalesChannel {
  name: string;
  value: number;
  percentage: number;
}

// 热门套餐类型
interface PopularPackage {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

const SalesAnalytics: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState<[Moment, Moment]>([
    moment().subtract(30, 'days'),
    moment()
  ]);
  const [timeUnit, setTimeUnit] = useState<string>('day');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary>({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    comparisonPercentage: 0,
  });
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
  const [popularPackages, setPopularPackages] = useState<PopularPackage[]>([]);

  // 初始加载和参数变化时获取数据
  useEffect(() => {
    fetchSalesData();
  }, [dateRange, timeUnit]);

  // 获取销售数据
  const fetchSalesData = async () => {
    setLoading(true);
    try {
      // 实际项目中应该调用API获取数据
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 使用模拟数据
      setSalesSummary({
        totalSales: 89650,
        totalOrders: 126,
        averageOrderValue: 711.5,
        comparisonPercentage: 12.5,
      });
      
      setSalesChannels([
        { name: '线上平台', value: 48960, percentage: 54.6 },
        { name: '门店销售', value: 31780, percentage: 35.5 },
        { name: '转介绍', value: 8910, percentage: 9.9 },
      ]);
      
      setPopularPackages([
        { id: 1, name: '婚纱摄影套餐A', category: '婚纱摄影', sales: 28, revenue: 33600, percentage: 37.5 },
        { id: 2, name: '写真照套餐', category: '写真照', sales: 45, revenue: 22500, percentage: 25.1 },
        { id: 3, name: '儿童照套餐', category: '儿童照', sales: 32, revenue: 12800, percentage: 14.3 },
        { id: 4, name: '全家福套餐', category: '全家福', sales: 21, revenue: 20750, percentage: 23.1 },
      ]);
      
      // 生成图表数据
      const generatedChartData = generateMockChartData();
      setChartData(generatedChartData);
      
    } catch (error) {
      message.error('获取销售数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 生成模拟图表数据
  const generateMockChartData = () => {
    const data: ChartData[] = [];
    const startDate = dateRange[0].clone();
    const endDate = dateRange[1].clone();
    const diffDays = endDate.diff(startDate, 'days') + 1;
    
    // 确定数据点数量
    let dateFormat: string;
    let dateDiff: number;
    
    switch (timeUnit) {
      case 'day':
        dateFormat = 'YYYY-MM-DD';
        dateDiff = 1;
        break;
      case 'week':
        dateFormat = 'YYYY-WW周';
        dateDiff = 7;
        break;
      case 'month':
        dateFormat = 'YYYY-MM';
        dateDiff = 30;
        break;
      default:
        dateFormat = 'YYYY-MM-DD';
        dateDiff = 1;
    }
    
    // 生成收入数据
    for (let i = 0; i < diffDays; i += dateDiff) {
      const currentDate = startDate.clone().add(i, 'days');
      const formattedDate = currentDate.format(dateFormat);
      
      // 随机生成销售额
      const revenue = Math.floor(Math.random() * 10000) + 2000;
      
      data.push({
        date: formattedDate,
        value: revenue,
        type: '销售额',
      });
    }
    
    // 生成订单数数据
    for (let i = 0; i < diffDays; i += dateDiff) {
      const currentDate = startDate.clone().add(i, 'days');
      const formattedDate = currentDate.format(dateFormat);
      
      // 随机生成订单数
      const orders = Math.floor(Math.random() * 15) + 1;
      
      data.push({
        date: formattedDate,
        value: orders,
        type: '订单数',
      });
    }
    
    return data;
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // 处理时间单位变化
  const handleTimeUnitChange = (value: string) => {
    setTimeUnit(value);
  };

  // 热门套餐表格列定义
  const packageColumns = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '套餐名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '销量',
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a: PopularPackage, b: PopularPackage) => a.sales - b.sales,
    },
    {
      title: '销售额',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a: PopularPackage, b: PopularPackage) => a.revenue - b.revenue,
      render: (revenue: number) => `￥${revenue.toLocaleString()}`,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      sorter: (a: PopularPackage, b: PopularPackage) => a.percentage - b.percentage,
      render: (percentage: number) => `${percentage}%`,
    },
  ];

  return (
    <div className="sales-analytics-page" id="sales-analytics-content">
      <Card className="filter-card">
        <div className="filters">
          <div>
            <span className="filter-label">日期范围:</span>
            <RangePicker 
              value={dateRange} 
              onChange={handleDateRangeChange} 
              style={{ width: 280 }}
            />
          </div>
          <div>
            <span className="filter-label">时间粒度:</span>
            <Select
              value={timeUnit}
              onChange={handleTimeUnitChange}
              style={{ width: 120 }}
            >
              <Option value="day">按日</Option>
              <Option value="week">按周</Option>
              <Option value="month">按月</Option>
            </Select>
          </div>
          <div>
            <ExportButton 
              reportType={ReportType.SALES}
              elementId="sales-analytics-content"
              dateRange={[dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')]}
            />
          </div>
        </div>
      </Card>

      <Tabs 
        activeKey={currentTab} 
        onChange={setCurrentTab}
        className="analytics-tabs"
      >
        <TabPane tab="销售概览" key="overview">
          {/* 销售数据摘要 */}
          <Row gutter={16} className="stat-row">
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总销售额"
                  value={salesSummary.totalSales}
                  prefix="￥"
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                />
                <div className="stat-footer">
                  <span className="trend-up">
                    <RiseOutlined /> {salesSummary.comparisonPercentage}%
                  </span>
                  <span className="comparison-text">与上期相比</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="订单数量"
                  value={salesSummary.totalOrders}
                  suffix="笔"
                />
                <div className="stat-footer">
                  <span className="trend-up">
                    <RiseOutlined /> 8.1%
                  </span>
                  <span className="comparison-text">与上期相比</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="平均订单价值"
                  value={salesSummary.averageOrderValue}
                  prefix="￥"
                  precision={2}
                />
                <div className="stat-footer">
                  <span className="trend-up">
                    <RiseOutlined /> 3.2%
                  </span>
                  <span className="comparison-text">与上期相比</span>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="转化率"
                  value={15.3}
                  precision={1}
                  suffix="%"
                />
                <div className="stat-footer">
                  <span className="trend-down">
                    <FallOutlined /> 0.5%
                  </span>
                  <span className="comparison-text">与上期相比</span>
                </div>
              </Card>
            </Col>
          </Row>

          {/* 销售趋势图表 */}
          <Card className="chart-card" title="销售趋势">
            <Spin spinning={loading}>
              <div style={{ height: 400 }}>
                <Line />
              </div>
            </Spin>
          </Card>

          {/* 销售渠道和热门套餐 */}
          <Row gutter={16}>
            <Col xs={24} lg={8}>
              <Card className="chart-card" title="销售渠道分布">
                <Spin spinning={loading}>
                  <div style={{ height: 320 }}>
                    <Pie />
                  </div>
                </Spin>
              </Card>
            </Col>
            <Col xs={24} lg={16}>
              <Card className="chart-card" title="热门套餐排行">
                <Spin spinning={loading}>
                  <Table 
                    dataSource={popularPackages} 
                    columns={packageColumns} 
                    rowKey="id"
                    pagination={false}
                    size="middle"
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="销售详情" key="details">
          {/* 销售详情内容 */}
          <Card>
            <div className="details-placeholder">
              <Spin spinning={loading}>
                <div>销售详情内容</div>
              </Spin>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SalesAnalytics;
