import React, { useState, useEffect } from 'react';
import { useParams, history } from 'umi';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Upload,
  Switch,
  TimePicker,
  Row,
  Col,
  message,
  Space,
  Modal,
  Tabs,
  Typography,
  Divider,
  Checkbox,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
  SaveOutlined as SaveIcon,
  DeleteOutlined,
  ExclamationCircleOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { 
  getStudioById, 
  createStudio, 
  updateStudio, 
  getStudioFacilities,
  updateStudioFacilities,
  getStudioBusinessHours,
  updateStudioBusinessHours,
  type BusinessHours
} from '../../services/studio';
import { getPhotographerList } from '../../services/photographer';
import './StudioEdit.scss';

import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import moment from 'moment';
type Moment = moment.Moment;

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const { confirm } = Modal;

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

interface Photographer {
  id: number;
  name: string;
  title?: string;
}

interface Facility {
  id: number;
  name: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

const StudioEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const isEditing = !!id;

  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [coverImage, setCoverImage] = useState<UploadFile[]>([]);
  const [galleryImages, setGalleryImages] = useState<UploadFile[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    saturday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' },
  });

  // 初始化数据
  useEffect(() => {
    fetchPhotographers();
    fetchFacilities();

    if (isEditing) {
      fetchStudioData();
      fetchBusinessHours();
    }
  }, [id]);

  // 获取摄影师列表
  const fetchPhotographers = async () => {
    try {
      const response = await getPhotographerList();
      setPhotographers(response.data.items);
    } catch (error) {
      console.error('获取摄影师列表失败:', error);
      message.error('获取摄影师列表失败');
    }
  };

  // 获取设施列表
  const fetchFacilities = async () => {
    try {
      const response = await getStudioFacilities(isEditing ? Number(id) : 0);
      setFacilities(response.data.facilities || []);
      if (isEditing) {
        setSelectedFacilities(response.data.studioFacilities || []);
      }
    } catch (error) {
      console.error('获取设施列表失败:', error);
      message.error('获取设施列表失败');
    }
  };

  // 获取工作室数据
  const fetchStudioData = async () => {
    try {
      setLoading(true);
      const response = await getStudioById(Number(id));
      const studioData = response.data;

      // 设置表单初始值
      form.setFieldsValue({
        name: studioData.name,
        address: studioData.address,
        size: studioData.size,
        phone: studioData.phone,
        email: studioData.email,
        capacity: studioData.capacity,
        description: studioData.description,
        photographerIds: studioData.photographers?.map((p: Photographer) => p.id) || [],
        isActive: studioData.isActive,
      });

      // 设置封面图片
      if (studioData.coverImage) {
        setCoverImage([
          {
            uid: '-1',
            name: 'cover.jpg',
            status: 'done',
            url: studioData.coverImage,
          },
        ]);
      }

      // 设置画廊图片
      if (studioData.galleryImages && studioData.galleryImages.length > 0) {
        const galleryFiles = studioData.galleryImages.map((url: string, index: number) => ({
          uid: `-${index}`,
          name: `gallery-${index}.jpg`,
          status: 'done',
          url,
        }));
        setGalleryImages(galleryFiles);
      }
    } catch (error) {
      console.error('获取工作室数据失败:', error);
      message.error('获取工作室数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取营业时间
  const fetchBusinessHours = async () => {
    try {
      const response = await getStudioBusinessHours(Number(id));
      setBusinessHours(response.data.businessHours || businessHours);
    } catch (error) {
      console.error('获取营业时间失败:', error);
      message.error('获取营业时间失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // 整合表单数据
      const submitData = {
        ...values,
        coverImage: coverImage[0]?.url || coverImage[0]?.response?.url,
        galleryImages: galleryImages.map(file => file.url || file.response?.url),
      };

      let studioId: number;
      if (isEditing) {
        await updateStudio(Number(id), submitData);
        message.success('工作室更新成功');
        studioId = Number(id);
      } else {
        const response = await createStudio(submitData) as ApiResponse<{id: number}>;
        message.success('工作室创建成功');
        studioId = response.data.id;
      }

      // 保存设施数据
      await updateStudioFacilities(studioId, selectedFacilities);

      // 保存营业时间
      await updateStudioBusinessHours(studioId, businessHours);

      // 返回列表页
      history.push('/studio/list');
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('保存失败，请检查表单数据');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    confirm({
      title: '确定要取消编辑吗?',
      icon: <ExclamationCircleOutlined />,
      content: '取消后已编辑的内容将不会保存',
      onOk() {
        history.push('/studio/list');
      },
      okText: '确定',
      cancelText: '继续编辑',
    });
  };

  // 处理封面图片上传变更
  const handleCoverChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setCoverImage(fileList);
  };

  // 处理画廊图片上传变更
  const handleGalleryChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setGalleryImages(fileList);
  };

  // 处理设施选择变更
  const handleFacilityChange = (facilityId: number, checked: boolean) => {
    if (checked) {
      setSelectedFacilities([...selectedFacilities, facilityId]);
    } else {
      setSelectedFacilities(selectedFacilities.filter(id => id !== facilityId));
    }
  };

  // 处理营业时间变更
  const handleBusinessHoursChange = (day: string, field: string, value: boolean | Moment | string | null) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [field]: typeof value === 'boolean' ? value : 
                 value && typeof value === 'object' && 'format' in value ? value.format('HH:mm') : 
                 value || '09:00'
      }
    });
  };

  // 统一的上传按钮组件
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  // 上传组件通用属性
  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片必须小于5MB!');
      }
      return isImage && isLt5M;
    },
  };

  return (
    <div className="studio-edit-page">
      <Card
        title={
          <div className="page-header">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="back-button"
            >
              返回列表
            </Button>
            <span className="page-title">{isEditing ? '编辑工作室' : '新增工作室'}</span>
          </div>
        }
        loading={loading}
        extra={
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button
              type="primary"
              icon={<SaveIcon />}
              loading={submitting}
              onClick={handleSubmit}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Tabs 
          defaultActiveKey="1"
          items={[
            {
              label: '基本信息',
              key: '1',
              children: (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{
                    isActive: true,
                    size: 'medium'
                  }}
                >
                  <Row gutter={24}>
                    <Col xs={24} lg={16}>
                      <Card title="工作室信息" className="form-section">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="name"
                              label="工作室名称"
                              rules={[{ required: true, message: '请输入工作室名称' }]}
                            >
                              <Input placeholder="请输入工作室名称" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="size"
                              label="规模"
                              rules={[{ required: true, message: '请选择工作室规模' }]}
                            >
                              <Select placeholder="请选择规模">
                                <Option value="small">小型</Option>
                                <Option value="medium">中型</Option>
                                <Option value="large">大型</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name="address"
                          label="地址"
                          rules={[{ required: true, message: '请输入工作室地址' }]}
                        >
                          <Input placeholder="请输入详细地址" />
                        </Form.Item>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name="phone"
                              label="联系电话"
                              rules={[{ required: true, message: '请输入联系电话' }]}
                            >
                              <Input placeholder="请输入联系电话" />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name="email"
                              label="电子邮箱"
                            >
                              <Input placeholder="请输入电子邮箱" />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          name="capacity"
                          label="最大容纳人数"
                          rules={[{ required: true, message: '请输入最大容纳人数' }]}
                        >
                          <InputNumber min={1} style={{ width: '100%' }} placeholder="输入数字" />
                        </Form.Item>

                        <Form.Item
                          name="description"
                          label="工作室简介"
                        >
                          <TextArea rows={4} placeholder="请输入工作室简介" />
                        </Form.Item>

                        <Form.Item
                          name="isActive"
                          label="营业状态"
                          valuePropName="checked"
                        >
                          <Switch checkedChildren="营业中" unCheckedChildren="已停业" />
                        </Form.Item>
                      </Card>

                      <Card title="工作室摄影师" className="form-section">
                        <Form.Item
                          name="photographerIds"
                          label="分配摄影师"
                        >
                          <Select
                            mode="multiple"
                            placeholder="选择摄影师"
                            optionFilterProp="children"
                            style={{ width: '100%' }}
                          >
                            {photographers.map(photographer => (
                              <Option key={photographer.id} value={photographer.id}>
                                {photographer.name} ({photographer.title})
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                      <Card title="封面图片" className="form-section">
                        <Upload
                          {...uploadProps}
                          listType="picture-card"
                          fileList={coverImage}
                          onChange={handleCoverChange}
                          maxCount={1}
                        >
                          {coverImage.length >= 1 ? null : uploadButton}
                        </Upload>
                        <div className="upload-hint">
                          推荐尺寸：800 x 600 像素，图片大小不超过 5MB
                        </div>
                      </Card>

                      <Card title="设施设备" className="form-section">
                        <div className="facilities-container">
                          {facilities.map(facility => (
                            <div key={facility.id} className="facility-item">
                              <Checkbox
                                checked={selectedFacilities.includes(facility.id)}
                                onChange={(e: CheckboxChangeEvent) => handleFacilityChange(facility.id, e.target.checked)}
                              >
                                {facility.name}
                              </Checkbox>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </Form>
              )
            },
            {
              label: '营业时间',
              key: '2',
              children: (
                <Card title="营业时间设置" className="business-hours-card">
                  {Object.keys(businessHours).map((day, index) => (
                    <div key={day} className="business-hours-item">
                      <div className="day-label">
                        <Checkbox
                          checked={businessHours[day].isOpen}
                          onChange={(e: CheckboxChangeEvent) => handleBusinessHoursChange(day, 'isOpen', e.target.checked)}
                        >
                          {weekDays[index]}
                        </Checkbox>
                      </div>
                      <div className="time-picker">
                        <TimePicker
                          format="HH:mm"
                          value={moment(businessHours[day].openTime, 'HH:mm') as any}
                          onChange={(time: Moment | null) => handleBusinessHoursChange(day, 'openTime', time)}
                          disabled={!businessHours[day].isOpen}
                        />
                        <span className="time-separator">至</span>
                        <TimePicker
                          format="HH:mm"
                          value={moment(businessHours[day].closeTime, 'HH:mm') as any}
                          onChange={(time: Moment | null) => handleBusinessHoursChange(day, 'closeTime', time)}
                          disabled={!businessHours[day].isOpen}
                        />
                      </div>
                    </div>
                  ))}
                </Card>
              )
            },
            {
              label: '图库',
              key: '3',
              children: (
                <Card title="工作室图库" className="form-section">
                  <Upload
                    {...uploadProps}
                    listType="picture-card"
                    fileList={galleryImages}
                    onChange={handleGalleryChange}
                    multiple
                  >
                    {galleryImages.length >= 10 ? null : uploadButton}
                  </Upload>
                  <div className="upload-hint">
                    最多上传 10 张图片，推荐尺寸：1200 x 800 像素，图片大小不超过 5MB
                  </div>
                </Card>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default StudioEdit;
