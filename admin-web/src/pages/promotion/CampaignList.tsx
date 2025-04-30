import React, { useState, useRef } from 'react';
import { history, Link } from 'umi';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Badge,
  Switch,
  Typography,
  Progress,
  Tooltip,
  Dropdown,
  Menu,
  Modal,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  LineChartOutlined,
  GiftOutlined,
  DollarOutlined,
  FileTextOutlined,
  TeamOutlined,
  QuestionCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  getCampaigns,
  updateCampaignStatus,
  deleteCampaign,
  duplicateCampaign,
} from '../../services/promotion';
import './CampaignList.scss';

const { Text } = Typography;

// 添加活动状态的类型定义
type CampaignStatusKey = 'scheduled' | 'active' | 'paused' | 'completed' | 'expired';

// 活动状态对应颜色
const statusColorMap = {
  scheduled: 'blue',
  active: 'green',
  paused: 'orange',
  completed: 'default',
  expired: 'red',
};

const CampaignList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 创建活动
  const handleCreateCampaign = () => {
    history.push('/promotion/campaign/create');
  };

  // 查看活动详情
  const handleViewCampaign = (id: number) => {
    history.push(`/promotion/campaign/detail/${id}`);
  };

  // 编辑活动
  const handleEditCampaign = (id: number) => {
    history.push(`/promotion/campaign/edit/${id}`);
  };

  // 复制活动
  const handleDuplicateCampaign = async (id: number) => {
    try {
      await duplicateCampaign(id);
      message.success('活动复制成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('复制活动失败:', error);
      message.error('复制活动失败');
    }
  };

  // 更新活动状态
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      await updateCampaignStatus(id, status);
      message.success(`活动已${status ? '启用' : '暂停'}`);
      actionRef.current?.reload();
    } catch (error) {
      console.error('更新活动状态失败:', error);
      message.error('状态更新失败');
    }
  };

  // 删除活动
  const handleDeleteCampaign = async (id: number) => {
    try {
      await deleteCampaign(id);
      message.success('活动删除成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('删除活动失败:', error);
      message.error('删除失败');
    }
  };

  // 表格列定义
  const columns: ProColumns<any>[] = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      render: (text, record) => (
        <div className="campaign-name-cell">
          <span className="campaign-name">{text}</span>
          {record.isHot && <Tag color="red">热门</Tag>}
          {record.isRecommended && <Tag color="green">推荐</Tag>}
        </div>
      ),
    },
    {
      title: '活动类型',
      dataIndex: 'type',
      key: 'type',
      valueEnum: {
        discount: { text: '折扣' },
        gift: { text: '赠品' },
        coupon: { text: '优惠券' },
        groupBuy: { text: '团购' },
        combo: { text: '套餐' },
        flashSale: { text: '限时特价' },
      },
    },
    {
      title: '活动时间',
      key: 'timeRange',
      render: (_, record) => (
        <div className="campaign-time-cell">
          <div>{record.startDate} 至</div>
          <div>{record.endDate}</div>
        </div>
      ),
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      valueEnum: {
        scheduled: { text: '未开始' },
        active: { text: '进行中' },
        paused: { text: '已暂停' },
        completed: { text: '已结束' },
        expired: { text: '已过期' },
      },
      render: (_, record) => (
        <Space>
          <Badge status={statusColorMap[record.status as CampaignStatusKey]} text={record.statusText} />
          {(record.status === 'active' || record.status === 'paused') && (
            <Switch
              size="small"
              checked={record.status === 'active'}
              onChange={(checked: boolean) => handleStatusChange(record.id, checked)}
            />
          )}
        </Space>
      ),
    },
    {
      title: '参与人数',
      dataIndex: 'participantsCount',
      key: 'participantsCount',
      search: false,
    },
    {
      title: '优惠方式',
      dataIndex: 'discountType',
      key: 'discountType',
      search: false,
      render: (_, record) => {
        let discountText = '';
        if (record.discountType === 'percentage') {
          discountText = `${record.discountValue}折`;
        } else if (record.discountType === 'fixed') {
          discountText = `减¥${record.discountValue}`;
        } else if (record.discountType === 'free_gift') {
          discountText = '赠品';
        } else {
          discountText = record.discountDescription || '特殊优惠';
        }
        return discountText;
      },
    },
    {
      title: '转化率',
      key: 'conversionRate',
      dataIndex: 'conversionRate',
      search: false,
      render: (rate) => (
        <Tooltip title={`${rate}%`}>
          <Progress
            percent={rate}
            size="small"
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record) => (
        <Space size="small">
          <a onClick={() => handleViewCampaign(record.id)}>查看</a>
          {(record.status === 'scheduled' || record.status === 'paused') && (
            <a onClick={() => handleEditCampaign(record.id)}>编辑</a>
          )}
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="duplicate"
                  icon={<CopyOutlined />}
                  onClick={() => handleDuplicateCampaign(record.id)}
                >
                  复制活动
                </Menu.Item>
                <Menu.Item
                  key="analytics"
                  icon={<LineChartOutlined />}
                  onClick={() => history.push(`/promotion/campaign/${record.id}/analytics`)}
                >
                  效果分析
                </Menu.Item>
                <Menu.Item
                  key="coupons"
                  icon={<GiftOutlined />}
                  onClick={() => history.push(`/promotion/campaign/${record.id}/coupons`)}
                >
                  查看优惠券
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="delete"
                  icon={<DeleteOutlined />}
                  danger
                >
                  <Popconfirm
                    title="确定删除此活动吗？"
                    onConfirm={() => handleDeleteCampaign(record.id)}
                    okText="确定"
                    cancelText="取消"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  >
                    <a className="text-danger">删除活动</a>
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
          >
            <a>
              更多 <MoreOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="campaign-list-page">
      {/* 营销活动统计卡片 */}
      <Row gutter={[24, 24]} className="stat-cards">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="进行中活动"
              value={5}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总参与人数"
              value={2431}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="优惠券使用次数"
              value={768}
              prefix={<GiftOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活动收益"
              value={98500}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      {/* 活动列表 */}
      <Card className="table-card">
        <ProTable
          headerTitle="营销活动"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 100,
          }}
          toolBarRender={() => [
            <Button
              key="create"
              type="primary"
              onClick={handleCreateCampaign}
              icon={<PlusOutlined />}
            >
              创建活动
            </Button>,
          ]}
          columns={columns}
          request={async (params, sort, filter) => {
            const response = await getCampaigns({
              ...params,
              page: params.current,
              pageSize: params.pageSize,
              sortField: Object.keys(sort || {})[0],
              sortOrder: sort && Object.keys(sort)[0] ? sort[Object.keys(sort)[0]] : undefined,
            });
            return {
              data: response.data.items,
              success: true,
              total: response.data.meta.total,
            };
          }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
            <Space size={24}>
              <span>
                已选 {selectedRowKeys.length} 项
                <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                  取消选择
                </a>
              </span>
            </Space>
          )}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a onClick={() => message.info('批量导出功能开发中')}>
                  批量导出
                </a>
                <Popconfirm
                  title={`确认删除选中的 ${selectedRowKeys.length} 个活动?`}
                  onConfirm={async () => {
                    // 实现批量删除功能
                    message.success(`已删除 ${selectedRowKeys.length} 个活动`);
                    setSelectedRowKeys([]);
                    actionRef.current?.reloadAndRest?.();
                  }}
                  okText="确认"
                  cancelText="取消"
                >
                  <a className="text-danger">批量删除</a>
                </Popconfirm>
              </Space>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default CampaignList;
