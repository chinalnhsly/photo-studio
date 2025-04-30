import React, { useState, useEffect } from 'react';
import { 
  Card, Table, Button, Space, Tag, Input, Modal, 
  message, Dropdown, Menu, Tooltip, Select, Form
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, MoreOutlined, UserOutlined, 
  ExportOutlined, ImportOutlined, TagOutlined
} from '@ant-design/icons';
import {
  getCustomerList,
  deleteCustomer,
  searchCustomers,
  exportCustomers,
  addCustomerTags,
  removeCustomerTags
} from '../../services/customer';
import { history } from '../../utils/compatibility';
import './CustomerList.less';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tagModalVisible, setTagModalVisible] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [tagForm] = Form.useForm();
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  // 获取客户列表
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getCustomerList({});
      setCustomers(response.data?.items || []);
    } catch (error) {
      message.error('获取客户列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 搜索客户
  const handleSearch = async (value: string) => {
    if (!value) {
      fetchCustomers();
      return;
    }
    
    try {
      setLoading(true);
      const response = await searchCustomers({ keyword: value });
      setCustomers(response.data?.items || []);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 删除客户
  const handleDelete = (id: string) => {
    confirm({
      title: '确认删除该客户?',
      content: '删除后将无法恢复，该客户的所有相关信息也会被删除。',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCustomer(Number(id));
          message.success('删除成功');
          fetchCustomers();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };
  
  // 导出客户数据
  const handleExport = async () => {
    try {
      await exportCustomers();
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };
  
  // 打开标签管理模态框
  const handleTagsManage = (record: any) => {
    setSelectedCustomer(record);
    tagForm.setFieldsValue({
      tags: record.tags?.map((tag: string) => tag.trim()) || [],
    });
    setTagModalVisible(true);
  };
  
  // 提交标签修改
  const handleTagsSubmit = async () => {
    try {
      const values = await tagForm.validateFields();
      const customerId = selectedCustomer.id;
      
      // 找出新增的标签和删除的标签
      const currentTags = selectedCustomer.tags || [];
      const newTags = values.tags || [];
      
      const tagsToAdd = newTags.filter((tag: string) => !currentTags.includes(tag));
      const tagsToRemove = currentTags.filter((tag: string) => !newTags.includes(tag));
      
      if (tagsToAdd.length > 0) {
        await addCustomerTags(customerId, tagsToAdd);
      }
      
      if (tagsToRemove.length > 0) {
        await removeCustomerTags(customerId, tagsToRemove);
      }
      
      message.success('标签更新成功');
      setTagModalVisible(false);
      fetchCustomers();
    } catch (error) {
      message.error('标签更新失败');
    }
  };
  
  // 列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <a onClick={() => history.push(`/customer/detail/${record.id}`)}>{text}</a>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '消费金额',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (value: number) => `¥${value.toFixed(2)}`,
      sorter: (a: any, b: any) => a.totalSpent - b.totalSpent,
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      sorter: (a: any, b: any) => a.orderCount - b.orderCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a: any, b: any) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[], record: any) => (
        <>
          {(tags || []).map(tag => (
            <Tag key={tag} color="blue">{tag}</Tag>
          ))}
            <Tag 
            className="site-tag-plus" 
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              e.stopPropagation();
              handleTagsManage(record);
            }}
            >
            <PlusOutlined /> 添加
            </Tag>
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: any) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => history.push(`/customer/edit/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
          <Dropdown overlay={
            <Menu>
              <Menu.Item 
                key="tags" 
                icon={<TagOutlined />}
                onClick={() => handleTagsManage(record)}
              >
                管理标签
              </Menu.Item>
              <Menu.Item 
                key="detail" 
                icon={<UserOutlined />}
                onClick={() => history.push(`/customer/detail/${record.id}`)}
              >
                查看详情
              </Menu.Item>
            </Menu>
          }>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="customer-list-page">
      <Card className="customer-list-card">
        <div className="table-operations">
          <Space size="middle">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => history.push('/customer/create')}
            >
              添加客户
            </Button>
            <Button 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出数据
            </Button>
            <Button 
              icon={<ImportOutlined />}
              onClick={() => history.push('/customer/import')}
            >
              导入数据
            </Button>
          </Space>
          <Search 
            placeholder="搜索客户" 
            onSearch={handleSearch} 
            style={{ width: 300 }}
            allowClear
            enterButton
          />
        </div>
        
        <Table 
          columns={columns} 
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total: number) => `共 ${total} 条记录`,
          }}
        />
      </Card>
      
      {/* 标签管理模态框 */}
      <Modal
        title="管理客户标签"
        visible={tagModalVisible}
        onOk={handleTagsSubmit}
        onCancel={() => setTagModalVisible(false)}
        destroyOnClose
      >
        <Form form={tagForm} layout="vertical">
          <Form.Item
            name="tags"
            label="标签"
            help="输入标签名称，按回车添加多个标签"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="请输入标签"
              open={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerList;
