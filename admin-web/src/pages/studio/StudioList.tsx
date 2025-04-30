import React, { useState, useRef } from 'react';
import {
  Card,
  Button,
  Popconfirm,
  message,
  Tag,
  Image,
  Switch,
  Space,
  Input,
  Modal,
  Form,
  Select,
  Upload,
  InputNumber,
  TimePicker
} from 'antd';
import type { SortOrder } from 'antd/es/table/interface';
import { 
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  FieldTimeOutlined
} from '@ant-design/icons';
import { useRequest, history } from 'umi';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { getStudioList, updateStudio, deleteStudio } from '@/services/studio';
import styles from './StudioList.less';

const { Option } = Select;

// 定义工作室类型接口
interface StudioItem {
  id: number;
  name: string;
  address: string;
  phone: string;
  manager: string;
  managerPhone: string;
  area: number;
  maxCapacity: number;
  openingHours: string;
  features: string[];
  totalBookings: number;
  status: 'active' | 'maintenance';
  imageUrl?: string;
}

// 定义请求参数类型
interface StudioListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

const StudioList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentStudio, setCurrentStudio] = useState<StudioItem | null>(null);

  // 获取工作室列表
  const fetchStudioList = async (
    params: StudioListParams,
    sorter: Record<string, SortOrder>,
    filter: Record<string, any>
  ) => {
    const response = await getStudioList({
      ...params,
      sorter: Object.keys(sorter).length ? `${Object.keys(sorter)[0]},${Object.values(sorter)[0]}` : undefined,
      filter,
    });
    
    return {
      data: response.data,
      success: response.success,
      total: response.total,
    };
  };

  // 处理删除工作室
  const handleDelete = async (id: number) => {
    try {
      await deleteStudio(id);
      message.success('工作室删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除工作室失败');
    }
  };

  // 处理修改工作室状态
  const handleStatusChange = async (id: number, checked: boolean) => {
    try {
      await updateStudio(id, { status: checked ? 'active' : 'maintenance' });
      message.success(`工作室已${checked ? '启用' : '设为维护中'}`);
      actionRef.current?.reload();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 处理批量删除
  const handleBatchDelete = async () => {
    Modal.confirm({
      title: '确认删除所选工作室吗？',
      icon: <ExclamationCircleOutlined />,
      content: '删除后无法恢复，请谨慎操作',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 实际应用中应该调用批量删除API
          const deletePromises = selectedRowKeys.map(id => deleteStudio(Number(id)));
          await Promise.all(deletePromises);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  // 打开编辑/创建模态框
  const showModal = (type: 'create' | 'edit', record?: StudioItem) => {
    setModalType(type);
    setVisible(true);
    if (type === 'edit' && record) {
      setCurrentStudio(record);
      form.setFieldsValue({
        name: record.name,
        address: record.address,
        phone: record.phone,
        manager: record.manager,
        managerPhone: record.managerPhone,
        area: record.area,
        maxCapacity: record.maxCapacity,
        openingHours: record.openingHours,
        features: record.features,
        status: record.status === 'active',
      });
    } else {
      setCurrentStudio(null);
      form.resetFields();
      form.setFieldsValue({
        status: true,
      });
    }
  };

  // 处理模态框提交
  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      
      // 在实际应用中应调用创建或更新API
      // 这里只是模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(modalType === 'create' ? '工作室创建成功' : '工作室更新成功');
      setVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('表单验证或提交失败:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // 表格列定义
  const columns: ProColumns<StudioItem>[] = [
    {
      title: '工作室',
      dataIndex: 'name',
      render: (_, record) => (
        <div className={styles.studioInfo}>
          <div className={styles.studioImage}>
            {record.imageUrl ? (
              <Image
                src={record.imageUrl}
                alt={record.name}
                width={80}
                height={60}
              />
            ) : (
              <div className={styles.noImage}>无图片</div>
            )}
          </div>
          <div className={styles.studioMeta}>
            <div className={styles.studioName}>
              <a onClick={() => history.push(`/studio/detail/${record.id}`)}>
                {record.name}
              </a>
            </div>
            <div className={styles.studioAddress}>
              <EnvironmentOutlined /> {record.address}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      search: false,
      render: (_, record) => (
        <div className={styles.contactInfo}>
          <div>
            <PhoneOutlined /> {record.phone}
          </div>
          <div>
            <UserOutlined /> {record.manager} ({record.managerPhone})
          </div>
        </div>
      ),
    },
    {
      title: '营业时间',
      dataIndex: 'openingHours',
      search: false,
      render: (openingHours) => (
        <Tag icon={<FieldTimeOutlined />}>{openingHours}</Tag>
      ),
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      search: false,
      sorter: true,
    },
    {
      title: '设施特色',
      dataIndex: 'features',
      search: false,
      render: (_, record) => (
        <div className={styles.features}>
          {record.features.map((feature, index) => (
            <Tag key={index}>{feature}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: '预约数',
      dataIndex: 'totalBookings',
      search: false,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      filterMultiple: false,
      valueEnum: {
        active: { text: '正常营业', status: 'Success' },
        maintenance: { text: '维护中', status: 'Error' },
      },
      render: (_, record) => (
        <Switch
          checked={record.status === 'active'}
          onChange={(checked: boolean) => handleStatusChange(record.id, checked)}
          checkedChildren="营业"
          unCheckedChildren="维护"
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => showModal('edit', record)}>
            <EditOutlined /> 编辑
          </a>
          <Popconfirm
            title="确定要删除这个工作室吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a className={styles.deleteLink}>
              <DeleteOutlined /> 删除
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.studioListPage}>
      <Card>
        <ProTable<StudioItem>
          headerTitle="工作室列表"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              onClick={() => showModal('create')}
              icon={<PlusOutlined />}
            >
              新增工作室
            </Button>,
            selectedRowKeys.length > 0 && (
              <Button
                key="batchDelete"
                danger
                onClick={handleBatchDelete}
                icon={<DeleteOutlined />}
              >
                批量删除
              </Button>
            ),
          ]}
          request={async (params, sort, filter) => {
            return fetchStudioList(
              params as StudioListParams,
              sort as Record<string, SortOrder>,
              filter
            );
          }}
          columns={columns}
          rowSelection={{
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(selectedRowKeys);
            },
            selectedRowKeys,
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>

      {/* 创建/编辑工作室模态框 */}
      <Modal
        title={modalType === 'create' ? '新增工作室' : '编辑工作室'}
        visible={visible}
        onOk={handleModalSubmit}
        onCancel={() => setVisible(false)}
        confirmLoading={confirmLoading}
        width={720}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: true,
          }}
        >
          <Form.Item
            name="name"
            label="工作室名称"
            rules={[{ required: true, message: '请输入工作室名称' }]}
          >
            <Input placeholder="请输入工作室名称" />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="工作室地址"
            rules={[{ required: true, message: '请输入工作室地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="manager"
              label="负责人"
              rules={[{ required: true, message: '请输入负责人姓名' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
            
            <Form.Item
              name="managerPhone"
              label="负责人电话"
              rules={[{ required: true, message: '请输入负责人电话' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="请输入负责人电话" />
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="area"
              label="面积(㎡)"
              rules={[{ required: true, message: '请输入工作室面积' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="工作室面积" />
            </Form.Item>
            
            <Form.Item
              name="maxCapacity"
              label="最大容纳人数"
              rules={[{ required: true, message: '请输入最大容纳人数' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="最大容纳人数" />
            </Form.Item>
          </div>
          
          <Form.Item
            name="openingHours"
            label="营业时间"
            rules={[{ required: true, message: '请输入营业时间' }]}
          >
            <Input placeholder="例如：9:00-21:00" />
          </Form.Item>
          
          <Form.Item
            name="features"
            label="设施特色"
            rules={[{ required: true, message: '请选择设施特色' }]}
          >
            <Select mode="tags" placeholder="请输入或选择设施特色">
              <Option value="自然光">自然光</Option>
              <Option value="大型摄影棚">大型摄影棚</Option>
              <Option value="化妆间">化妆间</Option>
              <Option value="黑白暗房">黑白暗房</Option>
              <Option value="专业闪光灯组">专业闪光灯组</Option>
              <Option value="多场景布置">多场景布置</Option>
              <Option value="水下摄影">水下摄影</Option>
              <Option value="360度旋转台">360度旋转台</Option>
              <Option value="高端化妆室">高端化妆室</Option>
              <Option value="复古场景">复古场景</Option>
              <Option value="婚纱展示区">婚纱展示区</Option>
              <Option value="休息室">休息室</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="image"
            label="工作室图片"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="工作室状态"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="营业"
              unCheckedChildren="维护"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudioList;
