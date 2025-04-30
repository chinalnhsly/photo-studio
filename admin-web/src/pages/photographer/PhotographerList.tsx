import React, { useState, useRef } from 'react';
import {
  Card,
  Button,
  Tag,
  Space,
  message,
  Avatar,
  Switch,
  Popconfirm,
  Modal,
  Input,
  Form,
  Rate,
  Upload,
  Select,
  Tooltip,
  Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  CloudUploadOutlined,
  ExportOutlined,
  ImportOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Link, history } from 'umi';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getPhotographerList, updatePhotographerStatus, deletePhotographer } from '@/services/photographer';
import styles from './PhotographerList.less';

// 定义摄影师列表项接口
interface PhotographerListItem {
  id: number;
  name: string;
  avatar?: string;
  level: string;
  phone: string;
  email: string;
  specialties?: string[];
  rating: number;
  status: 'active' | 'inactive';
  featured?: boolean;
}

const { Option } = Select;

const PhotographerList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [filterForm] = Form.useForm();
  const [importForm] = Form.useForm();

  // 摄影师级别选项
  const levelOptions = [
    { label: '初级摄影师', value: 'junior' },
    { label: '中级摄影师', value: 'intermediate' },
    { label: '高级摄影师', value: 'senior' },
    { label: '资深摄影师', value: 'expert' },
    { label: '首席摄影师', value: 'chief' },
  ];

  // 定义 levelMap 类型和常量
  type LevelKey = 'junior' | 'intermediate' | 'senior' | 'expert' | 'chief';
  const levelMap: Record<LevelKey, { color: string; text: string }> = {
    'junior': { color: '', text: '初级摄影师' },
    'intermediate': { color: 'blue', text: '中级摄影师' },
    'senior': { color: 'purple', text: '高级摄影师' },
    'expert': { color: 'volcano', text: '资深摄影师' },
    'chief': { color: 'gold', text: '首席摄影师' },
  };

  // 格式化级别标签
  const formatLevel = (level: string) => {
    return levelMap[level as LevelKey] || { color: '', text: level };
  };

  // 处理上传状态更改
  const handleStatusChange = async (id: number, checked: boolean) => {
    try {
      await updatePhotographerStatus(id, checked ? 'active' : 'inactive');
      message.success(`摄影师状态已${checked ? '启用' : '禁用'}`);
      actionRef.current?.reload();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 处理删除摄影师
  const handleDelete = async (id: number) => {
    try {
      await deletePhotographer(id);
      message.success('摄影师删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 批量删除摄影师
  const handleBatchDelete = async () => {
    Modal.confirm({
      title: '批量删除',
      content: `确定要删除这 ${selectedRowKeys.length} 位摄影师吗？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 实际应该调用批量删除API
          const deletePromises = selectedRowKeys.map(id => deletePhotographer(Number(id)));
          await Promise.all(deletePromises);
          message.success(`成功删除 ${selectedRowKeys.length} 位摄影师`);
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  // 处理高级筛选
  const handleFilter = (values: Record<string, any>) => {
    actionRef.current?.reload();
    setFilterModalVisible(false);
  };

  // 处理导入摄影师
  const handleImport = (values: Record<string, any>) => {
    message.success('摄影师数据导入成功');
    setImportModalVisible(false);
    importForm.resetFields();
    actionRef.current?.reload();
  };

  // 自定义上传组件
  const customUploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传文件</div>
    </div>
  );

  // 表格列定义
  const columns: ProColumns<PhotographerListItem>[] = [
    {
      title: '摄影师',
      dataIndex: 'name',
      render: (_, record) => (
        <div className={styles.photographerInfo}>
          <Avatar 
            size={40} 
            src={record.avatar} 
            icon={<UserOutlined />}
          />
          <div className={styles.nameSection}>
            <div className={styles.name}>
              <Link to={`/photographer/detail/${record.id}`}>{record.name}</Link>
              {record.featured && (
                <Badge
                  count="推荐"
                  style={{
                    backgroundColor: '#52c41a',
                    marginLeft: 8,
                  }}
                />
              )}
            </div>
            <div className={styles.level}>
              <Tag color={formatLevel(record.level).color}>
                {formatLevel(record.level).text}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '联系信息',
      dataIndex: 'contact',
      search: false,
      render: (_, record) => (
        <div className={styles.contactInfo}>
          <div>{record.phone}</div>
          <div>{record.email}</div>
        </div>
      ),
    },
    {
      title: '专业领域',
      dataIndex: 'specialties',
      search: false,
      render: (_, record) => (
        <div>
          {record.specialties?.map((specialty: string, index: number) => (
            <Tag key={index}>{specialty}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      sorter: true,
      search: false,
      render: (rating) => (
        <span className={styles.rating}>
          <Rate disabled defaultValue={rating} /> 
          <span className={styles.ratingValue}>({rating})</span>
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, record) => (
        <Switch
          checked={record.status === 'active'}
          onChange={(checked: boolean) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Link key="edit" to={`/photographer/edit/${record.id}`}>
          编辑
        </Link>,
        <Popconfirm
          key="delete"
          title="确定要删除该摄影师吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div className={styles.photographerListPage}>
      <Card>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/photographer/add')}
          >
            新增摄影师
          </Button>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterModalVisible(true)}
          >
            筛选
          </Button>
          <Button
            icon={<ImportOutlined />}
            onClick={() => setImportModalVisible(true)}
          >
            导入
          </Button>
          <Button
            icon={<ExportOutlined />}
          >
            导出
          </Button>
        </Space>
        <ProTable<PhotographerListItem>
          headerTitle="摄影师管理"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              key="batchDelete"
              icon={<DeleteOutlined />}
              danger
              disabled={selectedRowKeys.length === 0}
              onClick={handleBatchDelete}
            >
              批量删除
            </Button>,
          ]}
          request={getPhotographerList}
          columns={columns}
          rowSelection={{
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(selectedRowKeys);
            },
            selectedRowKeys,
          }}
        />
      </Card>

      <Modal
        title="高级筛选"
        visible={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        onOk={() => filterForm.submit()}
      >
        <Form
          form={filterForm}
          onFinish={handleFilter}
        >
          <Form.Item
            name="level"
            label="摄影师级别"
          >
            <Select>
              {levelOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="导入摄影师"
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onOk={() => importForm.submit()}
      >
        <Form
          form={importForm}
          onFinish={handleImport}
        >
          <Form.Item
            name="file"
            label="上传文件"
          >
            <Upload
              listType="picture-card"
              showUploadList={false}
            >
              {customUploadButton}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PhotographerList;
