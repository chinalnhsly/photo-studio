import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  Table,
  Statistic,
  Divider,
  Select,
  Space,
  Radio,
  Tabs,
  Typography,
  Spin,
  Empty,
  Tooltip,
  Result,
  Dropdown,
  Menu
} from 'antd';
import {
  DownloadOutlined,
  ReloadOutlined,
  RiseOutlined,
  FallOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  PercentageOutlined,
  FileExcelOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { getSalesReportData, getSalesComparison, exportSalesReport } from '../../services/report';
import './SalesReport.scss';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import type { RadioChangeEvent } from 'antd/lib/radio';
import type { MenuInfo } from 'rc-menu/lib/interface';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const SalesReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(30, 'days'),
    moment()
  ]);
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');
  const [dataType, setDataType] = useState<'revenue' | 'orders' | 'average' | 'conversion'>('revenue');
  const [exportFormat, setExportFormat] = useState<'excel' | 'pdf'>('excel');
  const [reportData, setReportData] = useState<any>({
    summary: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      conversionRate: 0
    },
    trends: [],
    topProducts: [],
    categorySales: [],
    paymentMethods: []
  });
  const [comparisonData, setComparisonData] = useState<any>({
    revenue: {
      current: 0,
      previous: 0,
      change: 0
    },
    orders: {
      current: 0,
      previous: 0,
      change: 0
    },
    average: {
      current: 0,
      previous: 0,
      change: 0
    },
    conversion: {
      current: 0,
      previous: 0,
      change: 0
    }
  });
  const [error, setError] = useState<string | null>(null);

  // 初始加载数据
  useEffect(() => {
    fetchReportData();
  }, [dateRange, groupBy]);

  // 获取报表数据
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 获取销售报表数据
      const response = await getSalesReportData({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        groupBy: groupBy
      });
      setReportData(response.data);

      // 获取同比数据
      const prevStartDate = dateRange[0].clone().subtract(dateRange[1].diff(dateRange[0], 'days'), 'days');
      const prevEndDate = dateRange[0].clone().subtract(1, 'days');
      
      const comparisonResponse = await getSalesComparison({
        currentStart: dateRange[0].format('YYYY-MM-DD'),
        currentEnd: dateRange[1].format('YYYY-MM-DD'),
        previousStart: prevStartDate.format('YYYY-MM-DD'),
        previousEnd: prevEndDate.format('YYYY-MM-DD')
      });
      setComparisonData(comparisonResponse.data);
    } catch (error) {
      console.error('获取销售报表数据失败:', error);
      setError('获取销售数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 导出报表
  const handleExportReport = async () => {
    try {
      setExportLoading(true);
      await exportSalesReport({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        format: exportFormat
      });
      setExportLoading(false);
    } catch (error) {
      console.error('导出报表失败:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // 销售趋势图配置
  const getTrendConfig = () => {
    // 根据选择的数据类型获取对应配置
    const fieldMap = {
      revenue: { field: 'revenue', alias: '销售额', color: '#1890ff', prefix: '¥' },
      orders: { field: 'orders', alias: '订单数', color: '#52c41a', prefix: '' },
      average: { field: 'averageValue', alias: '客单价', color: '#fa8c16', prefix: '¥' },
      conversion: { field: 'conversionRate', alias: '转化率', color: '#722ed1', prefix: '', suffix: '%' }
    };
    
    const currentField = fieldMap[dataType];
    
    return {
      data: reportData.trends || [],
      xField: 'date',
      yField: currentField.field,
      seriesField: 'type',
      color: currentField.color,
      meta: {
        [currentField.field]: {
          alias: currentField.alias,
          formatter: (value: number) => {
            if (dataType === 'conversion') {
              return `${value.toFixed(2)}%`;
            } else if (dataType === 'revenue' || dataType === 'average') {
              return `¥${value.toFixed(2)}`;
            }
            return value;
          }
        }
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        label: {
          formatter: (value: string) => {
            // 格式化Y轴标签
            const num = parseFloat(value);
            if (dataType === 'conversion') {
              return `${num.toFixed(1)}%`;
            } else if (dataType === 'revenue' || dataType === 'orders') {
              // 大数字简化显示
              if (num >= 1000000) {
                return `${(num / 1000000).toFixed(1)}M`;
              } else if (num >= 1000) {
                return `${(num / 1000).toFixed(1)}K`;
              }
            }
            return value;
          },
        },
      },
      smooth: true,
      animation: {
        appear: {
          animation: 'path-in',
          duration: 1000,
        },
      },
      tooltip: {
        formatter: (datum: any) => {
          const formattedValue = dataType === 'conversion' 
            ? `${datum[currentField.field].toFixed(2)}%`
            : (dataType === 'revenue' || dataType === 'average')
              ? `¥${datum[currentField.field].toFixed(2)}`
              : datum[currentField.field];
          
          return {
            name: currentField.alias,
            value: formattedValue
          };
        }
      }
    };
  };

  // 品类销售占比图配置
  const categoryPieConfig = {
    data: reportData.categorySales || [],
    angleField: 'value',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 支付方式占比图配置
  const paymentPieConfig = {
    data: reportData.paymentMethods || [],
    angleField: 'value',
    colorField: 'method',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 热销商品表格列
  const topProductColumns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      render: (_: any, __: any, index: number) => index + 1,
      width: 70,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '销量',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a: any, b: any) => a.quantity - b.quantity,
      width: 100,
    },
    {
      title: '销售额',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      render: (revenue: number) => `¥${revenue.toFixed(2)}`,
      width: 120,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${percentage.toFixed(2)}%`,
      width: 90,
    },
  ];

  if (error) {
    return (
      <div className="sales-report-page">
        <Result
          status="error"
          title="获取数据失败"
          subTitle={error}
          extra={
            <Button type="primary" onClick={fetchReportData}>
              重试
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="sales-report-page">
      <Card className="filter-card">
        <div className="filter-container">
          <div className="date-filter">
            <RangePicker
              value={dateRange}
              onChange={(dates: RangeValue<moment.Moment>) => {
                if (dates) {
                  setDateRange(dates as [moment.Moment, moment.Moment]);
                }
              }}
              ranges={{
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '本周': [moment().startOf('week'), moment().endOf('week')],
                '本月': [moment().startOf('month'), moment().endOf('month')],
                '上月': [
                  moment().subtract(1, 'months').startOf('month'),
                  moment().subtract(1, 'months').endOf('month')
                ],
                '最近7天': [moment().subtract(6, 'days'), moment()],
                '最近30天': [moment().subtract(29, 'days'), moment()]
              }}
            />
          </div>
          
          <div className="group-filter">
            <Radio.Group value={groupBy} onChange={(e: RadioChangeEvent) => setGroupBy(e.target.value)}>
              <Radio.Button value="day">按天</Radio.Button>
              <Radio.Button value="week">按周</Radio.Button>
              <Radio.Button value="month">按月</Radio.Button>
            </Radio.Group>
          </div>
          
          <div className="action-buttons">
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchReportData}
                loading={loading}
              >
                刷新
              </Button>
              
              <Dropdown
                overlay={
                  <Menu 
                    onClick={(e: MenuInfo) => setExportFormat(e.key.toString() as 'excel' | 'pdf')}
                  >
                    <Menu.Item key="excel" icon={<FileExcelOutlined />}>导出为Excel</Menu.Item>
                    <Menu.Item key="pdf" icon={<FilePdfOutlined />}>导出为PDF</Menu.Item>
                  </Menu>
                }
              >
                <Button
                  icon={<DownloadOutlined />}
                  onClick={(e: React.MouseEvent<HTMLElement>) => {
                    handleExportReport();
                  }}
                  loading={exportLoading}
                >
                  导出报表 ({exportFormat === 'excel' ? 'Excel' : 'PDF'})
                </Button>
              </Dropdown>
            </Space>
          </div>
        </div>
      </Card>
      
      {/* 概览统计卡片 */}
      <Row gutter={16} className="summary-cards">
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title={
                <div className="stat-title">
                  <span>销售总额</span>
                  <Tooltip title="所选时间段内的总销售额">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              }
              value={reportData.summary.totalRevenue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix={
                <div className={`trend-indicator ${comparisonData.revenue.change >= 0 ? 'up' : 'down'}`}>
                  {comparisonData.revenue.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {Math.abs(comparisonData.revenue.change)}%
                </div>
              }
            />
            <div className="stat-footer">
              同比上期: {comparisonData.revenue.previous.toFixed(2)}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title={
                <div className="stat-title">
                  <span>订单总数</span>
                  <Tooltip title="所选时间段内的订单数量">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              }
              value={reportData.summary.totalOrders}
              prefix={<ShoppingOutlined />}
              suffix={
                <div className={`trend-indicator ${comparisonData.orders.change >= 0 ? 'up' : 'down'}`}>
                  {comparisonData.orders.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {Math.abs(comparisonData.orders.change)}%
                </div>
              }
            />
            <div className="stat-footer">
              同比上期: {comparisonData.orders.previous}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title={
                <div className="stat-title">
                  <span>客单价</span>
                  <Tooltip title="平均每笔订单的金额">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              }
              value={reportData.summary.averageOrderValue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix={
                <div className={`trend-indicator ${comparisonData.average.change >= 0 ? 'up' : 'down'}`}>
                  {comparisonData.average.change >= 0 ? <RiseOutlined /> : <FallOutlined />}
                  {Math.abs(comparisonData.average.change)}%
                </div>
              }
            />
            <div className="stat-footer">
              同比上期: {comparisonData.average.previous.toFixed(2)}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title={
                <div className="stat-title">
                  <span>转化率</span>
                  <Tooltip title="访客转化为购买的比率">
                    <InfoCircleOutlined />
                  </Tooltip>
                </div>
              }
              value={reportData.summary.conversionRate}
              precision={2}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
            <div className="stat-footer">
              同比上期: {comparisonData.conversion.previous.toFixed(2)}%
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesReport;