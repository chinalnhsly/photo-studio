import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCategories } from '@/hooks/useCategories';
import { api } from '@/services/api';

// 分类接口类型
interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
  };
}

const CategoryManage = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { data, loading: tableLoading, refresh } = useCategories();
  
  // 只在Modal显示时创建form实例
  const [form] = Form.useForm();

  // 确保 dataSource 始终是数组
  const dataSource = Array.isArray(data) ? data : [];

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '商品数量',
      key: 'productCount',
      render: (_, record: Category) => record._count?.products || 0,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record: Category) => (
        <Space>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除该分类?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={record._count?.products > 0}
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              disabled={record._count?.products > 0}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  // 处理编辑
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    
    // 设置表单值的时机移到Modal打开后
    setVisible(true);
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      message.success('分类删除成功');
      refresh();
    } catch (error: any) {
      message.error(`删除失败: ${error.response?.data?.message || error.message}`);
    }
  };

  // 打开新增表单
  const handleAdd = () => {
    setEditingCategory(null);
    setVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: { name: string; description?: string }) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name?.trim(),
        description: values.description?.trim() || null
      };

      console.log('提交数据:', payload);
      
      let response;
      if (editingCategory) {
        // 更新分类
        response = await api.patch(`/categories/${editingCategory.id}`, payload);
        message.success('分类更新成功');
      } else {
        // 创建分类
        response = await api.post('/categories', payload);
        message.success('分类创建成功');
      }
      
      setVisible(false);
      form.resetFields();
      refresh();
    } catch (error: any) {
      console.error('操作失败:', error);
      const errorMsg = error.response?.data?.message || error.message;
      message.error(`${editingCategory ? '更新' : '创建'}失败: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Modal关闭时的处理
  const handleCancel = () => {
    setVisible(false);
    // 确保表单重置
    form.resetFields();
  };

  // Modal打开后设置表单初始值
  const afterModalOpen = () => {
    if (editingCategory) {
      form.setFieldsValue({
        name: editingCategory.name,
        description: editingCategory.description || ''
      });
    } else {
      form.resetFields();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          新增分类
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        loading={tableLoading}
        rowKey="id"
        pagination={false}
        bordered
      />

      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={visible}
        onCancel={handleCancel}
        afterOpenChange={(open) => open && afterModalOpen()}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          preserve={false}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea rows={4} placeholder="请输入分类描述" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCategory ? '更新' : '保存'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManage;
