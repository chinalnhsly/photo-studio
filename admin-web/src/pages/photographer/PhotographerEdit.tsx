import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  message,
  Space,
  Switch,
  Radio,
  Row,
  Col,
  Divider,
  Tag,
  Avatar,
  Tabs,
  Modal,
  Rate
} from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import {
  UserOutlined,
  UploadOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  PlusCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useParams, history, useLocation } from 'umi';
import moment from 'moment';
import { getPhotographerDetail, createPhotographer, updatePhotographer, PhotographerData } from '@/services/photographer';
import TagSelect from '@/components/TagSelect';
import styles from './PhotographerEdit.less';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// 添加类型定义
interface Studio {
  id: number;
  value: number;
}

interface Skill {
  name: string;
  rating: number;
}

// 明确定义 PhotographerData 中应该包含的 portfolio 属性
interface PhotographerFormData extends Partial<PhotographerData> {
  portfolio?: {
    images: string[];
  };
}

interface PhotographerFormValues extends Omit<PhotographerData, 'joinDate' | 'contractEndDate' | 'studios'> {
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  level: string;
  status: 'active' | 'inactive';
  joinDate?: moment.Moment;
  contractEndDate?: moment.Moment;
  specialties?: string[];
  studios?: number[];
  bio?: string;
  featured?: boolean;
  skills?: Skill[];
}

// 摄影师级别选项
const levelOptions = [
  { value: 'junior', label: '初级摄影师' },
  { value: 'intermediate', label: '中级摄影师' },
  { value: 'senior', label: '高级摄影师' },
  { value: 'expert', label: '资深摄影师' },
  { value: 'chief', label: '首席摄影师' },
];

// 摄影专长选项
const specialtyOptions = [
  '婚纱摄影', '写真摄影', '儿童摄影', '全家福', 
  '商业摄影', '活动拍摄', '证件照', '风景摄影',
  '产品摄影', '时尚摄影', '人像摄影'
];

// 工作室选项
const studioOptions = [
  { value: 1, label: '总店' },
  { value: 2, label: '北京朝阳店' },
  { value: 3, label: '上海静安店' },
  { value: 4, label: '广州天河店' },
];

// 照片上传前校验
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

interface PhotographerEditProps {}

const PhotographerEdit: React.FC<PhotographerEditProps> = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'basic';
  
  const isEdit = !!id;
  const [form] = Form.useForm();
  const [skillsForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>(activeTab);
  const [portfolioImages, setPortfolioImages] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [skillsModalVisible, setSkillsModalVisible] = useState<boolean>(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  // 加载摄影师数据
  useEffect(() => {
    if (isEdit) {
      fetchPhotographerDetail();
    }
  }, [id]);

  // 获取摄影师详情
  const fetchPhotographerDetail = async () => {
    setLoading(true);
    try {
      const response = await getPhotographerDetail(Number(id));
      const data = response.data;
      
      // 设置表单数据
      form.setFieldsValue({
        ...data,
        joinDate: data.joinDate ? moment(data.joinDate) : undefined,
        contractEndDate: data.contractEndDate ? moment(data.contractEndDate) : undefined,
        studios: data.studios?.map((studio: { value: number }) => studio.value),
      });
      
      // 设置头像
      if (data.avatar) {
        setAvatarUrl(data.avatar);
      }
      
      // 设置技能
      if (data.skills && Array.isArray(data.skills)) {
        setSkills(data.skills);
      }
      
      // 设置作品集图片
      if (data.portfolio && data.portfolio.images) {
        const portfolioList = data.portfolio.images.map((url: string, index: number) => ({
          uid: `-${index + 1}`,
          name: `image-${index + 1}.jpg`,
          status: 'done' as const,
          url,
        }));
        setPortfolioImages(portfolioList);
      }
    } catch (error) {
      message.error('获取摄影师数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (values: PhotographerFormValues) => {
    // 准备提交数据
    const submitData: PhotographerFormData = {
      ...values,
      status: values.status,
      joinDate: values.joinDate?.format('YYYY-MM-DD'),
      contractEndDate: values.contractEndDate?.format('YYYY-MM-DD'),
      avatar: avatarUrl,
      skills,
      portfolio: {
        images: portfolioImages.map(img => img.url || (img.response as any)?.url),
      },
      // 将 number[] 转换为 { id: number; name: string; }[]
      studios: values.studios?.map(studioId => {
        const studio = studioOptions.find(s => s.value === studioId);
        return { id: studioId, name: studio?.label || '' };
      }),
    };
    
    setSubmitting(true);
    
    try {
      if (isEdit) {
        await updatePhotographer(Number(id), submitData);
        message.success('摄影师信息更新成功');
      } else {
        await createPhotographer(submitData);
        message.success('摄影师创建成功');
      }
      history.push('/photographer/list');
    } catch (error) {
      message.error(isEdit ? '更新摄影师信息失败' : '创建摄影师失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 取消编辑
  const handleCancel = () => {
    history.goBack();
  };

  // 处理头像上传变化
  const handleAvatarChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setAvatarLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // 获取上传后的url
      const url = info.file.response?.url || (info.file.response as any)?.data?.url;
      setAvatarUrl(url);
      setAvatarLoading(false);
    }
  };

  // 自定义上传请求
  const customRequest: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      // 这里应该调用实际的上传API
      // 模拟上传成功
      setTimeout(() => {
        onSuccess?.({
          url: URL.createObjectURL(file as Blob),
        });
      }, 1000);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  // 处理作品集图片上传
  const handlePortfolioChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setPortfolioImages(fileList);
  };

  // 预览图片
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    
    setPreviewImage(file.url || file.preview || '');
    setPreviewVisible(true);
  };

  // 添加技能
  const handleAddSkill = () => {
    interface SkillFormValues {
      name: string;
      rating: number;
    }

    skillsForm.validateFields().then((values: SkillFormValues) => {
      const newSkill: Skill = {
        name: values.name,
        rating: values.rating,
      };
      
      setSkills([...skills, newSkill]);
      setSkillsModalVisible(false);
      skillsForm.resetFields();
    });
  };

  // 删除技能
  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  return (
    <div className={styles.photographerEditPage}>
      <div className={styles.pageHeader}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleCancel}
        >
          返回
        </Button>
        <h2>{isEdit ? '编辑摄影师' : '添加摄影师'}</h2>
      </div>

      <Card>
        <Tabs activeKey={currentTab} onChange={setCurrentTab}>
          <TabPane tab="基本信息" key="basic">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                status: 'active',
                featured: false,
                level: 'junior',
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={16}>
                  <Card title="基本信息" className={styles.formSection}>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="name"
                          label="姓名"
                          rules={[{ required: true, message: '请输入姓名' }]}
                        >
                          <Input placeholder="请输入姓名" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="employeeId"
                          label="工号"
                          rules={[{ required: true, message: '请输入工号' }]}
                        >
                          <Input placeholder="请输入工号" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="phone"
                          label="手机号码"
                          rules={[
                            { required: true, message: '请输入手机号码' },
                            { pattern: /^1\d{10}$/, message: '请输入有效的手机号码' }
                          ]}
                        >
                          <Input placeholder="请输入手机号码" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="email"
                          label="电子邮箱"
                          rules={[
                            { required: true, message: '请输入电子邮箱' },
                            { type: 'email', message: '请输入有效的电子邮箱' }
                          ]}
                        >
                          <Input placeholder="请输入电子邮箱" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="level"
                          label="摄影师级别"
                          rules={[{ required: true, message: '请选择级别' }]}
                        >
                          <Select placeholder="选择级别">
                            {levelOptions.map(option => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="status"
                          label="状态"
                        >
                          <Radio.Group>
                            <Radio value="active">在职</Radio>
                            <Radio value="inactive">离职</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="joinDate"
                          label="入职日期"
                        >
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="contractEndDate"
                          label="合同到期日"
                        >
                          <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="specialties"
                      label="专业领域"
                    >
                      <TagSelect options={specialtyOptions} />
                    </Form.Item>

                    <Form.Item
                      name="studios"
                      label="可工作门店"
                      rules={[{ required: true, message: '请选择可工作门店' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="选择工作门店"
                        style={{ width: '100%' }}
                      >
                        {studioOptions.map(studio => (
                          <Option key={studio.value} value={studio.value}>
                            {studio.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="bio"
                      label="个人简介"
                    >
                      <TextArea rows={4} placeholder="请输入个人简介" />
                    </Form.Item>

                    <Form.Item
                      name="featured"
                      label="设为推荐"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Card>

                  <Card title="技能与专长" className={styles.formSection}>
                    <div className={styles.skillsList}>
                      {skills.length > 0 ? (
                        <Row gutter={[16, 16]}>
                          {skills.map((skill, index) => (
                            <Col xs={12} sm={8} md={6} key={index}>
                              <div className={styles.skillItem}>
                                <div className={styles.skillHeader}>
                                  <span>{skill.name}</span>
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveSkill(index)}
                                    size="small"
                                  />
                                </div>
                                <div className={styles.skillLevel}>
                                  <span className={styles.levelText}>技能水平: </span>
                                  <Rate disabled value={skill.rating} />
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <div className={styles.emptySkills}>
                          暂无技能，请添加
                        </div>
                      )}
                    </div>
                    <div className={styles.addSkillBtn}>
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => setSkillsModalVisible(true)}
                        style={{ width: '100%' }}
                      >
                        添加技能
                      </Button>
                    </div>
                  </Card>

                  <div className={styles.formActions}>
                    <Space>
                      <Button onClick={handleCancel}>
                        取消
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        icon={<SaveOutlined />}
                      >
                        保存
                      </Button>
                    </Space>
                  </div>
                </Col>

                <Col xs={24} md={8}>
                  <Card title="头像" className={styles.avatarSection}>
                    <div className={styles.avatarUploader}>
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleAvatarChange}
                        customRequest={customRequest}
                      >
                        {avatarUrl ? (
                          <div className={styles.avatarWrapper}>
                            <img src={avatarUrl} alt="avatar" />
                          </div>
                        ) : (
                          <div>
                            {avatarLoading ? <LoadingOutlined /> : <PlusOutlined />}
                            <div style={{ marginTop: 8 }}>上传头像</div>
                          </div>
                        )}
                      </Upload>
                    </div>
                    <div className={styles.avatarTips}>
                      推荐尺寸：200x200，支持 jpg、png 格式，文件大小不超过 2MB
                    </div>
                  </Card>

                  {isEdit && (
                    <Card title="当前状态" className={styles.statusSection}>
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>在职状态</div>
                        <div className={styles.statusValue}>
                          <Tag color={form.getFieldValue('status') === 'active' ? 'green' : 'red'}>
                            {form.getFieldValue('status') === 'active' ? '在职' : '离职'}
                          </Tag>
                        </div>
                      </div>
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>加入时间</div>
                        <div className={styles.statusValue}>
                          {form.getFieldValue('joinDate') ? form.getFieldValue('joinDate').format('YYYY-MM-DD') : '未设置'}
                        </div>
                      </div>
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>总预约数</div>
                        <div className={styles.statusValue}>
                          {form.getFieldValue('totalBookings') || 0}
                        </div>
                      </div>
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>客户评分</div>
                        <div className={styles.statusValue}>
                          {form.getFieldValue('rating') || '未评分'}
                        </div>
                      </div>
                    </Card>
                  )}
                </Col>
              </Row>
            </Form>
          </TabPane>

          <TabPane tab="作品集" key="portfolio">
            <Card title="作品集管理">
              <Upload
                listType="picture-card"
                fileList={portfolioImages}
                onChange={handlePortfolioChange}
                onPreview={handlePreview}
                customRequest={customRequest}
                beforeUpload={beforeUpload}
              >
                {portfolioImages.length >= 20 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                )}
              </Upload>
              <Modal
                visible={previewVisible}
                title="图片预览"
                footer={null}
                onCancel={() => setPreviewVisible(false)}
              >
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>
              
              <div className={styles.portfolioActions}>
                <Space>
                  <Button onClick={handleCancel}>
                    取消
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => handleSubmit(form.getFieldsValue())}
                    loading={submitting}
                  >
                    保存作品集
                  </Button>
                </Space>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* 添加技能模态框 */}
      <Modal
        title="添加技能"
        visible={skillsModalVisible}
        onCancel={() => setSkillsModalVisible(false)}
        onOk={handleAddSkill}
        destroyOnClose
      >
        <Form
          form={skillsForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="技能名称"
            rules={[{ required: true, message: '请输入技能名称' }]}
          >
            <Input placeholder="例如：人像摄影、后期修图" />
          </Form.Item>
          <Form.Item
            name="rating"
            label="技能水平"
            rules={[{ required: true, message: '请选择技能水平' }]}
            initialValue={3}
          >
            <Rate />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PhotographerEdit;
