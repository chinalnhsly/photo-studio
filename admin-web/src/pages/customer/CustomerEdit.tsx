import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Card, message, Spin, Select, 
  DatePicker, Radio, Divider, Upload, Space, Tag, InputNumber 
} from 'antd';
import { PlusOutlined, UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, history } from 'umi';
import moment from 'moment';
import { getCustomerDetail, createCustomer, updateCustomer } from '../../services/customer';
import type { RcFile, UploadFile } from 'antd/lib/upload/interface';
import type { SelectProps } from 'antd/es/select';
import './CustomerEdit.less';

const { Option } = Select;
const { TextArea } = Input;

interface TagOption {
  value: string;
  label: string;
  color?: string;
}

// 会员等级选项
const memberLevels = [
  { value: 'regular', label: '普通会员', color: '#909399' },
  { value: 'silver', label: '银卡会员', color: '#C0C0C0' },
  { value: 'gold', label: '金卡会员', color: '#D4AF37' },
  { value: 'platinum', label: '铂金会员', color: '#E5E4E2' },
  { value: 'diamond', label: '钻石会员', color: '#B9F2FF' },
];

// 标签选项
const tagOptions: TagOption[] = [
  { value: 'vip', label: 'VIP', color: '#f50' },
  { value: 'wedding', label: '婚纱客户', color: '#2db7f5' },
  { value: 'portrait', label: '写真客户', color: '#87d068' },
  { value: 'family', label: '家庭照客户', color: '#108ee9' },
  { value: 'children', label: '儿童照客户', color: '#f50' },
  { value: 'corporate', label: '企业客户', color: '#722ed1' },
  { value: 'repeat', label: '回头客', color: '#eb2f96' }
];

const CustomerEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [tagInputVisible, setTagInputVisible] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // 获取客户详情
  useEffect(() => {
    if (isEdit) {
      fetchCustomerDetail();
    }
  }, [id]);

  // 获取客户详情
  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);
      const response = await getCustomerDetail(Number(id));
      const customer = response.data;
      
      // 填充表单
      form.setFieldsValue({
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
        gender: customer.gender || 'male',
        birthday: customer.birthday ? moment(customer.birthday) : undefined,
        address: customer.address,
        memberLevel: customer.memberLevel || 'regular',
        notes: customer.notes,
        wechat: customer.wechat,
        source: customer.source
      });
      
      // 设置头像
      if (customer.avatar) {
        setAvatarUrl(customer.avatar);
        setFileList([
          {
            uid: '-1',
            name: 'avatar.png',
            status: 'done',
            url: customer.avatar,
          },
        ]);
      }
      
      // 设置标签
      if (customer.tags && Array.isArray(customer.tags)) {
        setTags(customer.tags);
      }
    } catch (error) {
      console.error('获取客户详情失败:', error);
      message.error('获取客户详情失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 上传前检查文件
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    
    return isJpgOrPng && isLt2M;
  };

  // 自定义上传方法
  const customUpload = async ({ file, onSuccess, onError }: any) => {
    // 实际项目中，应该调用上传API上传文件
    // 这里模拟上传过程
    try {
      // 模拟网络请求
      setTimeout(() => {
        // 模拟成功回调
        onSuccess("ok", file);
        
        // 创建本地预览
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const url = reader.result as string;
          setAvatarUrl(url);
        };
      }, 1000);
    } catch (err) {
      // 处理错误
      onError(err);
    }
  };
  
  // 文件上传变化
  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
    
    setFileList(info.fileList.slice(-1)); // 只保留最新上传的头像
  };

  // 删除文件
  const onRemove = () => {
    setAvatarUrl(null);
    setFileList([]);
  };

  // 添加自定义标签
  const handleAddTag = () => {
    if (tagInputValue && !tags.includes(tagInputValue)) {
      setTags([...tags, tagInputValue]);
    }
    setTagInputVisible(false);
    setTagInputValue('');
  };

  // 删除标签
  const handleRemoveTag = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      // 处理日期格式
      if (values.birthday) {
        values.birthday = values.birthday.format('YYYY-MM-DD');
      }
      
      // 添加标签
      values.tags = tags;
      
      // 添加头像URL
      values.avatar = avatarUrl;
      
      if (isEdit) {
        // 更新客户
        await updateCustomer(Number(id), values);
        message.success('客户信息更新成功');
      } else {
        // 创建客户
        await createCustomer(values);
        message.success('客户创建成功');
      }
      
      // 返回客户列表
      history.push('/customer/list');
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('提交失败，请检查表单填写是否正确');
    } finally {
      setSubmitting(false);
    }
  };

  // 渲染会员等级选项
  const renderMemberLevelOptions = () => {
    return memberLevels.map(level => (
      <Option key={level.value} value={level.value}>
        <Tag color={level.color}>{level.label}</Tag>
      </Option>
    ));
  };

  // 渲染标签选择项
  const tagSelectOptions: SelectProps['options'] = tagOptions.map(tag => ({
    value: tag.value,
    label: (
      <Tag color={tag.color}>
        {tag.label}
      </Tag>
    ),
  }));

  return (
    <div className="customer-edit-page">
      <Card
        title={
          <div className="page-title">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => history.push('/customer/list')}
              style={{ marginRight: 16 }}
            >
              返回
            </Button>
            {isEdit ? '编辑客户' : '新建客户'}
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            className="customer-form"
            onFinish={handleSubmit}
            initialValues={{
              gender: 'male',
              memberLevel: 'regular'
            }}
          >
            <div className="form-sections">
              <div className="main-info-section">
                <div className="avatar-section">
                  <Form.Item
                    name="avatar"
                    label="头像"
                  >
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      customRequest={customUpload}
                      onChange={handleFileChange}
                      fileList={fileList}
                      onRemove={onRemove}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="avatar" style={{ width: '100%' }} />
                      ) : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>上传头像</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </div>
                
                <div className="basic-info">
                  <Form.Item
                    name="name"
                    label="姓名"
                    rules={[{ required: true, message: '请输入客户姓名' }]}
                  >
                    <Input placeholder="请输入客户姓名" />
                  </Form.Item>
                  
                  <Form.Item
                    name="phoneNumber"
                    label="手机号码"
                    rules={[
                      { required: true, message: '请输入手机号码' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                    ]}
                  >
                    <Input placeholder="请输入手机号码" />
                  </Form.Item>
                  
                  <Form.Item
                    name="email"
                    label="电子邮箱"
                    rules={[
                      { type: 'email', message: '请输入有效的邮箱' }
                    ]}
                  >
                    <Input placeholder="请输入电子邮箱" />
                  </Form.Item>
                  
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
                  
                  <Form.Item
                    name="birthday"
                    label="生日"
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      placeholder="选择生日日期" 
                    />
                  </Form.Item>
                </div>
              </div>
              
              <Divider />
              
              <div className="additional-info">
                <Form.Item
                  name="address"
                  label="地址"
                >
                  <Input.TextArea rows={3} placeholder="请输入客户地址" />
                </Form.Item>
                
                <Form.Item
                  name="wechat"
                  label="微信号"
                >
                  <Input placeholder="请输入微信号" />
                </Form.Item>
                
                <Form.Item
                  name="memberLevel"
                  label="会员等级"
                >
                  <Select placeholder="选择会员等级">
                    {renderMemberLevelOptions()}
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="source"
                  label="客户来源"
                >
                  <Select placeholder="选择客户来源">
                    <Option value="referral">老客户介绍</Option>
                    <Option value="online">线上获取</Option>
                    <Option value="advertising">广告获取</Option>
                    <Option value="walk-in">门店直接咨询</Option>
                    <Option value="event">活动获取</Option>
                    <Option value="other">其他</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item label="客户标签">
                  <Space size={[0, 8]} wrap>
                    {tags.map(tag => {
                      const tagOption = tagOptions.find(option => option.value === tag);
                      const color = tagOption?.color || 'blue';
                      
                      return (
                        <Tag
                          key={tag}
                          color={color}
                          closable
                          onClose={() => handleRemoveTag(tag)}
                        >
                          {tagOption?.label || tag}
                        </Tag>
                      );
                    })}
                  </Space>
                  
                  <Divider style={{ margin: '8px 0' }} />
                  
                  <Space wrap>
                    {!tagInputVisible && (
                      <Select
                        style={{ width: 200 }}
                        placeholder="添加标签"
                        options={tagSelectOptions}
                        onSelect={(value: string) => {
                          if (!tags.includes(value)) {
                            setTags([...tags, value]);
                          }
                        }}
                      />
                    )}
                    
                    {!tagInputVisible && (
                      <Button 
                        type="dashed" 
                        onClick={() => setTagInputVisible(true)}
                        icon={<PlusOutlined />}
                      >
                        自定义标签
                      </Button>
                    )}
                    
                    {tagInputVisible && (
                      <Input
                      type="text"
                      size="small"
                      style={{ width: 200 }}
                      value={tagInputValue}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInputValue(e.target.value)}
                      onBlur={handleAddTag}
                      onPressEnter={handleAddTag}
                      autoFocus
                      />
                    )}
                  </Space>
                </Form.Item>
                
                <Form.Item
                  name="notes"
                  label="客户备注"
                >
                  <TextArea 
                    rows={4} 
                    placeholder="请输入关于客户的备注信息" 
                    maxLength={500} 
                    showCount 
                  />
                </Form.Item>
              </div>
            </div>
            
            <Divider />
            
            <div className="form-actions">
              <Button onClick={() => history.push('/customer/list')}>取消</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {isEdit ? '更新客户' : '创建客户'}
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default CustomerEdit;
