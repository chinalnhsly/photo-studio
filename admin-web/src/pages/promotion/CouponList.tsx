import React, { useRef, useState } from 'react';
import { history } from 'umi';
import {
  Card,
  Button,
  Tag,
  Space,
  Badge,
  message,
  Modal,
  Dropdown,
  Menu,
  Tooltip,
  Progress,
  Input,
  Form,
  DatePicker,
  Select,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  DownOutlined,
  SendOutlined,
  CopyOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { 
  getCoupons, 
  deleteCoupon, 
  updateCouponStatus,
  generateCouponCodes,
  Coupon,
  GenerateCodeParams 
} from '../../services/coupon';
import './CouponList.scss';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

// 表单字段类型
interface CouponFormValues {
  sendType: 'all' | 'members' | 'selected' | 'email';
  userIds?: string[];
  emails?: string;
  expireInDays?: number;
  message?: string;
  couponId?: number;
  quantity?: number;
  prefix?: string;
  length?: number;
  expireDate?: moment.Moment;
}

// 优惠券类型映射
type CouponType = 'fixed' | 'percentage';

const CouponList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [generateForm] = Form.useForm();  // 移除泛型参数
  const [generatingCodes, setGeneratingCodes] = useState(false);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [sendForm] = Form.useForm();  // 移除泛型参数
  const [sendingCoupons, setSendingCoupons] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  
  // 删除优惠券
  const handleDeleteCoupon = async (id: number) => {
    try {
      await deleteCoupon(id);
      message.success('优惠券删除成功');
      actionRef.current?.reload();
    } catch (error) {
      console.error('删除优惠券失败:', error);
      message.error('删除优惠券失败');
    }
  };
  
  // 更新优惠券状态
  const handleUpdateStatus = async (id: number, isActive: boolean) => {
    try {
      await updateCouponStatus(id, isActive);
      message.success(`优惠券${isActive ? '已启用' : '已停用'}`);
      actionRef.current?.reload();
    } catch (error) {
      console.error('更新优惠券状态失败:', error);
      message.error('更新优惠券状态失败');
    }
  };
  
  // 生成优惠券码
  const handleGenerateCodes = async (values: CouponFormValues) => {
    try {
      setGeneratingCodes(true);
      const { couponId, quantity, prefix, length, expireDate } = values;
      
      await generateCouponCodes({
        couponId: couponId!,
        quantity: quantity!,
        prefix: prefix || undefined,
        length: length || 10,
        expireDate: expireDate ? expireDate.format('YYYY-MM-DD') : undefined
      });
      
      message.success(`成功生成 ${quantity!} 个优惠券码`);
      setGenerateModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('生成优惠券码失败:', error);
      message.error('生成优惠券码失败');
    } finally {
      setGeneratingCodes(false);
    }
  };
  
  // 发送优惠券
  const handleSendCoupon = async (values: CouponFormValues) => {
    try {
      setSendingCoupons(true);
      // 在实际开发中，这里应该调用API发送优惠券给用户
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('优惠券发送成功');
      setSendModalVisible(false);
      actionRef.current?.reload();
    } catch (error) {
      console.error('发送优惠券失败:', error);
      message.error('发送优惠券失败');
    } finally {
      setSendingCoupons(false);
    }
  };
  
  // 表格列定义
  const columns: ProColumns<Coupon>[] = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="coupon-name">
          <div className="primary-name">{record.name}</div>
          <div className="coupon-code-count">
            {record.totalCodes || 0} 个优惠券码，已使用 {record.usedCodes || 0} 个
          </div>
        </div>
      ),
    },
    {
      title: '优惠类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        fixed: { text: '固定金额' },
        percentage: { text: '百分比折扣' },
      },
      render: (_, record) => {
        const typeMap = {
          fixed: { text: '固定金额', color: 'blue' },
          percentage: { text: '百分比折扣', color: 'purple' },
        };
        const type = typeMap[record.type as CouponType] || { text: '未知', color: 'default' };
        
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
    {
      title: '优惠值',
      dataIndex: 'value',
      render: (_, record) => {
        if (record.type === 'fixed') {
          return <span>¥{Number(record.value).toFixed(2)}</span>;
        } else {
          return <span>{Number(record.value) * 100}% OFF</span>;
        }
      },
    },
    {
      title: '最低消费',
      dataIndex: 'minPurchase',
      render: (minPurchase) => {
        return minPurchase ? `¥${Number(minPurchase).toFixed(2)}` : '无限制';
      },
    },
    {
      title: '有效期',
      dataIndex: 'validRange',
      search: false,
      render: (_, record) => {
        const startDate = record.startDate ? moment(record.startDate).format('YYYY-MM-DD') : '不限';
        const endDate = record.endDate ? moment(record.endDate).format('YYYY-MM-DD') : '不限';
        return <span>{startDate} 至 {endDate}</span>;
      },
    },
    {
      title: '使用率',
      dataIndex: 'usageRate',
      search: false,
      render: (_, record) => {
        const totalCodes = record.totalCodes || 0;
        const usedCodes = record.usedCodes || 0;
        const rate = totalCodes > 0 ? Math.round((usedCodes / totalCodes) * 100) : 0;
        
        return (
          <Tooltip title={`${usedCodes}/${totalCodes}`}>
            <Progress 
              percent={rate} 
              size="small" 
              status={rate >= 80 ? 'exception' : 'normal'} 
            />
          </Tooltip>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      valueType: 'select',
      valueEnum: {
        true: { text: '已启用', status: 'Success' },
        false: { text: '已停用', status: 'Error' },
      },
      render: (_, record) => {
        // 检查是否已过期
        const isExpired = record.endDate && moment().isAfter(moment(record.endDate));
        
        if (isExpired) {
          return <Badge status="default" text="已过期" />;
        }
        
        return (
          <Badge 
            status={record.isActive ? 'success' : 'error'} 
            text={record.isActive ? '已启用' : '已停用'} 
          />
        );
      },
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
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => history.push(`/promotion/coupon/edit/${record.id}`)}
          >
            编辑
          </Button>
          
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="generate"
                  onClick={() => {
                    setSelectedCoupon(record);
                    generateForm.resetFields();
                    generateForm.setFieldsValue({
                      couponId: record.id,
                      quantity: 10,
                      length: 8,
                      prefix: record.code || ''
                    });
                    setGenerateModalVisible(true);
                  }}
                >
                  <CopyOutlined /> 批量生成优惠券码
                </Menu.Item>
                <Menu.Item
                  key="send"
                  onClick={() => {
                    setSelectedCoupon(record);
                    sendForm.resetFields();
                    setSendModalVisible(true);
                  }}
                >
                  <SendOutlined /> 发送优惠券
                </Menu.Item>
                <Menu.Item
                  key="status"
                  onClick={() => handleUpdateStatus(record.id, !record.isActive)}
                >
                  {record.isActive ? '停用优惠券' : '启用优惠券'}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="delete"
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: '确定要删除此优惠券?',
                      icon: <ExclamationCircleOutlined />,
                      content: '删除后将不可恢复，已发放的优惠券将无法使用',
                      onOk: () => handleDeleteCoupon(record.id),
                    });
                  }}
                >
                  <DeleteOutlined /> 删除优惠券
                </Menu.Item>
              </Menu>
            }
          >
            <a>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="coupon-list-page">
      <ProTable
        headerTitle="优惠券管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/promotion/coupon/create')}
          >
            新增优惠券
          </Button>,
          <Button
            key="codes"
            onClick={() => history.push('/promotion/coupon/codes')}
          >
            查看优惠券码
          </Button>,
        ]}
        request={async (params = {}, sort, filter) => {
          const sortField = Object.keys(sort)[0];
          const sortOrder = sortField ? sort[sortField] : undefined;
          
          try {
            const response = await getCoupons({
              page: params.current,
              limit: params.pageSize,
              name: params.name,
              type: params.type,
              isActive: params.isActive,
              sortField,
              sortOrder,
            });
            
            return {
              data: response.data.items,
              success: true,
              total: response.data.meta.total,
            };
          } catch (error) {
            console.error('获取优惠券列表失败:', error);
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (selectedRowKeys: React.Key[]) => setSelectedRowKeys(selectedRowKeys),
        }}
        pagination={{
          pageSize: 10,
        }}
      />
      
      {/* 生成优惠券码的弹窗 */}
      <Modal
        title="批量生成优惠券码"
        visible={generateModalVisible}
        onCancel={() => setGenerateModalVisible(false)}
        onOk={() => generateForm.submit()}
        confirmLoading={generatingCodes}
      >
        <Form
          form={generateForm}
          layout="vertical"
          onFinish={(values: any) => handleGenerateCodes(values as CouponFormValues)}
        >
          <Form.Item name="couponId" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item
            name="quantity"
            label="数量"
            rules={[
              { required: true, message: '请输入生成数量' },
              { type: 'number', min: 1, max: 1000, message: '数量必须在1-1000之间' }
            ]}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={1000} />
          </Form.Item>
          
          <Form.Item
            name="prefix"
            label="优惠码前缀"
            extra="前缀将用于区分不同的优惠券码"
          >
            <Input placeholder="例如: SUMMER2023" />
          </Form.Item>
          
          <Form.Item
            name="length"
            label="优惠码长度"
            extra="不含前缀的优惠码长度"
            rules={[{ type: 'number', min: 4, max: 16, message: '长度必须在4-16之间' }]}
          >
            <InputNumber style={{ width: '100%' }} min={4} max={16} />
          </Form.Item>
          
          <Form.Item
            name="expireDate"
            label="过期时间"
            extra="如不设置，将使用优惠券的过期时间"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
        
        {selectedCoupon && (
          <div className="selected-coupon-info">
            <div className="info-title">当前优惠券信息:</div>
            <div className="info-content">
              <div>名称: {selectedCoupon.name}</div>
              <div>
                类型: {selectedCoupon.type === 'fixed' ? '固定金额' : '百分比折扣'} / 
                值: {selectedCoupon.type === 'fixed' ? `¥${selectedCoupon.value}` : `${selectedCoupon.value * 100}%`}
              </div>
              <div>
                有效期: {selectedCoupon.startDate ? moment(selectedCoupon.startDate).format('YYYY-MM-DD') : '不限'} 至 
                {selectedCoupon.endDate ? moment(selectedCoupon.endDate).format('YYYY-MM-DD') : '不限'}
              </div>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 发送优惠券的弹窗 */}
      <Modal
        title="发送优惠券"
        visible={sendModalVisible}
        onCancel={() => setSendModalVisible(false)}
        onOk={() => sendForm.submit()}
        confirmLoading={sendingCoupons}
      >
        <Form
          form={sendForm}
          layout="vertical"
          onFinish={(values: any) => handleSendCoupon(values as CouponFormValues)}
        >
          <Form.Item
            name="sendType"
            label="发送方式"
            initialValue="all"
            rules={[{ required: true, message: '请选择发送方式' }]}
          >
            <Select>
              <Option value="all">发送给所有用户</Option>
              <Option value="members">仅发送给会员</Option>
              <Option value="selected">发送给指定用户</Option>
              <Option value="email">通过邮件群发</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            noStyle
            shouldUpdate={(prevValues: CouponFormValues, currentValues: CouponFormValues) => prevValues.sendType !== currentValues.sendType}
          >
            {({ getFieldValue }: { getFieldValue: (name: string) => any }) => {
              const sendType = getFieldValue('sendType');
              
              if (sendType === 'selected') {
                return (
                  <Form.Item
                    name="userIds"
                    label="选择用户"
                    rules={[{ required: true, message: '请选择用户' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="选择用户"
                      style={{ width: '100%' }}
                      options={[
                        { label: '用户A', value: '1' },
                        { label: '用户B', value: '2' },
                        { label: '用户C', value: '3' },
                      ]}
                    />
                  </Form.Item>
                );
              }
              
              if (sendType === 'email') {
                return (
                  <Form.Item
                    name="emails"
                    label="邮箱地址"
                    rules={[{ required: true, message: '请输入邮箱地址' }]}
                  >
                    <TextArea
                      placeholder="输入邮箱地址，多个邮箱请用逗号或换行分隔"
                      rows={4}
                    />
                  </Form.Item>
                );
              }
              
              return null;
            }}
          </Form.Item>
          
          <Form.Item
            name="expireInDays"
            label="有效天数"
            tooltip="发送后，优惠券在多少天内有效"
            initialValue={30}
          >
            <InputNumber style={{ width: '100%' }} min={1} max={365} />
          </Form.Item>
          
          <Form.Item
            name="message"
            label="发送消息"
          >
            <TextArea
              placeholder="输入发送给用户的消息内容"
              rows={3}
            />
          </Form.Item>
        </Form>
        
        {selectedCoupon && (
          <div className="selected-coupon-info">
            <div className="info-title">当前优惠券信息:</div>
            <div className="info-content">
              <div>名称: {selectedCoupon.name}</div>
              <div>
                类型: {selectedCoupon.type === 'fixed' ? '固定金额' : '百分比折扣'} / 
                值: {selectedCoupon.type === 'fixed' ? `¥${selectedCoupon.value}` : `${selectedCoupon.value * 100}%`}
              </div>
              <div>已生成的优惠券码: {selectedCoupon.totalCodes || 0} 个</div>
              <div>已使用的优惠券码: {selectedCoupon.usedCodes || 0} 个</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CouponList;
