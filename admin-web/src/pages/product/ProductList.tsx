import React, { useState, useRef } from 'react';
import { history } from 'umi';
import {
  Card,
  Button,
  Tag,
  Space,
  Image,
  Switch,
  Popconfirm,
  message,
  Badge,
  Typography,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
  FileImageOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { 
  getProducts, 
  deleteProduct, 
  updateProductStatus,
  duplicateProduct
} from '../../services/product';
import './ProductList.scss';

const { Text } = Typography;

// 添加产品类型的类型定义
type ProductTypeKey = 'package' | 'single' | 'service' | 'addon';

// 产品类型标签配置
const productTypeConfig = {
  'package': { color: 'blue', text: '套餐' },
  'single': { color: 'green', text: '单品' },
  'service': { color: 'purple', text: '服务' },
  'addon': { color: 'orange', text: '附加项' },
};

const ProductList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 查看产品详情
  const handleViewProduct = (id: number) => {
    history.push(`/product/detail/${id}`);
  };

  // 编辑产品
  const handleEditProduct = (id: number) => {
    history.push(`/product/edit/${id}`);
  };

  // 创建新产品
  const handleCreateProduct = () => {
    history.push('/product/create');
  };

  // 更新产品状态
  const handleStatusChange = async (id: number, isActive: boolean) => {
    try {
      await updateProductStatus(id, isActive);
      message.success(`产品已${isActive ? '上架' : '下架'}`);
      actionRef.current?.reload();
    } catch (error) {
      console.error('更新产品状态失败:', error);
      message.error('更新状态失败');
    }
  };

  // 删除产品
  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      message.success('产品删除成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('删除产品失败:', error);
      message.error('删除失败，该产品可能已关联订单');
    }
  };

  // 复制产品
  const handleDuplicateProduct = async (id: number) => {
    try {
      await duplicateProduct(id);
      message.success('产品复制成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('复制产品失败:', error);
      message.error('复制产品失败');
    }
  };

  // 渲染产品类型
  const renderProductType = (type: string) => {
    // 产品类型样式映射
    const typeStyles = {
      package: { color: '#1890ff', text: '套餐' },
      single: { color: '#52c41a', text: '单品' },
      service: { color: '#722ed1', text: '服务' },
      addon: { color: '#fa8c16', text: '附加项' },
    };

    // 使用类型断言确保类型安全
    return <Tag color={typeStyles[type as ProductTypeKey]?.color}>{typeStyles[type as ProductTypeKey]?.text}</Tag>;
  };

  // 表格列定义
  const columns: ProColumns<any>[] = [
    {
      title: '产品信息',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="product-info">
          <div className="product-image">
            {record.coverImage ? (
              <Image
                src={record.coverImage}
                alt={record.name}
                width={80}
                height={80}
                className="product-cover"
              />
            ) : (
              <div className="no-image">
                <FileImageOutlined />
              </div>
            )}
          </div>
          <div className="product-meta">
            <a className="product-name" onClick={() => handleViewProduct(record.id)}>
              {record.name}
            </a>
            <div className="product-code">编码: {record.code || '无'}</div>
            <div className="product-tags">
              {renderProductType(record.type)}
              {record.isNew && <Tag color="red">新品</Tag>}
              {record.isHot && <Tag color="volcano">热销</Tag>}
            </div>
          </div>
        </div>
      ),
      search: {
        transform: (value) => ({ name: value }),
      },
    },
    {
      title: '分类',
      dataIndex: ['category', 'name'],
      valueType: 'select',
      request: async () => {
        // 这里应该有一个获取分类列表的请求
        return [
          { label: '婚纱照', value: 'wedding' },
          { label: '儿童照', value: 'children' },
          { label: '写真', value: 'portrait' },
          { label: '全家福', value: 'family' },
          { label: '孕妇照', value: 'maternity' },
        ];
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      sorter: true,
      search: false,
      render: (text, record) => (
        <div className="product-price">
          <Text strong style={{ color: '#f50' }}>¥{Number(text).toFixed(2)}</Text>
          {record.originalPrice && record.originalPrice > record.price && (
            <Text delete className="original-price">
              ¥{Number(record.originalPrice).toFixed(2)}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      sorter: true,
      search: false,
      render: (text) => (
        <div className="sales-count">
          <ShoppingOutlined /> {text || 0}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: {
        true: { text: '已上架', status: 'Success' },
        false: { text: '已下架', status: 'Error' },
      },
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked: boolean) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      defaultSortOrder: 'descend',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEditProduct(record.id)}
        >
          编辑
        </Button>,
        <Button
          key="duplicate"
          type="link"
          size="small"
          icon={<CopyOutlined />}
          onClick={() => handleDuplicateProduct(record.id)}
        >
          复制
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除此产品吗?"
          description="删除后无法恢复，已关联的订单数据将保留"
          onConfirm={() => handleDeleteProduct(record.id)}
          okText="确定"
          cancelText="取消"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div className="product-list-page">
      <ProTable
        headerTitle="产品列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={handleCreateProduct}
            icon={<PlusOutlined />}
          >
            添加产品
          </Button>,
        ]}
        request={async (params = {}, sort, filter) => {
          const sortField = Object.keys(sort)[0];
          const sortOrder = sortField ? sort[sortField] : undefined;
          
          const response = await getProducts({
            page: params.current,
            limit: params.pageSize,
            name: params.name,
            categoryId: params['category.name'],
            isActive: params.isActive,
            sortField,
            sortOrder,
          });
          
          return {
            data: response.data.items,
            success: true,
            total: response.data.meta.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys: React.Key[]) => setSelectedRowKeys(selectedRowKeys),
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space>
            <span>已选 {selectedRowKeys.length} 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        tableAlertOptionRender={() => (
          <Space>
            <Popconfirm
              title={`确定要批量下架选中的 ${selectedRowKeys.length} 个产品吗?`}
              onConfirm={async () => {
                try {
                  // 批量操作的API请求
                  message.success(`已批量下架 ${selectedRowKeys.length} 个产品`);
                  setSelectedRowKeys([]);
                  actionRef.current?.reload();
                } catch (error) {
                  message.error('批量操作失败');
                }
              }}
            >
              <Button size="small">批量下架</Button>
            </Popconfirm>
            <Popconfirm
              title={`确定要批量删除选中的 ${selectedRowKeys.length} 个产品吗?`}
              description="删除后无法恢复"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={async () => {
                try {
                  // 批量删除的API请求
                  message.success(`已删除 ${selectedRowKeys.length} 个产品`);
                  setSelectedRowKeys([]);
                  actionRef.current?.reload();
                } catch (error) {
                  message.error('批量删除失败');
                }
              }}
            >
              <Button size="small" danger>批量删除</Button>
            </Popconfirm>
          </Space>
        )}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default ProductList;
