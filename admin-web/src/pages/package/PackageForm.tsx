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
  Divider,
  Checkbox
} from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { useParams, history } from 'umi';
import type { RcFile } from 'antd/lib/upload';
import {
  getPackageDetail,
  createPackage,
  updatePackage,
  uploadPackageImages
} from '../../services/package';
import './PackageForm.scss';
import { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

// 自定义上传选项接口
interface CustomUploadOptions {
  file: RcFile;
  onSuccess: (response: any, file: RcFile) => void;
  onError: (error: any) => void;
  onProgress?: (event: { percent: number }) => void;
}

interface PackageFormProps {
  isEdit?: boolean;
}

const PackageForm: React.FC<PackageFormProps> = ({ isEdit }) => {
  const { id } = useParams<{ id?: string }>();
  //const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imageList, setImageList] = useState<any[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  // 套餐分类选项
  const categoryOptions = [
    '婚纱摄影', 
    '个人写真', 
    '儿童摄影', 
    '全家福',
    '商业摄影',
    '孕妇照',
    '情侣写真',
    '毕业照',
    '宠物写真',
    '闺蜜写真',
    '证件照'
  ];
  
  // 特色服务选项
  const featureOptions = [
    '免费化妆', 
    '提供服装', 
    '包邮寄',
    '赠送相册', 
    '赠送相框',
    '提供发型设计',
    '赠送精修电子档',
    '免费接送',
    '贴心伴拍服务',
    '精致妆容',
    '后期精修',
    '入册服务',
    '原片全送',
    '多场景拍摄',
    '无限电子档',
    '亲友陪拍免费'
  ];

  useEffect(() => {
    if (isEdit && id) {
      fetchPackageData();
    }
  }, [isEdit, id]);

  // 获取套餐数据（编辑模式）
  const fetchPackageData = async () => {
    setLoading(true);
    try {
      const response = await getPackageDetail(Number(id));
      const data = response.data;
      
      // 设置表单值
      form.setFieldsValue({
        ...data,
        features: (data as any).features || [],
      });
      
      // 设置图片列表和封面图
      if (data.images && data.images.length > 0) {
        const images = data.images.map((url: string, index: number) => ({
          uid: `-${index + 1}`,
          name: `图片-${index + 1}`,
          status: 'done',
          url,
        }));
        setImageList(images);
        
        // 确定封面图索引
        if (data.coverImage) {
          const coverIndex = data.images.findIndex((url: string) => url === data.coverImage);
          if (coverIndex !== -1) {
            setCoverImageIndex(coverIndex);
          }
        }
      }
    } catch (error) {
      message.error('获取套餐信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理图片上传
  const handleUploadChange = ({ fileList }: UploadChangeParam<UploadFile>) => {
    setImageList(fileList);
    
    // 如果当前封面图被删除了，重置为第一张图片
    if (coverImageIndex >= fileList.length && fileList.length > 0) {
      setCoverImageIndex(0);
    }
  };

  // 处理自定义上传
  const handleCustomUpload = async (options: CustomUploadOptions) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      let response;
      
      if (isEdit && id) {
        response = await uploadPackageImages(Number(id), formData);
      } else {
        // 临时上传API模拟
        response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({ data: { url: URL.createObjectURL(file) } });
          }, 1000);
        });
      }
      
      onSuccess(response, file);
    } catch (error) {
      onError(error);
      message.error('图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 设置封面图
  const handleSetCover = (index: number) => {
    setCoverImageIndex(index);
  };

  // 表单提交处理
  const handleSubmit = async (values: any) => {
    // 至少需要一张图片
    if (imageList.length === 0) {
      message.error('请至少上传一张套餐图片');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // 准备图片数据
      const images = imageList.map(image => image.url || (image.response && image.response.data.url)).filter(Boolean);
      const coverImage = images[coverImageIndex];
      
      // 提交数据
      const submitData = {
        ...values,
        images,
        coverImage,
        // 确保价格是数字
        price: Number(values.price),
        originalPrice: values.originalPrice ? Number(values.originalPrice) : undefined,
      };
      
      if (isEdit && id) {
        await updatePackage(Number(id), submitData);
        message.success('套餐信息已更新');
      } else {
        const result = await createPackage(submitData);
        message.success('套餐添加成功');
        // 跳转到编辑页
        history.replace(`/package/edit/${result.data.id}`);
        return;
      }
      
      // 如果是编辑模式，返回详情页
      if (isEdit && id) {
        history.push(`/package/detail/${id}`);
      }
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="package-form-page">
      <Card
        title={
          <div className="page-title">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => history.goBack()}
            >
              返回
            </Button>
            <span>{isEdit ? '编辑套餐' : '新增套餐'}</span>
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
              category: '个人写真',
              features: [],
              outfits: 2,
              shoots: 3,
              duration: 2,
              digitalPhotos: 20,
              printedPhotos: 5,
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
                        label="套餐名称"
                        rules={[{ required: true, message: '请输入套餐名称' }]}
                      >
                        <Input placeholder="请输入套餐名称" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="category"
                        label="套餐分类"
                        rules={[{ required: true, message: '请选择套餐分类' }]}
                      >
                        <Select placeholder="请选择套餐分类">
                          {categoryOptions.map(option => (
                            <Option key={option} value={option}>
                              {option}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="level"
                        label="套餐等级"
                      >
                        <Select placeholder="请选择套餐等级">
                          <Option value="基础">基础</Option>
                          <Option value="标准">标准</Option>
                          <Option value="高级">高级</Option>
                          <Option value="豪华">豪华</Option>
                          <Option value="定制">定制</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="description"
                    label="套餐描述"
                    rules={[{ required: true, message: '请输入套餐描述' }]}
                  >
                    <TextArea rows={4} placeholder="请输入套餐详细描述" />
                  </Form.Item>
                </Card>
                
                {/* 价格信息 */}
                <Card title="价格信息" className="form-section-card">
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="price"
                        label="售价(元)"
                        rules={[{ required: true, message: '请输入售价' }]}
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
                        name="originalPrice"
                        label="原价(元)"
                      >
                        <InputNumber 
                          min={0} 
                          step={10} 
                          precision={2}
                          style={{ width: '100%' }} 
                          prefix="¥"
                          placeholder="如有折扣,请填写原价"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="priceDescription"
                        label="价格说明"
                      >
                        <TextArea rows={2} placeholder="价格包含内容或其他价格相关说明" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                
                {/* 套餐内容 */}
                <Card title="套餐内容" className="form-section-card">
                  <Row gutter={16}>
                    <Col xs={12} sm={6}>
                      <Form.Item
                        name="outfits"
                        label="服装套数"
                        rules={[{ required: true, message: '请输入服装套数' }]}
                      >
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item
                        name="shoots"
                        label="拍摄场景数"
                        rules={[{ required: true, message: '请输入拍摄场景数' }]}
                      >
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item
                        name="duration"
                        label="拍摄时长(小时)"
                        rules={[{ required: true, message: '请输入拍摄时长' }]}
                      >
                        <InputNumber min={0} step={0.5} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item
                        name="locations"
                        label="场馆数量"
                      >
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col xs={12} sm={6}>
                      <Form.Item
                        name="digitalPhotos"
                        label="精修电子照片数"
                        rules={[{ required: true, message: '请输入精修电子照片数' }]}
                      >
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Item
                        name="printedPhotos"
                        label="冲印照片数"
                      >
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12}>
                      <Form.Item
                        name="makeupService"
                        label="化妆服务"
                      >
                        <Select placeholder="请选择化妆服务类型">
                          <Option value="无">无</Option>
                          <Option value="基础妆容">基础妆容</Option>
                          <Option value="高级妆容">高级妆容</Option>
                          <Option value="多次造型">多次造型</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="contentDescription"
                    label="详细内容描述"
                  >
                    <TextArea rows={3} placeholder="套餐详细内容描述" />
                  </Form.Item>
                  
                  {/* 套餐内服务项目 */}
                  <Form.List name="services">
                    {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                      <>
                        <div className="form-list-header">
                          <Title level={5}>套餐服务项目</Title>
                          <Button 
                            type="dashed" 
                            onClick={() => add({ name: '', description: '' })} 
                            icon={<PlusOutlined />}
                          >
                            添加服务项目
                          </Button>
                        </div>
                        
                        {fields.map((field) => (
                          <div key={field.key} className="service-item">
                            <Row gutter={16} align="middle">
                              <Col xs={24} sm={6}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'name']}
                                  fieldKey={[field.fieldKey, 'name']}
                                  label="项目名称"
                                  rules={[{ required: true, message: '请输入项目名称' }]}
                                >
                                  <Input placeholder="如:造型设计" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={16}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, 'description']}
                                  fieldKey={[field.fieldKey, 'description']}
                                  label="项目描述"
                                >
                                  <Input placeholder="项目描述" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={2}>
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
                
                {/* 特色服务 */}
                <Card title="特色服务" className="form-section-card">
                  <Form.Item
                    name="features"
                    label="服务特色"
                  >
                    <Checkbox.Group className="feature-checkbox-group">
                      {featureOptions.map(option => (
                        <Checkbox value={option} key={option}>
                          {option}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </Form.Item>
                  
                  <Form.Item
                    name="customFeatures"
                    label="自定义特色"
                  >
                    <Select 
                      mode="tags" 
                      placeholder="添加自定义特色服务（输入后回车添加）"
                      tokenSeparators={[',']}
                    />
                  </Form.Item>
                </Card>
              </Col>
              
              {/* 右侧 - 图片上传和状态控制 */}
              <Col xs={24} md={8}>
                {/* 状态控制 */}
                <Card title="套餐状态" className="form-section-card">
                  <Form.Item
                    name="status"
                    valuePropName="checked"
                    label="上架状态"
                  >
                    <Switch checkedChildren="上架" unCheckedChildren="下架" />
                  </Form.Item>
                  <div className="status-note">
                    下架后该套餐将不在客户端显示
                  </div>
                  
                  <Divider style={{ margin: '16px 0' }} />
                  
                  <Form.Item
                    name="isRecommended"
                    valuePropName="checked"
                    label="是否推荐"
                  >
                    <Switch checkedChildren="是" unCheckedChildren="否" />
                  </Form.Item>
                  
                  <Form.Item
                    name="isPopular"
                    valuePropName="checked"
                    label="是否热门"
                  >
                    <Switch checkedChildren="是" unCheckedChildren="否" />
                  </Form.Item>
                  
                  <Form.Item
                    name="isNew"
                    valuePropName="checked"
                    label="是否新品"
                  >
                    <Switch checkedChildren="是" unCheckedChildren="否" />
                  </Form.Item>
                </Card>
                
                {/* 图片上传 */}
                <Card title="套餐图片" className="form-section-card">
                  <div className="upload-hint">
                    请上传套餐展示图片，第一张将作为封面图
                  </div>
                  
                  <Upload
                    listType="picture-card"
                    fileList={imageList}
                    customRequest={handleCustomUpload}
                    onChange={handleUploadChange}
                    multiple
                    className="package-uploader"
                  >
                    {imageList.length >= 8 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                      </div>
                    )}
                  </Upload>
                  
                  <Divider style={{ margin: '16px 0' }} />
                  
                  <div className="cover-image-selector">
                    <div className="section-subtitle">选择封面图</div>
                    
                    {imageList.length > 0 ? (
                      <div className="thumbnail-list">
                        {imageList.map((image, index) => {
                          const url = image.url || (image.response && image.response.data && image.response.data.url);
                          return url ? (
                            <div 
                              key={image.uid} 
                              className={`thumbnail-item ${index === coverImageIndex ? 'selected' : ''}`}
                              onClick={() => handleSetCover(index)}
                            >
                              <img src={url} alt={`图片${index+1}`} />
                              {index === coverImageIndex && (
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
                    name="validDays"
                    label="有效期(天)"
                    tooltip="套餐购买后的有效使用期限，0表示无限期"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="0表示永久有效" />
                  </Form.Item>
                  
                  <Form.Item
                    name="useNotice"
                    label="使用须知"
                  >
                    <TextArea rows={3} placeholder="套餐使用的特别说明" />
                  </Form.Item>
                  
                  <Form.Item
                    name="refundPolicy"
                    label="退款政策"
                  >
                    <TextArea rows={3} placeholder="退款相关规定" />
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
                  {isEdit ? '保存修改' : '添加套餐'}
                </Button>
              </Space>
            </div>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default PackageForm;