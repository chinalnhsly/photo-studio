import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
}

export const ProductList: React.FC = () => {
  const columns: ColumnsType<Product> = [
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '上架' : '下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const data: Product[] = [
    { id: 1, name: '证件照', price: 50, stock: 999, status: 'active' },
    { id: 2, name: '情侣写真', price: 299, stock: 50, status: 'active' },
    { id: 3, name: '婚纱摄影', price: 3999, stock: 10, status: 'active' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary">添加产品</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id"
      />
    </div>
  );
};
