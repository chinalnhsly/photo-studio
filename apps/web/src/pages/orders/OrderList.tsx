import React from 'react';
import { Table, Tag, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createTime: string;
}

export const OrderList: React.FC = () => {
  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'id',
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
    },
    {
      title: '金额',
      dataIndex: 'totalAmount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'gold'}>
          {status === 'completed' ? '已完成' : '处理中'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];

  const data: Order[] = [
    {
      id: 1,
      customerName: '张三',
      totalAmount: 299,
      status: 'completed',
      createTime: '2024-04-05 10:00:00',
    },
    // ...更多订单数据
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" />;
};
