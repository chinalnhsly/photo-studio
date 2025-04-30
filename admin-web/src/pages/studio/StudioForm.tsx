import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Input,
  Button,
  Row,
  Col,
  Spin,
  message,
  Space,
  Switch,
  InputNumber,
  Typography,
  Upload,
  Select,
  Divider
} from 'antd';

import type { 
  UploadFile, 
  UploadChangeParam,
  UploadProps,
  RcFile
} from 'antd/lib/upload/interface';

import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { history, useParams } from 'umi';
import moment from 'moment';
import {
  getStudioById as getStudioDetail,
  createStudio,
  updateStudio
} from '../../services/studio';
import './StudioForm.scss';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

interface StudioFormProps {
  isEdit?: boolean;
}

// 定义表单值类型
interface StudioFormValues {
  name: string;
  address: string;
  area: number;
  capacity: number;
  description?: string;
  hourlyRate: number;
  dayRate: number;
  priceDescription?: string;
  equipments: string[];
  equipmentNotes?: string;
  status: boolean;
  openingHours?: string;
  amenities?: string;
  notes?: string;
  [key: string]: any;
}

const StudioForm: React.FC<StudioFormProps> = ({ isEdit }) => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);

  // 常用工作室设备选项
  const equipmentOptions = [
    '专业灯光', '反光板', '柔光箱', '摄影背景', '拍摄道具', 
    '化妆台', '化妆镜', '更衣室', '空调', '音响系统',
    '冰箱', '饮水机', '休息区', '电风扇', '无线WiFi',
    '专业闪光灯', '打印机', '拍摄台'
  ];

  useEffect(() => {
    if (isEdit && id) {
      fetchStudioData();
    }
  }, [isEdit, id]);

  // 获取工作室数据（编辑模式）
  const fetchStudioData = async () => {
    setLoading(true);
    try {
      const response = await getStudioDetail(Number(id));
      const data = response.data;
      
      // 设置表单值
      form.setFieldsValue({
        ...data,
        equipments: data.equipments || [],
      });
      
      // 设置图片列表和特色图片
      if (data.images && data.images.length > 0) {
        const images = data.images.map((url: string, index: number) => ({
          uid: `-${index + 1}`,
          name: `图片-${index + 1}`,
          status: 'done',
          url,
        }));
        setImageList(images);
        
        // 确定特色图片索引
        if (data.featuredImage) {
          const featuredIndex = data.images.findIndex((url: string) => url === data.featuredImage);
          if (featuredIndex !== -1) {
            setFeaturedImageIndex(featuredIndex);
          }
        }
      }
    } catch (error) {
      message.error('获取工作室信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理图片上传
  const handleUploadChange = ({ fileList }: UploadChangeParam<UploadFile>) => {
    setImageList(fileList);
    
    // 如果当前特色图片被删除了，重置为第一张图片
    if (featuredImageIndex >= fileList.length && fileList.length > 0) {
      setFeaturedImageIndex(0);
    }
  };

  // 处理自定义上传
  const handleCustomUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    try {
      // 如果在编辑模式下已有图片，先保存文件对象以便后续处理
      if (isEdit) {
        setImageList(prev => [...prev, file]);
        onSuccess("ok", file);
        return;
      }

      // 模拟上传成功
      setTimeout(() => {
        message.success(`${file.name} 上传成功`);
        onSuccess("ok", file);
      }, 1000);
    } catch (error) {
      message.error(`${file.name} 上传失败`);
      onError(error as Error);
    }
  };

  // 设置特色图片
  const handleSetFeatured = (index: number) => {
    setFeaturedImageIndex(index);
  };

  // 表单提交处理
  const handleSubmit = async (values: StudioFormValues) => {
    // 至少需要一张图片
    if (imageList.length === 0) {
      message.error('请至少上传一张工作室图片');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 准备图片数据
      const images = imageList.map(image => image.url || (image.response && image.response.data.url)).filter(Boolean);
      const featuredImage = images[featuredImageIndex];
      
      // 提交数据
      const submitData = {
        ...values,
        images,
        featuredImage,
      };
      
      if (isEdit && id) {
        await updateStudio(Number(id), submitData);
        message.success('工作室信息已更新');
      } else {
        const result = await createStudio(submitData);
        message.success('工作室添加成功');
        // 跳转到编辑页
        history.replace(`/studio/edit/${result.data.id}`);
        return;
      }
      
      // 如果是编辑模式，返回详情页
      if (isEdit && id) {
        history.push(`/studio/detail/${id}`);
      }
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="studio-form-page">
      <Card
        title={
          <div className="page-title">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => history.goBack()}
            >
              返回
            </Button>
            <span>{isEdit ? '编辑工作室' : '新增工作室'}</span>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: true,
              capacity: 5,
              area: 50,
              hourlyRate: 100,
              dayRate: 800,
              equipments: [],
            }}
          >
            <Row gutter={24}>
              {/* 左侧 - 基本信息 */}
              <Col xs={24} md={16}>
                {/* 基本信息 */}
                <Card title="基本信息" className="form-section-card">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="name"
                        label="工作室名称"
                        rules={[{ required: true, message: '请输入工作室名称' }]}
                      >
                        <Input placeholder="请输入工作室名称" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="address"
                        label="地址"
                        rules={[{ required: true, message: '请输入工作室地址' }]}
                      >
                        <Input placeholder="请输入工作室详细地址" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="area"
                        label="面积(平方米)"
                        rules={[{ required: true, message: '请输入工作室面积' }]}
                      >
                        <InputNumber min={1} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="capacity"
                        label="容纳人数"
                        rules={[{ required: true, message: '请输入容纳人数' }]}
                      >
                        <InputNumber min={1} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="description"
                    label="工作室描述"
                  >
                    <TextArea rows={4} placeholder="请输入工作室详细描述" />
                  </Form.Item>
                </Card>
                
                {/* 价格信息 */}
                <Card title="价格信息" className="form-section-card">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="hourlyRate"
                        label="小时价格(元)"
                        rules={[{ required: true, message: '请输入小时价格' }]}
                      >
                        <InputNumber 
                          min={0} 
                          step={10} 
                          precision={2}
                          style={{ width: '100%' }} 
                          prefix="¥"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="dayRate"
                        label="全天价格(元)"
                        rules={[{ required: true, message: '请输入全天价格' }]}
                      >
                        <InputNumber 
                          min={0} 
                          step={100} 
                          precision={2}
                          style={{ width: '100%' }} 
                          prefix="¥"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="priceDescription"
                    label="价格说明"
                  >
                    <TextArea rows={3} placeholder="价格详细说明，如额外收费项目等" />
                  </Form.Item>
                </Card>
                
                {/* 设备信息 */}
                <Card title="设备信息" className="form-section-card">
                  <Form.Item
                    name="equipments"
                    label="可用设备"
                    rules={[{ required: true, message: '请至少选择一项设备' }]}
                  >
                    <Select 
                      mode="multiple" 
                      placeholder="选择工作室可用设备"
                      maxTagCount={10}
                      dropdownRender={(menu: React.ReactNode) => (
                        <div>
                          {menu}
                          <Divider style={{ margin: '8px 0' }} />
                          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: '8px' }}>
                            <Input
                              style={{ flex: 'auto' }}
                              placeholder="输入自定义设备"
                              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const input = e.target as HTMLInputElement;
                                  const customEquipment = input.value.trim();
                                  if (customEquipment) {
                                    const currentEquipments = form.getFieldValue('equipments') || [];
                                    if (!currentEquipments.includes(customEquipment)) {
                                      form.setFieldsValue({
                                        equipments: [...currentEquipments, customEquipment]
                                      });
                                    }
                                    input.value = '';
                                  }
                                }
                              }}
                            />
                            <a
                              style={{ flex: 'none', padding: '8px', display: 'block' }}
                              onClick={() => {
                                const input = document.querySelector('.ant-select-dropdown input') as HTMLInputElement;
                                const customEquipment = input?.value.trim();
                                if (customEquipment) {
                                  const currentEquipments = form.getFieldValue('equipments') || [];
                                  if (!currentEquipments.includes(customEquipment)) {
                                    form.setFieldsValue({
                                      equipments: [...currentEquipments, customEquipment]
                                    });
                                  }
                                  input.value = '';
                                }
                              }}
                            >
                              <PlusOutlined /> 添加
                            </a>
                          </div>
                        </div>
                      )}
                    >
                      {equipmentOptions.map(option => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    name="equipmentNotes"
                    label="设备说明"
                  >
                    <TextArea rows={3} placeholder="设备使用说明或注意事项" />
                  </Form.Item>
                </Card>
              </Col>
              
              {/* 右侧 - 图片上传和状态控制 */}
              <Col xs={24} md={8}>
                {/* 状态控制 */}
                <Card title="状态设置" className="form-section-card">
                  <Form.Item
                    name="status"
                    valuePropName="checked"
                    label="工作室状态"
                  >
                    <Switch checkedChildren="启用" unCheckedChildren="停用" />
                  </Form.Item>
                  <div className="status-note">
                    停用后该工作室将不可被预约
                  </div>
                </Card>
                
                {/* 图片上传 */}
                <Card title="工作室图片" className="form-section-card">
                  <div className="upload-hint">
                    请上传工作室照片，第一张将作为封面图
                  </div>
                  
                  <Upload
                    listType="picture-card"
                    fileList={imageList}
                    customRequest={handleCustomUpload}
                    onChange={handleUploadChange}
                    multiple
                    className="studio-uploader"
                  >
                    {imageList.length >= 8 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                      </div>
                    )}
                  </Upload>
                  
                  <Divider style={{ margin: '16px 0' }} />
                  
                  <div className="featured-image-selector">
                    <div className="section-subtitle">选择特色图片（封面图）</div>
                    
                    {imageList.length > 0 ? (
                      <div className="thumbnail-list">
                        {imageList.map((image, index) => {
                          const url = image.url || (image.response && image.response.data && image.response.data.url);
                          return url ? (
                            <div 
                              key={image.uid} 
                              className={`thumbnail-item ${index === featuredImageIndex ? 'selected' : ''}`}
                              onClick={() => handleSetFeatured(index)}
                            >
                              <img src={url} alt={`图片${index+1}`} />
                              {index === featuredImageIndex && (
                                <div className="selected-badge">
                                  <span>封面</span>
                                </div>
                              )}
                            </div>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <div className="no-images">
                        <PictureOutlined />
                        <p>还没有上传图片</p>
                      </div>
                    )}
                  </div>
                </Card>
                
                {/* 其他信息 */}
                <Card title="其他信息" className="form-section-card">
                  <Form.Item
                    name="openingHours"
                    label="开放时间"
                  >
                    <Input placeholder="如：周一至周五 9:00-21:00" />
                  </Form.Item>
                  
                  <Form.Item
                    name="amenities"
                    label="配套设施"
                  >
                    <Input placeholder="如：停车场、休息区" />
                  </Form.Item>
                  
                  <Form.Item
                    name="notes"
                    label="特别说明"
                  >
                    <TextArea rows={3} placeholder="任何需要客户了解的特别说明" />
                  </Form.Item>
                </Card>
              </Col>
            </Row>
            
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
                  {isEdit ? '保存修改' : '添加工作室'}
                </Button>
              </Space>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default StudioForm;
