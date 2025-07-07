import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Divider,
  Row,
  Col,
  Spin,
  message,
  Space,
  Switch,
  Avatar,
  Upload,
  Radio
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  WechatOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useParams } from 'umi';
import { history } from '../../utils/compatibility';
import moment from 'moment';
import api from '@/services/api';
import TagSelect from '@/components/TagSelect';
import './CustomerForm.less';

const { Option } = Select;
const { TextArea } = Input;

interface CustomerFormProps {
  mode?: 'create' | 'edit';
  onSuccess?: () => void;
  customerId?: string;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  mode = 'create',
  onSuccess,
  customerId
}) => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  const actualId = customerId || id;
  const isEdit = mode === 'edit' || !!actualId;
  
  useEffect(() => {
    if (isEdit && actualId) {
      fetchCustomerData(actualId);
    }
  }, [actualId, isEdit]);
  
  const fetchCustomerData = async (customerId: string) => {
    setLoading(true);
    try {
      const response = await api.customer.detail(customerId);
      const customerData = response.data;
      
      if (customerData.birthday) {
        customerData.birthday = moment(customerData.birthday);
      }
      
      form.setFieldsValue(customerData);
      
      if (customerData.avatar) {
        setAvatarUrl(customerData.avatar);
      }
    } catch (error) {
      message.error('获取客户信息失败');
      console.error('获取客户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      if (values.birthday) {
        values.birthday = values.birthday.format('YYYY-MM-DD');
      }
      
      if (avatarUrl) {
        values.avatar = avatarUrl;
      }
      
      if (isEdit) {
        await api.customer.update(actualId, values);
        message.success('客户信息更新成功');
      } else {
        await api.customer.create(values);
        message.success('客户创建成功');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        history.push('/customer/list');
      }
    } catch (error) {
      message.error(isEdit ? '更新客户信息失败' : '创建客户失败');
      console.error('保存客户数据失败:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAvatarChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done') {
      try {
        const localUrl = URL.createObjectURL(info.file.originFileObj);
        setAvatarUrl(localUrl);
        message.success('头像上传成功');
      } catch (error) {
        message.error('头像上传失败');
        console.error('头像上传失败:', error);
      }
    } else if (info.file.status === 'error') {
      message.error('头像上传失败');
    }
  };
  
  const getTitle = () => {
    if (isEdit) {
      return '编辑客户';
    }
    return '添加客户';
  };
  
  return (
    <Card title={getTitle()} className="customer-form-card">
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            gender: 'male',
            source: 'website',
            tags: [],
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="客户姓名"
                    rules={[{ required: true, message: '请输入客户姓名' }]}
                  >
                    <Input 
                      placeholder="请输入客户姓名" 
                      prefix={<UserOutlined />} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="性别"
                  >
                    <Radio.Group>
                      <Radio value="male">男</Radio>
                      <Radio value="female">女</Radio>
                      <Radio value="other">其他</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[{ required: true, message: '请输入联系电话' }]}
                  >
                    <Input 
                      placeholder="请输入联系电话" 
                      prefix={<PhoneOutlined />} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="电子邮箱"
                    rules={[
                      { type: 'email', message: '请输入有效的电子邮箱' }
                    ]}
                  >
                    <Input 
                      placeholder="请输入电子邮箱" 
                      prefix={<MailOutlined />} 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="wechatId"
                    label="微信号"
                  >
                    <Input 
                      placeholder="请输入微信号" 
                      prefix={<WechatOutlined />} 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="birthday"
                    label="出生日期"
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      placeholder="请选择出生日期" 
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="address"
                label="联系地址"
              >
                <div className="address-field">
                  <EnvironmentOutlined className="address-prefix" />
                  <TextArea 
                    rows={2} 
                    placeholder="请输入联系地址"
                  />
                </div>
              </Form.Item>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="source"
                    label="客户来源"
                  >
                    <Select placeholder="请选择客户来源">
                      <Option value="website">官网</Option>
                      <Option value="referral">转介绍</Option>
                      <Option value="social">社交媒体</Option>
                      <Option value="ad">广告</Option>
                      <Option value="other">其他</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="level"
                    label="客户级别"
                  >
                    <Select placeholder="请选择客户级别">
                      <Option value="vip">VIP客户</Option>
                      <Option value="regular">普通客户</Option>
                      <Option value="potential">潜在客户</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="tags"
                label="客户标签"
              >
                <TagSelect 
                  placeholder="添加标签"
                  suggestions={[
                    '重要客户', '婚纱摄影', '儿童摄影', '商业摄影', 
                    '写真', '有投诉', '待跟进', '老客户'
                  ]}
                />
              </Form.Item>
              
              <Form.Item
                name="remarks"
                label="备注信息"
              >
                <TextArea 
                  rows={4} 
                  placeholder="请输入备注信息" 
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <div className="avatar-upload-container">
                <Form.Item
                  label="客户头像"
                  tooltip="支持 jpg, jpeg, png 格式，文件大小不超过 2MB"
                >
                    <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="/api/dummy-upload"
                    beforeUpload={(file: File): boolean => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                      message.error('请上传图片文件!');
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                      message.error('图片大小不能超过 2MB!');
                      }
                      return isImage && isLt2M;
                    }}
                    onChange={handleAvatarChange}
                    >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} />
                    ) : (
                      <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>上传头像</div>
                      </div>
                    )}
                    </Upload>
                </Form.Item>
              </div>
            </Col>
          </Row>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              style={{ marginRight: 16 }}
            >
              {isEdit ? '更新' : '创建'}
            </Button>
            <Button 
              onClick={() => history.push('/customer/list')}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default CustomerForm;
