import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Select,
  Button,
  Tabs,
  Typography,
  Space,
  Divider,
  Tooltip,
} from 'antd';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  PayCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  FilterOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { 
  getFinancialSummary, 
  getRevenueByPeriod, 
  getRevenueByCategory,
  getTransactions
} from '../../services/finance';
import './FinancialOverview.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

// 图表配色方案
const COLORS = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96', '#f5222d', '#fa8c16', '#13c2c2', '#2f54eb'];

const FinancialOverview: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>({});
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<[moment.Moment, moment.Moment]>([
    moment().subtract(30, 'days'),
    moment(),
  ]);
  const [periodType, setPeriodType] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // 初始化加载数据
  useEffect(() => {
    fetchFinancialData();
  }, [timeRange, periodType]);

  // 获取财务数据
  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // 获取财务摘要
      const summaryResponse = await getFinancialSummary({
        startDate: timeRange[0].format('YYYY-MM-DD'),
        endDate: timeRange[1].format('YYYY-MM-DD'),
      });
      setSummaryData(summaryResponse.data);

      // 获取时间段内的收入数据
      const revenueResponse = await getRevenueByPeriod({
        startDate: timeRange[0].format('YYYY-MM-DD'),
        endDate: timeRange[1].format('YYYY-MM-DD'),
        periodType,
      });
      setRevenueData(revenueResponse.data);

      // 获取分类收入数据
      const categoryResponse = await getRevenueByCategory({
        startDate: timeRange[0].format('YYYY-MM-DD'),
        endDate: timeRange[1].format('YYYY-MM-DD'),
      });
      setCategoryData(categoryResponse.data);

      // 获取交易记录
      const transactionsResponse = await getTransactions({
        startDate: timeRange[0].format('YYYY-MM-DD'),
        endDate: timeRange[1].format('YYYY-MM-DD'),
        limit: 10,
      });
      setTransactions(transactionsResponse.data.transactions);
    } catch (error) {
      console.error('获取财务数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理日期范围变化
  const handleRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setTimeRange([dates[0], dates[1]]);
    }
  };

  // 处理周期类型变更
  const handlePeriodChange = (value: 'daily' | 'weekly' | 'monthly') => {
    setPeriodType(value);
  };

  // 交易记录表格列定义
  const transactionColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '交易编号',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        let color = '';
        let text = type;
        switch (type) {
          case 'payment':
            color = 'green';
            text = '收款';
            break;
          case 'refund':
            color = 'red';
            text = '退款';
            break;
          case 'expense':
            color = 'orange';
            text = '支出';
            break;
          default:
            color = 'blue';
            text = type;
        }
        return <span className={`transaction-type-${color}`}>{text}</span>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: any) => {
        const isPositive = record.type === 'payment';
        return (
          <span style={{ color: isPositive ? '#52c41a' : '#f5222d' }}>
            {isPositive ? '+' : '-'}¥{Math.abs(amount).toFixed(2)}
          </span>
        );
      },
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => {
        const methodMap: { [key: string]: string } = {
          'cash': '现金',
          'wechat': '微信',
          'alipay': '支付宝',
          'card': '银行卡',
          'transfer': '银行转账',
        };
        return methodMap[method] || method;
      },
    },
    {
      title: '客户',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  return (
    <div className="financial-overview-page">
      <div className="page-header">
        <Title level={4}>财务概览</Title>
        <div className="date-filter">
          <Space>
            <RangePicker
              value={timeRange}
              onChange={handleRangeChange}
              allowClear={false}
            />
            <Select value={periodType} onChange={handlePeriodChange} style={{ width: 120 }}>
              <Option value="daily">按日</Option>
              <Option value="weekly">按周</Option>
              <Option value="monthly">按月</Option>
            </Select>
            <Button icon={<ExportOutlined />}>导出数据</Button>
          </Space>
        </div>
      </div>

      {/* 财务概览卡片 */}
      <Row gutter={[24, 24]} className="summary-cards">
        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card">
            <Statistic
              title={
                <Space>
                  <span>总收入</span>
                  <Tooltip title="所选时间段内的所有收入">
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              value={summaryData.totalRevenue || 0}
              precision={2}
              prefix={<DollarOutlined />}
              suffix={
                <div className="trend">
                  {summaryData.revenueGrowth > 0 ? (
                    <>
                      <ArrowUpOutlined />
                      <span className="positive">
                        {summaryData.revenueGrowth || 0}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownOutlined />
                      <span className="negative">
                        {Math.abs(summaryData.revenueGrowth || 0)}%
                      </span>
                    </>
                  )}
                </div>
              }
              loading={loading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card">
            <Statistic
              title={
                <Space>
                  <span>订单数</span>
                  <Tooltip title="所选时间段内的订单总量">
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              value={summaryData.totalOrders || 0}
              prefix={<ShoppingOutlined />}
              suffix={
                <div className="trend">
                  {summaryData.orderGrowth > 0 ? (
                    <>
                      <ArrowUpOutlined />
                      <span className="positive">{summaryData.orderGrowth || 0}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownOutlined />
                      <span className="negative">
                        {Math.abs(summaryData.orderGrowth || 0)}%
                      </span>
                    </>
                  )}
                </div>
              }
              loading={loading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card">
            <Statistic
              title={
                <Space>
                  <span>平均客单价</span>
                  <Tooltip title="平均每个订单的金额">
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              value={summaryData.averageOrderValue || 0}
              precision={2}
              prefix={<PayCircleOutlined />}
              suffix={
                <div className="trend">
                  {summaryData.aovGrowth > 0 ? (
                    <>
                      <ArrowUpOutlined />
                      <span className="positive">{summaryData.aovGrowth || 0}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownOutlined />
                      <span className="negative">
                        {Math.abs(summaryData.aovGrowth || 0)}%
                      </span>
                    </>
                  )}
                </div>
              }
              loading={loading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="summary-card">
            <Statistic
              title={
                <Space>
                  <span>退款金额</span>
                  <Tooltip title="所选时间段内的退款总额">
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              value={summaryData.totalRefunds || 0}
              precision={2}
              prefix={<CreditCardOutlined />}
              valueStyle={{ color: '#cf1322' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="revenue">
        <TabPane tab="收入趋势" key="revenue">
          <Card className="chart-card">
            <div className="chart-title">
              <Title level={5}>{periodType === 'daily' ? '日' : periodType === 'weekly' ? '周' : '月'}收入趋势</Title>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip formatter={(value) => `¥${value}`} />
                <Legend />
                <Line
                  name="收入"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1890ff"
                  activeDot={{ r: 8 }}
                />
                <Line
                  name="订单数"
                  type="monotone"
                  dataKey="orders"
                  stroke="#52c41a"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="收入分布" key="distribution">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card className="chart-card">
                <div className="chart-title">
                  <Title level={5}>收入分类占比</Title>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(value) => `¥${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card className="chart-card">
                <div className="chart-title">
                  <Title level={5}>收入分类详情</Title>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={categoryData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip formatter={(value) => `¥${value}`} />
                    <Legend />
                    <Bar name="收入" dataKey="value" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="交易记录" key="transactions">
          <Card className="table-card">
            <Table
              columns={transactionColumns}
              dataSource={transactions}
              rowKey="transactionId"
              pagination={{
                pageSize: 10,
                showSizeChanger: false,
                showTotal: (total: number) => `共 ${total} 条记录`,
              }}
              loading={loading}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default FinancialOverview;
