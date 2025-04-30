import React, { useState, useRef } from 'react';
import { Card, Button, Tag, Space, Dropdown, Menu, message, Modal, Tooltip, Badge } from 'antd';
import {
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  PrinterOutlined,
  ExportOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { history, Link } from 'umi';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import './OrderList.less';

// 订单状态类型
type OrderStatus = 'pending' | 'paid' | 'confirmed' | 'shooting' | 'processing' | 'completed' | 'cancelled';

// 订单状态映射
const orderStatusMap: Record<OrderStatus, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待支付' },
  paid: { color: 'green', text: '已支付' },
  confirmed: { color: 'blue', text: '已确认' },
  shooting: { color: 'purple', text: '拍摄中' },
  processing: { color: 'cyan', text: '后期制作中' },
  completed: { color: 'geekblue', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' },
};

// 支付状态映射
const paymentStatusMap = {
  unpaid: { color: 'red', text: '未支付' },
  partial: { color: 'orange', text: '部分支付' },
  paid: { color: 'green', text: '已支付' },
  refunded: { color: 'volcano', text: '已退款' },
};

// 订单类型
interface Order {
  id: number;
  orderNo: string;
  customerName: string;
  phone: string;
  packageName: string;
  status: OrderStatus;
  paymentStatus: string;
  amount: number;
  paidAmount: number;
  createTime: string;
  appointmentTime: string | null;
  photographer: string | null;
  location: string | null;
}

const OrderList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<Order[]>([]);
  //const history = useHistory();

  // 导出订单
  const handleExport = () => {
    message.success('正在导出订单数据');
    // 实际项目中这里应该调用API导出订单数据
  };

  // 处理批量操作
  const handleBatchOperation = (operation: string) => {
    if (selectedRows.length === 0) {
      message.warning('请先选择订单');
      return;
    }
    
    switch (operation) {
      case 'print':
        message.info(`正在准备打印 ${selectedRows.length} 个订单`);
        break;
      case 'export':
        message.info(`正在导出 ${selectedRows.length} 个订单`);
        break;
      default:
        break;
    }
  };

  // 表格列定义
  const columns: ProColumns<Order>[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      copyable: true,
      render: (text, record) => (
        <Link to={`/order/detail/${record.id}`} className="order-no">
          {text}
        </Link>
      ),
    },
    {
      title: '客户信息',
      dataIndex: 'customerName',
      search: true,
      render: (_, record) => (
        <div className="customer-info">
          <div className="customer-name">{record.customerName}</div>
          <div className="customer-phone">{record.phone}</div>
        </div>
      ),
    },
    {
      title: '套餐名称',
      dataIndex: 'packageName',
      search: true,
      render: (text) => (
        <span className="package-name">{text}</span>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      valueEnum: Object.fromEntries(
        Object.entries(orderStatusMap).map(([key, { text }]) => [key, { text }])
      ),
      render: (_, record) => (
        <Tag color={orderStatusMap[record.status].color}>
          {orderStatusMap[record.status].text}
        </Tag>
      ),
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      valueEnum: Object.fromEntries(
        Object.entries(paymentStatusMap).map(([key, { text }]) => [key, { text }])
      ),
      render: (_, record) => (
        <Tag color={paymentStatusMap[record.paymentStatus as keyof typeof paymentStatusMap].color}>
          {paymentStatusMap[record.paymentStatus as keyof typeof paymentStatusMap].text}
        </Tag>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      sorter: true,
      render: (text, record) => (
        <div className="order-amount">
          <div className="total-amount">¥{text}</div>
          {record.paymentStatus === 'partial' && (
            <div className="paid-amount">已付: ¥{record.paidAmount}</div>
          )}
        </div>
      ),
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      valueType: 'dateTime',
      render: (text) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="view" onClick={() => history.push(`/order/detail/${record.id}`)}>
          <EyeOutlined /> 查看
        </a>,
        <Dropdown
          key="more"
          overlay={
            <Menu
              items={[
                {
                  key: 'print',
                  icon: <PrinterOutlined />,
                  label: '打印订单',
                  onClick: () => message.info(`正在打印订单: ${record.orderNo}`),
                },
                // 根据订单状态动态显示其他可用操作
                record.status === 'pending' && {
                  key: 'remind',
                  icon: <BellOutlined />,
                  label: '支付提醒',
                  onClick: () => message.info(`已发送支付提醒给 ${record.customerName}`),
                },
                record.status === 'paid' && {
                  key: 'confirm',
                  icon: <CheckOutlined />,
                  label: '确认订单',
                  onClick: () => message.info(`已确认订单: ${record.orderNo}`),
                },
                record.status !== 'cancelled' && record.status !== 'completed' && {
                  key: 'cancel',
                  icon: <CloseOutlined />,
                  danger: true,
                  label: '取消订单',
                  onClick: () => showCancelOrderModal(record),
                },
              ].filter(Boolean)}
            />
          }
          trigger={['click']}
        >
          <a onClick={e => e.preventDefault()}>
            <MoreOutlined /> 更多
          </a>
        </Dropdown>,
      ],
    },
  ];

  // 模拟获取订单数据
  const fetchOrderData = async () => {
    // 此处为模拟数据，实际项目中应该通过API获取
    const mockOrders: Order[] = [
      {
        id: 1,
        orderNo: 'ORD20230501001',
        customerName: '张三',
        phone: '13800138000',
        packageName: '婚纱摄影基础套餐',
        status: 'completed',
        paymentStatus: 'paid',
        amount: 3999,
        paidAmount: 3999,
        createTime: '2023-05-01 10:30:00',
        appointmentTime: '2023-05-15 09:00:00',
        photographer: '李摄影',
        location: '阳光工作室',
      },
      {
        id: 2,
        orderNo: 'ORD20230502002',
        customerName: '李四',
        phone: '13900139000',
        packageName: '全家福高级套餐',
        status: 'paid',
        paymentStatus: 'paid',
        amount: 2499,
        paidAmount: 2499,
        createTime: '2023-05-02 15:45:00',
        appointmentTime: '2023-05-20 14:00:00',
        photographer: '王摄影',
        location: '海景工作室',
      },
      {
        id: 3,
        orderNo: 'ORD20230503003',
        customerName: '王五',
        phone: '13700137000',
        packageName: '儿童摄影套餐',
        status: 'pending',
        paymentStatus: 'unpaid',
        amount: 1299,
        paidAmount: 0,
        createTime: '2023-05-03 09:15:00',
        appointmentTime: null,
        photographer: null,
        location: null,
      },
    ];
    
    return {
      data: mockOrders,
      success: true,
      total: mockOrders.length,
    };
  };

  // 取消订单模态框
  const showCancelOrderModal = (order: Order) => {
    Modal.confirm({
      title: '确认取消订单',
      content: `您确定要取消订单 ${order.orderNo} 吗？`,
      okText: '确认取消',
      cancelText: '返回',
      onOk: () => {
        // 实际项目中这里应该调用API取消订单
        message.success(`已取消订单: ${order.orderNo}`);
        actionRef.current?.reload();
      },
    });
  };

  return (
    <div className="order-list-page">
      <Card>
        <ProTable<Order>
          headerTitle="订单管理"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              key="export"
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出订单
            </Button>,
            <Dropdown
              key="batch"
              overlay={
                <Menu
                  items={[
                    {
                      key: 'batchPrint',
                      icon: <PrinterOutlined />,
                      label: '批量打印',
                      onClick: () => handleBatchOperation('print'),
                    },
                    {
                      key: 'batchExport',
                      icon: <ExportOutlined />,
                      label: '批量导出',
                      onClick: () => handleBatchOperation('export'),
                    },
                  ]}
                />
              }
              disabled={selectedRows.length === 0}
            >
              <Button>
                <Space>
                  批量操作
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
          ]}
          request={fetchOrderData}
          columns={columns}
          rowSelection={{
            onChange: (_: React.Key[], selectedRows: Order[]) => {
              setSelectedRows(selectedRows);
            },
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};

// 临时导入组件，实际项目中应该从正确位置导入
import { BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default OrderList;
