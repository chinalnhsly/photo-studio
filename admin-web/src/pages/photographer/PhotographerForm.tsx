import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Spin,
  message,
  Space,
  Switch,
  Avatar,
  Upload,
  Radio,
  Divider,
  InputNumber,
  Typography,
  TimePicker
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

import type { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

import type { FormListFieldData, FormListOperation } from 'antd/es/form/FormList';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';
import { history, useParams } from 'umi';
import moment from 'moment';
import {
  getPhotographerDetail,
  createPhotographer,
  updatePhotographer,
  uploadPhotographerAvatar,
  addPhotographerPortfolio,
  PortfolioItem
} from '../../services/photographer';
import './PhotographerForm.scss';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface PhotographerFormProps {
  isEdit?: boolean;
}

const PhotographerForm: React.FC<PhotographerFormProps> = ({ isEdit }) => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [portfolioImages, setPortfolioImages] = useState<UploadFile[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState<boolean>(false);
  
  // 摄影类型选项
  const specialtyOptions = [
    '婚纱摄影', '儿童摄影', '艺术写真', '全家福', 
    '商业摄影', '产品摄影', '证件照', '室内写真',
    '户外写真', '活动纪实', '宠物摄影', '妆前妆后', '孕妇照'
  ];
  
  // 级别选项
  const levelOptions = [
    { label: '初级摄影师', value: 'JUNIOR' },
    { label: '中级摄影师', value: 'INTERMEDIATE' },
    { label: '高级摄影师', value: 'SENIOR' },
    { label: '专家摄影师', value: 'EXPERT' }
  ];

  useEffect(() => {
    if (isEdit && id) {
      fetchPhotographerData();
    }
  }, [isEdit, id]);

  // 获取摄影师数据（编辑模式）
  const fetchPhotographerData = async () => {
    setLoading(true);
    try {
      const response = await getPhotographerDetail(Number(id));
      const data = response.data;
      
      // 设置表单值
      form.setFieldsValue({
        ...data,
        joinDate: data.joinDate ? moment(data.joinDate) : undefined,
        birthday: data.birthday ? moment(data.birthday) : undefined,
        workingDays: data.workingDays || ['1', '2', '3', '4', '5'],
        workingHours: data.workingHours || {
          start: '09:00',
          end: '18:00'
        }
      });
      
      // 设置头像
      setAvatarUrl(data.avatar || '');
      
      // 设置作品集
      if (data.portfolio && data.portfolio.length > 0) {
        setPortfolioImages(data.portfolio.map((item: string, index: number) => ({
          uid: `-${index + 1}`,
          name: `作品-${index + 1}`,
          status: 'done',
          url: item
        })));
      }
    } catch (error) {
      message.error('获取摄影师信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    setAvatarLoading(true);
    try {
      let response;
      
      if (isEdit && id) {
        response = await uploadPhotographerAvatar(Number(id), formData);
      } else {
        response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: { url: URL.createObjectURL(file) } });
          }, 1000);
        });
      }
      
      setAvatarUrl(response.data.url);
      message.success('头像上传成功');
    } catch (error) {
      message.error('头像上传失败');
    } finally {
      setAvatarLoading(false);
    }
  };

  // 处理作品集上传
  const handlePortfolioUpload = async (options: RcCustomRequestOptions) => {
    const { file, onSuccess, onError } = options;
    
    try {
      let response;
      
      if (isEdit && id) {
        // 先创建一个模拟的图片上传 API 调用
        // 在实际应用中，这里应该是调用你的图片上传 API
        const uploadResponse = await new Promise(resolve => {
          setTimeout(() => {
            resolve({ url: URL.createObjectURL(file as File) });
          }, 1000);
        });
        
        // 创建符合 PortfolioItem 类型的对象
        const portfolioItem: PortfolioItem = {
          id: Date.now(), // 使用临时 ID，实际应用中可能由后端生成
          url: (uploadResponse as any).url,
          title: (file as File).name
        };
        
        // 然后将图片 URL 添加到作品集
        response = await addPhotographerPortfolio(Number(id), portfolioItem);
      } else {
        response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: { url: URL.createObjectURL(file as File) } });
          }, 1000);
        });
      }
      
      onSuccess?.(response);
    } catch (error) {
      onError?.(error as Error);
      message.error('作品上传失败');
    }
  };

  // 在上传前检查文件类型和大小
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
      return false;
    }
    
    return true;
  };

  // 处理作品集变更
  const handlePortfolioChange = ({ fileList }: any) => {
    setPortfolioImages(fileList);
  };

  // 表单提交处理
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // 处理数据提交
      const submitData = {
        ...values,
        avatar: avatarUrl,
        joinDate: values.joinDate?.format('YYYY-MM-DD'),
        birthday: values.birthday?.format('YYYY-MM-DD'),
        portfolio: portfolioImages.map(image => image.url || image.response?.data?.url).filter(Boolean)
      };
      
      if (isEdit && id) {
        await updatePhotographer(Number(id), submitData);
        portfolio: portfolioImages.map(image => image.url || image.response?.data?.url).filter(Boolean)
      };
      
      if (isEdit && id) {
        await updatePhotographer(Number(id), submitData);
        message.success('摄影师信息已更新');
      } else {
        const result = await createPhotographer(submitData);
        message.success('摄影师添加成功');
        
        // 跳转到编辑页面
        history.replace(`/photographer/edit/${result.data.id}`);
        return;
      }
      
      // 如果是编辑模式，返回详情页
      if (isEdit && id) {
        history.push(`/photographer/detail/${id}`);
      }
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="photographer-form-page">
      <Card
        title={
          <div className="page-title">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => history.goBack()}
            >
              返回
            </Button>
            <span>{isEdit ? '编辑摄影师' : '新增摄影师'}</span>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              gender: '男',
              level: 'JUNIOR',
              isActive: true,
              workingDays: ['1', '2', '3', '4', '5'],
              workingHours: {
                start: '09:00',
                end: '18:00'
              }
            }}
          >
            <Row gutter={24}>
              {/* 左侧 - 头像上传和状态控制 */}
              <Col xs={24} md={8} className="avatar-col">
                <div className="avatar-upload">
                  <div className="avatar-title">摄影师头像</div>
                  <div className="avatar-container">
                    {avatarLoading ? (
                      <div className="avatar-loading">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                      </div>
                    ) : (
                      <Avatar 
                        size={128} 
                        src={avatarUrl} 
                        icon={!avatarUrl && <UserOutlined />} 
                      />
                    )}
                  </div>
                  <Upload
                    name="avatar"
                    showUploadList={false}
                    beforeUpload={(file: File) => {
                      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                      if (!isJpgOrPng) {
                        message.error('只能上传 JPG/PNG 格式的图片!');
                        return false;
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('图片必须小于2MB!');
                        return false;
                      }
                      
                      handleAvatarUpload(file);
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      {avatarUrl ? '更换头像' : '上传头像'}
                    </Button>
                  </Upload>
                </div>

                <div className="status-section">
                  <div className="section-title">状态设置</div>
                  <Form.Item
                    name="isActive"
                    valuePropName="checked"
                    label="在职状态"
                  >
                    <Switch checkedChildren="在职" unCheckedChildren="停用" />
                  </Form.Item>
                  <div className="status-note">
                    停用后该摄影师将不可被预约
                  </div>
                </div>
              </Col>
              
              {/* 右侧 - 表单内容 */}
              <Col xs={24} md={16}>
                {/* 基本信息 */}
                <Card title="基本信息" className="form-section-card">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入摄影师姓名' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="请输入摄影师姓名" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        label="性别"
                      >
                        <Radio.Group>
                          <Radio value="男">男</Radio>
                          <Radio value="女">女</Radio>
                          <Radio value="其他">其他</Radio>
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
                        <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="电子邮箱"
                        rules={[
                          { 
                            type: 'email', 
                            message: '请输入有效的电子邮箱地址' 
                          }
                        ]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="请输入电子邮箱" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="birthday"
                        label="生日"
                      >
                        <DatePicker 
                          style={{ width: '100%' }} 
                          placeholder="选择生日" 
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="joinDate"
                        label="入职日期"
                        rules={[{ required: true, message: '请选择入职日期' }]}
                      >
                        <DatePicker 
                          style={{ width: '100%' }} 
                          placeholder="选择入职日期" 
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="idCard"
                        label="身份证号"
                      >
                        <Input placeholder="请输入身份证号" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="level"
                        label="级别"
                        rules={[{ required: true, message: '请选择摄影师级别' }]}
                      >
                        <Select placeholder="请选择摄影师级别">
                          {levelOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                
                {/* 专业信息 */}
                <Card title="专业信息" className="form-section-card">
                  <Form.Item
                    name="specialties"
                    label="专长领域"
                    rules={[{ required: true, message: '请选择至少一个专长领域' }]}
                  >
                    <Select 
                      mode="multiple" 
                      placeholder="请选择摄影师专长领域"
                      maxTagCount={5}
                    >
                      {specialtyOptions.map(option => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="bio"
                    label="个人简介"
                  >
                    <TextArea rows={4} placeholder="请输入摄影师个人简介" />
                  </Form.Item>
                  
                  <Form.Item
                    name="achievements"
                    label="获奖经历"
                  >
                    <TextArea rows={3} placeholder="请输入摄影师获奖经历（可选）" />
                  </Form.Item>
                </Card>
                
                {/* 工作时间设置 */}
                <Card title="工作时间设置" className="form-section-card">
                  <Form.Item
                    name="workingDays"
                    label="工作日"
                    rules={[{ required: true, message: '请选择工作日' }]}
                  >
                    <Select mode="multiple" placeholder="请选择工作日">
                      <Option value="0">周日</Option>
                      <Option value="1">周一</Option>
                      <Option value="2">周二</Option>
                      <Option value="3">周三</Option>
                      <Option value="4">周四</Option>
                      <Option value="5">周五</Option>
                      <Option value="6">周六</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="工作时段" required>
                    <Row gutter={8}>
                      <Col span={11}>
                        <Form.Item
                          name={['workingHours', 'start']}
                          noStyle
                          rules={[{ required: true, message: '请选择开始时间' }]}
                        >
                          <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col span={2} style={{ textAlign: 'center' }}>
                        <span style={{ lineHeight: '32px' }}>至</span>
                      </Col>
                      <Col span={11}>
                        <Form.Item
                          name={['workingHours', 'end']}
                          noStyle
                          rules={[{ required: true, message: '请选择结束时间' }]}
                        >
                          <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                  
                  <Form.List name="unavailableDates">
                    {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                      <>
                        <div className="form-list-header">
                          <Text>特殊休假日期</Text>
                          <Button 
                            type="dashed" 
                            onClick={() => add({ date: null, reason: '' })} 
                            icon={<PlusOutlined />}
                          >
                            添加休假
                          </Button>
                        </div>
                        
                        {fields.map((field: FormListFieldData) => (
                          <div key={field.key} className="unavailable-date-item">
                            <Row gutter={16} align="middle">
                              <Col span={8}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'date']}
                                  fieldKey={[field.fieldKey, 'date']}
                                  rules={[{ required: true, message: '请选择日期' }]}
                                  label="日期"
                                >
                                  <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>
                              <Col span={14}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'reason']}
                                  fieldKey={[field.fieldKey, 'reason']}
                                  label="原因"
                                >
                                  <Input placeholder="请输入休假原因（可选）" />
                                </Form.Item>
                              </Col>
                              <Col span={2}>
                                <MinusCircleOutlined
                                  className="remove-icon"
                                  onClick={() => remove(field.name)}
                                />
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </>
                    )}
                  </Form.List>
                </Card>
                
                {/* 其他信息 */}
                <Card title="其他信息" className="form-section-card">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="hourlyRate"
                        label="小时费率"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          precision={2}
                          prefix="¥"
                          placeholder="小时收费标准"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="commissionRate"
                        label="提成比例"
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={0}
                          max={100}
                          formatter={(value: number | string | undefined) => value ? `${value}%` : ''}
                          parser={(value: string | undefined) => value ? value.replace('%', '') : ''}
                          placeholder="提成比例"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="notes"
                    label="管理备注"
                  >
                    <TextArea rows={3} placeholder="内部管理备注（仅管理员可见）" />
                  </Form.Item>
                </Card>
                
                {/* 作品集上传 */}
                <Card title="作品集" className="form-section-card">
                  <Form.Item name="portfolio" label="上传作品">
                    <Upload
                      listType="picture-card"
                      fileList={portfolioImages}
                      customRequest={handlePortfolioUpload}
                      onChange={handlePortfolioChange}
                      multiple
                    >
                      {portfolioImages.length >= 8 ? null : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>上传</div>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>
                </Card>
                
                {/* 表单按钮 */}
                <div className="form-actions">
                  <Space>
                    <Button onClick={() => history.goBack()}>
                      取消
                    </Button>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={submitting}
                    >
                      {isEdit ? '保存修改' : '添加摄影师'}
                    </Button>
                  </Space>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default PhotographerForm;
