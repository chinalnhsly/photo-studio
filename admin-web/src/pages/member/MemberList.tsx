import React, { useRef, useState } from 'react';
import { history } from 'umi';
import {
  Card,
  Button,
  Tag,
  Space,
  Avatar,
  Badge,
  Switch,
  Popconfirm,
  message,
  Tooltip,
  Progress
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  StarOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  ShoppingOutlined,
  GiftOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ExportOutlined
} from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { 
  getMembers, 
  deleteMember, 
  updateMemberStatus 
} from '../../services/member';
import './MemberList.scss';

const MemberList: React.FC = () => {
  //const history = useHistory();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 处理删除会员
  const handleDelete = async (id: number) => {
    try {
      await deleteMember(id);
      message.success('会员删除成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('删除会员失败:', error);
      message.error('删除失败，该会员可能关联了订单或预约');
    }
  };

  // 处理会员状态变更
  const handleStatusChange = async (id: number, isActive: boolean) => {
    try {
      await updateMemberStatus(id, isActive);
      message.success(`会员已${isActive ? '启用' : '禁用'}`);
      actionRef.current?.reload();
    } catch (error) {
      console.error('更新会员状态失败:', error);
      message.error('更新状态失败');
    }
  };

  // 表格列定义
  const columns: ProColumns<any>[] = [
    {
      title: '会员信息',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="member-info">
          <Avatar
            size={64}
            src={record.avatar}
            icon={<UserOutlined />}
            className="member-avatar"
          />
          <div className="member-meta">
            <div className="member-name">
              {record.name}
              {record.gender && (
                <Tag color={record.gender === 'male' ? 'blue' : 'pink'} style={{ marginLeft: 8 }}>
                  {record.gender === 'male' ? '男' : '女'}
                </Tag>
              )}
            </div>
            <div className="member-id">会员ID: {record.memberNo}</div>
            <div className="member-level">
              <StarOutlined /> {record.level?.name || '普通会员'}
            </div>
            <div className="member-contact">
              <PhoneOutlined /> {record.phone || '未设置'}
              {record.email && (
                <>
                  <span className="contact-divider">|</span>
                  <MailOutlined /> {record.email}
                </>
              )}
            </div>
          </div>
        </div>
      ),
      search: {
        transform: (value) => ({ name: value }),
      },
    },
    {
      title: '会员等级',
      dataIndex: ['level', 'name'],
      valueType: 'select',
      valueEnum: {
        'normal': { text: '普通会员', status: 'Default' },
        'silver': { text: '白银会员', status: 'Processing' },
        'gold': { text: '黄金会员', status: 'Success' },
        'diamond': { text: '钻石会员', status: 'Warning' },
      },
      render: (_, record) => {
        const levelColorMap: Record<string, string> = {
          'normal': 'default',
          'silver': 'blue',
          'gold': 'gold',
          'diamond': 'purple'
        };
        return (
          <div className="member-level-cell">
            <Tag color={levelColorMap[record.level?.code as string] || 'default'}>
              {record.level?.name || '普通会员'}
            </Tag>
            <div className="level-progress">
              <Progress
                percent={record.nextLevelProgress || 0}
                size="small"
                showInfo={false}
                status="active"
              />
              <div className="progress-text">
                {record.nextLevelProgress || 0}% 达到下一等级
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '消费金额',
      dataIndex: 'totalSpent',
      sorter: true,
      search: false,
      render: (totalSpent) => (
        <div className="member-spent">
          <DollarOutlined className="spent-icon" />
          <span>¥{(Number(totalSpent) || 0).toFixed(2)}</span>
        </div>
      ),
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      sorter: true,
      search: false,
      render: (count) => (
        <div className="order-count">
          <ShoppingOutlined className="order-icon" />
          <span>{count || 0}</span>
        </div>
      ),
    },
    {
      title: '积分',
      dataIndex: 'points',
      sorter: true,
      search: false,
      render: (points) => (
        <div className="point-count">
          <GiftOutlined className="point-icon" />
          <span>{points || 0}</span>
        </div>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: {
        true: { text: '正常', status: 'Success' },
        false: { text: '已禁用', status: 'Error' },
      },
      render: (_, record) => (
        <Switch
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<StopOutlined />}
          checked={record.isActive}
          onChange={(checked: boolean) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          onClick={() => history.push(`/member/detail/${record.id}`)}
        >
          查看
        </Button>,
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => history.push(`/member/edit/${record.id}`)}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定要删除此会员吗?"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div className="member-list-page">
      <ProTable
        headerTitle="会员管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => history.push('/member/create')}
            icon={<PlusOutlined />}
          >
            添加会员
          </Button>,
          <Button
            key="export"
            onClick={() => {
              message.success('正在导出会员数据');
            }}
            icon={<ExportOutlined />}
          >
            导出
          </Button>,
        ]}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space>
            <span>已选 {selectedRowKeys.length} 项</span>
            <a onClick={onCleanSelected}>取消选择</a>
          </Space>
        )}
        request={async (params = {}, sort, filter) => {
          const sortField = Object.keys(sort)[0];
          const sortOrder = sortField ? sort[sortField] : undefined;
          
          const response = await getMembers({
            page: params.current,
            limit: params.pageSize,
            name: params.name,
            levelCode: params.level_name,
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
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default MemberList;
