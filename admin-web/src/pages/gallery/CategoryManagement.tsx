import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Popconfirm, message, 
  Modal, Form, Input, Tag, Spin, List 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined,
  QuestionCircleOutlined, SortAscendingOutlined,
  ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import './CategoryManagement.less';

interface CategoryItem {
  id: number;
  name: string;
  count: number;
  order: number;
  createdAt: string;
}

// 模拟数据
const mockCategories: CategoryItem[] = [
  {
    id: 1,
    name: '婚纱照',
    count: 128,
    order: 1,
    createdAt: '2023-01-12 10:30:00',
  },
  {
    id: 2,
    name: '写真照',
    count: 89,
    order: 2,
    createdAt: '2023-01-15 09:20:00',
  },
  {
    id: 3,
    name: '儿童照',
    count: 64,
    order: 3,
    createdAt: '2023-02-05 14:10:00',
  },
  {
    id: 4,
    name: '全家福',
    count: 42,
    order: 4,
    createdAt: '2023-02-18 11:45:00',
  },
  {
    id: 5,
    name: '证件照',
    count: 56,
    order: 5,
    createdAt: '2023-03-01 16:30:00',
  },
];

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setCategories([...mockCategories]);
      setLoading(false);
    }, 800);
  };

  const moveItem = (array: any[], oldIndex: number, newIndex: number) => {
    if (newIndex >= array.length || newIndex < 0) {
      return array;
    }
    const newArray = [...array];
    const [movedItem] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, movedItem);
    return newArray;
  };

  const handleSort = (oldIndex: number, newIndex: number) => {
    const newCategories = moveItem([...categories], oldIndex, newIndex)
      .map((item, index) => ({
        ...item,
        order: index + 1
      }));
    setCategories(newCategories);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      handleSort(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < categories.length - 1) {
      handleSort(index, index + 1);
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditCategory = (record: CategoryItem) => {
    setCurrentCategory(record);
    form.setFieldsValue({
      name: record.name,
    });
    setModalVisible(true);
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      // 模拟API请求
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategories = categories.filter(item => item.id !== id);
      setCategories(newCategories);
      message.success('分类删除成功');
    } catch (error) {
      message.error('分类删除失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (currentCategory) {
        // 更新
        const newCategories = categories.map(item => 
          item.id === currentCategory.id 
            ? { ...item, name: values.name }
            : item
        );
        setCategories(newCategories);
        message.success('分类更新成功');
      } else {
        // 新增
        const newCategory: CategoryItem = {
          id: Math.max(...categories.map(item => item.id)) + 1,
          name: values.name,
          count: 0,
          order: categories.length + 1,
          createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
        };
        setCategories([...categories, newCategory]);
        message.success('分类创建成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      // Form validation error
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图片数量',
      dataIndex: 'count',
      key: 'count',
      render: (count: number) => (
        <Tag color="blue">{count} 张</Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CategoryItem) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCategory(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个分类吗？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteCategory(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const SortableList = () => (
    <div className="sortable-list">
      <div className="list-header">
        <div className="col-order">序号</div>
        <div className="col-name">分类名称</div>
        <div className="col-count">图片数量</div>
        <div className="col-action">操作</div>
      </div>
      <List
        dataSource={categories}
        renderItem={(item: { order: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; count: any; }, index: number) => (
          <List.Item className="sortable-item">
            <div className="col-order">{item.order}</div>
            <div className="col-name">{item.name}</div>
            <div className="col-count">
              <Tag color="blue">{item.count} 张</Tag>
            </div>
            <div className="col-action">
              <Space>
                <Button
                  type="text"
                  icon={<ArrowUpOutlined />}
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                />
                <Button
                  type="text"
                  icon={<ArrowDownOutlined />}
                  disabled={index === categories.length - 1}
                  onClick={() => handleMoveDown(index)}
                />
              </Space>
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <div className="category-management-page">
      <Card
        title="图片分类管理"
        extra={
          <Space>
            <Button
              type={sortMode ? 'primary' : 'default'}
              icon={<SortAscendingOutlined />}
              onClick={() => setSortMode(!sortMode)}
            >
              {sortMode ? '完成排序' : '排序模式'}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCategory}
            >
              新增分类
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          {!sortMode ? (
            <Table
              dataSource={categories}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          ) : (
            <SortableList />
          )}
        </Spin>
      </Card>

      <Modal
        title={currentCategory ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSaveCategory}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
