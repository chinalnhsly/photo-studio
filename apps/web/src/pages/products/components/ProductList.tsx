import { useState } from 'react';
import { Table, Button, message, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Product } from '@prisma/client';
import { api } from '@/services/api';
import EditForm from './EditForm';

const ProductList = () => {
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? '已上架' : '已下架'}
        </Tag>
      ),
    }
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setVisible(true)}
        style={{ marginBottom: 16 }}
      >
        新增商品
      </Button>

      <Table 
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
      />

      <EditForm 
        visible={visible}
        onCancel={() => setVisible(false)}
        onSuccess={() => {
          setVisible(false);
          // refresh list
        }}
      />
    </div>
  );
};

export default ProductList;
