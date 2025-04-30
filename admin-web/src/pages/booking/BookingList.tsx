import React, { useState, useRef } from 'react';
import { 
  Card, 
  Button, 
  Tag, 
  Space, 
  Menu, 
  Dropdown, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message, 
  Popconfirm, 
  Badge 
} from 'antd';
import { 
  DownOutlined, 
  PlusOutlined, 
  EllipsisOutlined, 
  ExclamationCircleOutlined,
  CalendarOutlined, 
  UserOutlined, 
  PhoneOutlined,
  CameraOutlined,
  EnvironmentOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useRequest, history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import type { SortOrder } from 'antd/es/table/interface';
import { getBookingList, cancelBooking, updateBookingStatus } from '@/services/booking';
import moment from 'moment';
import styles from './BookingList.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

// 定义预约类型
interface BookingItem {
  id: number;
  customerName: string;
  customerPhone: string;
  studioName: string;
  photographerName: string;
  status: string;
  bookingTime: string;
  createdAt: string;
  packageName: string;
  totalPrice: number;
  paymentStatus: string;
  notes?: string;
}

// 定义表单值类型
interface BookingFormValues {
  bookingTime: moment.Moment;
  [key: string]: any;
}

// 定义请求参数类型
interface BookingListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  dateRange?: [string, string];
  [key: string]: any;
}

const BookingList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<BookingItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  // 获取预约列表
  const fetchBookingList = async (
    params: BookingListParams,
    sorter: Record<string, SortOrder>,
    filter: Record<string, any>
  ) => {
    // 处理日期范围
    const { dateRange, ...restParams } = params;
    const queryParams = {
      ...restParams,
      sorter: Object.keys(sorter).length ? `${Object.keys(sorter)[0]},${Object.values(sorter)[0]}` : undefined,
      filter,
      startDate: dateRange && dateRange[0] ? dateRange[0] : undefined,
      endDate: dateRange && dateRange[1] ? dateRange[1] : undefined,
    };

    const response = await getBookingList(queryParams);
    
    return {
      data: response.data || [],
      success: response.success,
      total: response.total || 0,
    };
  };

  // 处理查看预约详情
  const handleViewBooking = (record: BookingItem) => {
    setCurrentBooking(record);
    setModalMode('view');
    setVisible(true);
  };

  // 处理编辑预约
  const handleEditBooking = (record: BookingItem) => {
    setCurrentBooking(record);
    setModalMode('edit');
    form.setFieldsValue({
      ...record,
      bookingTime: moment(record.bookingTime),
    });
    setVisible(true);
  };

  // 处理取消预约
  const handleCancelBooking = async (id: number) => {
    try {
      await cancelBooking(id, '管理员取消');
      message.success('预约已取消');
      actionRef.current?.reload();
    } catch (error) {
      message.error('取消预约失败');
    }
  };

  // 处理更改预约状态
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateBookingStatus(id, { status });
      message.success(`预约状态已更新为: ${status}`);
      actionRef.current?.reload();
    } catch (error) {
      message.error('更新预约状态失败');
    }
  };

  // 处理批量操作
  const handleBatchOperation = (operation: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条预约记录');
      return;
    }

    if (operation === 'cancel') {
      confirm({
        title: '确认取消所选预约?',
        icon: <ExclamationCircleOutlined />,
        content: '取消后将会通知相关客户和摄影师',
        onOk: async () => {
          try {
            // 实际中应该调用批量取消API
            await Promise.all(selectedRowKeys.map(id => cancelBooking(Number(id), '批量取消')));
            message.success('所选预约已取消');
            setSelectedRowKeys([]);
            actionRef.current?.reload();
          } catch (error) {
            message.error('批量取消预约失败');
          }
        },
      });
    }
  };

  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      pending: { color: 'blue', text: '待确认' },
      confirmed: { color: 'green', text: '已确认' },
      completed: { color: 'cyan', text: '已完成' },
      cancelled: { color: 'red', text: '已取消' },
      rescheduled: { color: 'orange', text: '已改期' },
      noShow: { color: 'magenta', text: '未到' },
    };

    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染支付状态标签
  const renderPaymentTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      paid: { color: 'green', text: '已支付' },
      unpaid: { color: 'red', text: '未支付' },
      partial: { color: 'orange', text: '部分支付' },
      refunded: { color: 'gray', text: '已退款' },
    };

    const { color, text } = statusMap[status] || { color: 'default', text: status };
    return <Tag color={color}>{text}</Tag>;
  };

  // 操作菜单
  const getActionMenu = (record: BookingItem) => ({
    items: [
      {
        key: 'view',
        label: '查看详情',
        onClick: () => handleViewBooking(record),
      },
      {
        key: 'edit',
        label: '编辑预约',
        onClick: () => handleEditBooking(record),
        disabled: ['completed', 'cancelled'].includes(record.status),
      },
      {
        key: 'confirm',
        label: '确认预约',
        onClick: () => handleStatusChange(record.id, 'confirmed'),
        disabled: record.status !== 'pending',
      },
      {
        key: 'complete',
        label: '标记为已完成',
        onClick: () => handleStatusChange(record.id, 'completed'),
        disabled: record.status !== 'confirmed',
      },
      {
        key: 'cancel',
        label: '取消预约',
        danger: true,
        onClick: () => handleCancelBooking(record.id),
        disabled: ['completed', 'cancelled'].includes(record.status),
      },
    ],
  });

  // 表格列配置
  const columns: ProColumns<BookingItem>[] = [
    {
      title: '预约编号',
      dataIndex: 'id',
      copyable: true,
      render: (id) => <a onClick={() => history.push(`/booking/detail/${id}`)}>{`BK${String(id).padStart(5, '0')}`}</a>,
    },
    {
      title: '客户信息',
      dataIndex: 'customerName',
      search: false,
      render: (_, record) => (
        <div>
          <div><UserOutlined /> {record.customerName}</div>
          <div><PhoneOutlined /> {record.customerPhone}</div>
        </div>
      ),
    },
    {
      title: '预约内容',
      dataIndex: 'packageName',
      search: false,
      render: (_, record) => (
        <div>
          <div><CameraOutlined /> {record.packageName}</div>
          <div><EnvironmentOutlined /> {record.studioName}</div>
        </div>
      ),
    },
    {
      title: '摄影师',
      dataIndex: 'photographerName',
      search: false,
    },
    {
      title: '预约时间',
      dataIndex: 'bookingTime',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        pending: { text: '待确认', status: 'Processing' },
        confirmed: { text: '已确认', status: 'Success' },
        completed: { text: '已完成', status: 'Default' },
        cancelled: { text: '已取消', status: 'Error' },
        rescheduled: { text: '已改期', status: 'Warning' },
        noShow: { text: '未到', status: 'Warning' },
      },
      render: (_, record) => renderStatusTag(record.status),
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      search: false,
      render: (status) => renderPaymentTag(status as string),
    },
    {
      title: '总金额',
      dataIndex: 'totalPrice',
      sorter: true,
      search: false,
      render: (price) => `¥${price}`,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <a onClick={() => handleViewBooking(record)}>查看</a>
          <Dropdown menu={getActionMenu(record)}>
            <a onClick={(e) => e.preventDefault()}>
              更多 {React.createElement(DownOutlined)}
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.bookingListPage}>
      <Card>
        <ProTable<BookingItem>
          headerTitle="预约列表"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              key="add"
              type="primary"
              onClick={() => history.push('/booking/create')}
              icon={<PlusOutlined />}
            >
              新建预约
            </Button>,
            selectedRowKeys.length > 0 && (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'cancel',
                      label: '批量取消',
                      onClick: () => handleBatchOperation('cancel'),
                    },
                  ],
                }}
              >
                <Button icon={React.createElement(DownOutlined)}>
                  批量操作
                </Button>
              </Dropdown>
            ),
          ]}
          request={async (params, sort, filter) => {
            return fetchBookingList(
              params as BookingListParams,
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
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>

      {/* 查看/编辑预约详情的模态框 */}
      <Modal
        title={modalMode === 'view' ? '预约详情' : '编辑预约'}
        open={visible}
        onCancel={() => setVisible(false)}
        footer={modalMode === 'view' ? null : undefined}
        confirmLoading={confirmLoading}
        width={720}
      >
        {modalMode === 'view' && currentBooking ? (
          <div className={styles.bookingDetail}>
            {/* 预约详情的展示内容 */}
            <div className={styles.section}>
              <h3>基本信息</h3>
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>预约编号:</span>
                  <span className={styles.value}>{`BK${String(currentBooking.id).padStart(5, '0')}`}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>状态:</span>
                  <span>{renderStatusTag(currentBooking.status)}</span>
                </div>
              </div>
              {/* 更多信息展示 */}
            </div>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={async (values: BookingFormValues) => {
              setConfirmLoading(true);
              try {
                // 在实际项目中这里应该调用API更新预约信息
                await new Promise(resolve => setTimeout(resolve, 1000));
                message.success('预约信息更新成功');
                setVisible(false);
                actionRef.current?.reload();
              } catch (error) {
                message.error('更新预约信息失败');
              } finally {
                setConfirmLoading(false);
              }
            }}
          >
            {/* 表单内容 */}
            <Form.Item
              name="bookingTime"
              label="预约时间"
              rules={[{ required: true, message: '请选择预约时间' }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            {/* 更多表单项 */}
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default BookingList;
