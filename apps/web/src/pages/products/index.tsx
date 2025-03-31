import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, message, Tag, Empty, Spin, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, SyncOutlined, ReloadOutlined } from '@ant-design/icons';
import { api } from '@/services/api';
import EditForm from './components/EditForm';
import { useCategories } from '@/hooks/useCategories';

// 商品接口类型
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;  // 添加库存字段
  description?: string;
  isActive: boolean;
  category?: {
    id: number;
    name: string;
  };
  categoryId: number;
}

const ProductList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Product | null>(null);
  
  const { data: categories = [] } = useCategories();

  // 添加页面版本状态
  const [version, setVersion] = useState(Date.now());
  
  // 强制刷新整个页面组件
  const forceRefresh = useCallback(() => {
    console.log('强制刷新组件');
    setVersion(Date.now());
  }, []);

  // 修正表格列定义，使其与要求完全匹配
  const columns: ColumnsType<Product> = [
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '商品分类',
      key: 'category',
      width: 120,
      render: (_, record) => {
        return record.category?.name || '未分类';
      },
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => `¥${Number(price).toFixed(2)}`,
    },
    {
      title: '库存数量',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      render: (stock) => (
        <span style={{ color: stock <= 10 ? '#ff4d4f' : stock <= 50 ? '#faad14' : '#52c41a' }}>
          {stock}
        </span>
      ),
    },
    {
      title: '商品描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '上架状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? '已上架' : '已下架'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  // 尝试两种API路径获取商品数据
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 尝试不同的API路径
      let response;
      try {
        response = await api.get('/products');
      } catch (error) {
        console.log('尝试备用API路径');
        response = await api.get('/api/products');
      }
      
      console.log('API响应:', response);
      
      // 更严格的数据处理
      let productList: Product[] = [];
      
      if (response.data?.data?.items && Array.isArray(response.data.data.items)) {
        productList = response.data.data.items;
      } else if (Array.isArray(response.data?.data)) {
        productList = response.data.data;
      } else if (Array.isArray(response.data)) {
        productList = response.data;
      }
      
      // 确保每个商品都有所有必要的字段
      productList = productList.map(item => ({
        id: item.id,
        name: item.name || '未命名商品',
        price: Number(item.price) || 0,
        stock: Number(item.stock) || 0, // 添加库存映射
        description: item.description || '',
        isActive: typeof item.isActive === 'boolean' ? item.isActive : true,
        categoryId: item.categoryId,
        category: item.category
      }));
      
      console.log('处理后的商品数据:', productList);
      setProducts(productList);
    } catch (error) {
      console.error('获取商品列表失败:', error);
      message.error('获取商品列表失败');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentRecord(null);
    setVisible(true);
  };

  const handleEdit = (record: Product) => {
    setCurrentRecord(record);
    setVisible(true);
  };

  const handleSuccess = () => {
    setVisible(false);
    message.success('操作成功');
    fetchProducts();
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchProducts();
  }, [version]); // 依赖version，当version变化时重新执行

  // 在控制台打印当前数据状态，用于调试
  useEffect(() => {
    console.log('当前商品列表数据:', products);
    console.log('当前分类数据:', categories);
  }, [products, categories]);

  return (
    <div key={`product-list-${version}`}> {/* 添加key强制刷新 */}
      <Alert
        message="商品列表"
        description="显示所有商品信息，包括名称、分类、价格、描述和状态"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增商品
        </Button>
        
        <div>
          <Button
            icon={<SyncOutlined />}
            onClick={fetchProducts}
            style={{ marginRight: 8 }}
          >
            刷新数据
          </Button>
          
          <Button
            icon={<ReloadOutlined />}
            onClick={forceRefresh}
            danger
          >
            强制刷新
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          {/* 修复 Spin 组件的用法，将 tip 放入嵌套结构中 */}
          <Spin>
            <div style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }}>
              <div style={{ marginBottom: '20px' }}>加载中...</div>
              <Alert message="正在获取商品数据" type="info" />
            </div>
          </Spin>
        </div>
      ) : products.length === 0 ? (
        <Empty 
          description="暂无商品数据" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={handleAdd}>添加第一个商品</Button>
        </Empty>
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
          bordered
        />
      )}

      <EditForm
        visible={visible}
        record={currentRecord}
        onCancel={() => setVisible(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

// 使用React.memo包装组件防止不必要的重新渲染
export default React.memo(ProductList);
