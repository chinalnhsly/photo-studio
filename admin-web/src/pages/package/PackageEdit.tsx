import React, { useState, useEffect } from 'react';
import { 
  Form, Input, InputNumber, Select, Switch, Upload, message,
  Button, Card, Space, Divider, Spin, Row, Col,
  Alert
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, LoadingOutlined, InboxOutlined } from '@ant-design/icons';
// 修改导入，从兼容层导入 history
import { useParams } from 'umi';
import { history } from '../../utils/compatibility';
import './PackageEdit.less';

const { Option } = Select;
const { TextArea } = Input;

// 套餐状态映射
const packageStatusOptions = [
  { value: 'active', label: '已上架' },
  { value: 'inactive', label: '已下架' },
  { value: 'soldout', label: '已售罄' },
  { value: 'coming', label: '即将推出' },
];

// 套餐分类选项（实际项目中应该从API获取）
const categoryOptions = [
  { value: '婚纱摄影', label: '婚纱摄影' },
  { value: '儿童摄影', label: '儿童摄影' },
  { value: '全家福', label: '全家福' },
  { value: '孕妇照', label: '孕妇照' },
  { value: '写真', label: '写真' },
  { value: '证件照', label: '证件照' },
  { value: '商业摄影', label: '商业摄影' },
];

// 摄影师选项（实际项目中应该从API获取）
const photographerOptions = [
  { value: '1', label: '李摄影' },
  { value: '2', label: '张摄影' },
  { value: '3', label: '王摄影' },
];

const PackageEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(!!id);
  const [coverFile, setCoverFile] = useState<any>(null);
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<any[]>([]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [packageData, setPackageData] = useState<any>(null);

  // 加载套餐数据
  useEffect(() => {
    if (id) {
      fetchPackageData();
    }
  }, [id]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      // 实际项目中应该调用API获取数据
      // const response = await api.package.detail(id);
      // const data = response.data;
      
      // 使用模拟数据
      setTimeout(() => {
        const data = mockPackageData;
        setPackageData(data);
        form.setFieldsValue({
          name: data.name,
          price: data.price,
          originalPrice: data.originalPrice,
          category: data.category,
          status: data.status,
          description: data.description,
          features: data.features,
          photographerId: data.photographer?.id,
          recommendIndex: data.recommendIndex || 0,
          isHot: data.isHot || false,
        });
        setCoverUrl(data.cover);
        setGalleryUrls(data.gallery || []);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('获取套餐数据失败');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      // 处理封面和画廊图片的上传
      let coverImageUrl = coverUrl;
      if (coverFile) {
        // 实际项目中应该上传文件到服务器
        // const uploadResult = await uploadFile(coverFile);
        // coverImageUrl = uploadResult.url;
        
        // 模拟上传成功
        coverImageUrl = URL.createObjectURL(coverFile);
      }
      
      let galleryImages = [...galleryUrls];
      if (galleryFiles.length > 0) {
        // 实际项目中应该批量上传文件到服务器
        // const uploadResults = await Promise.all(galleryFiles.map(file => uploadFile(file)));
        // const newGalleryUrls = uploadResults.map(result => result.url);
        
        // 模拟上传成功
        const newGalleryUrls = galleryFiles.map(file => URL.createObjectURL(file));
        galleryImages = [...galleryUrls, ...newGalleryUrls];
      }
      
      const packageData = {
        ...values,
        cover: coverImageUrl,
        gallery: galleryImages,
      };
      
      // 实际项目中应该调用API保存数据
      if (isEdit) {
        // await api.package.update(id, packageData);
        message.success('套餐更新成功');
      } else {
        // await api.package.create(packageData);
        message.success('套餐创建成功');
      }
      
      // 模拟API调用延迟
      setTimeout(() => {
        setSubmitting(false);
        // 跳转回列表页
        history.push('/package/list');
      }, 1000);
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('保存失败，请检查表单');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    history.push('/package/list');
  };

  // 处理封面上传
  const handleCoverChange = (info: any) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done') {
      setCoverFile(info.file.originFileObj);
      // 生成预览URL（实际项目中应该使用上传后的URL）
      const url = URL.createObjectURL(info.file.originFileObj);
      setCoverUrl(url);
    }
  };

  // 处理画廊上传
  const handleGalleryChange = ({ fileList }: any) => {
    const files = fileList.map((file: any) => {
      if (file.originFileObj) {
        return file.originFileObj;
      }
      return null;
    }).filter(Boolean);
    
    setGalleryFiles(files);
  };

  // 移除已有的画廊图片
  const handleRemoveGalleryImage = (index: number) => {
    const newGalleryUrls = [...galleryUrls];
    newGalleryUrls.splice(index, 1);
    setGalleryUrls(newGalleryUrls);
  };

  const renderForm = () => (
    <div className="package-edit-form">
      <Card title={isEdit ? '编辑套餐' : '创建套餐'} bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'inactive',
            features: [''],
            isHot: false,
            recommendIndex: 0,
          }}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="name"
                label="套餐名称"
                rules={[{ required: true, message: '请输入套餐名称' }]}
              >
                <Input placeholder="请输入套餐名称" />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="category"
                label="套餐分类"
                rules={[{ required: true, message: '请选择套餐分类' }]}
              >
                <Select placeholder="请选择套餐分类">
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="套餐价格"
                rules={[{ required: true, message: '请输入套餐价格' }]}
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="请输入套餐价格"
                  formatter={(value: number | string | undefined) => `¥ ${value}`}
                  // 修复类型错误，使用类型断言
                  parser={(value: string | undefined) => {
                    const parsed = value ? Number(value.replace(/¥\s?/g, '')) || 0 : 0;
                    return parsed as 0; // 使用类型断言修复类型错误
                  }}
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="originalPrice"
                label="原价"
                tooltip="如果有折扣，可以填写原价"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  style={{ width: '100%' }}
                  placeholder="请输入原价（可选）"
                  formatter={(value: number | string | undefined) => `¥ ${value}`}
                  // 修复类型错误，使用类型断言
                  parser={(value: string | undefined) => {
                    const parsed = value ? Number(value.replace(/¥\s?/g, '')) || 0 : 0;
                    return parsed as 0; // 使用类型断言修复类型错误
                  }}
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="status"
                label="套餐状态"
                rules={[{ required: true, message: '请选择套餐状态' }]}
              >
                <Select placeholder="请选择套餐状态">
                  {packageStatusOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="套餐描述"
            rules={[{ required: true, message: '请输入套餐描述' }]}
          >
            <TextArea rows={4} placeholder="请输入套餐描述，介绍套餐的主要特点和服务内容" />
          </Form.Item>
          
          <Form.Item label="套餐封面">
            <Upload
              name="cover"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false} // 阻止自动上传
              onChange={handleCoverChange}
            >
              {coverUrl ? (
                <img src={coverUrl} alt="封面" style={{ width: '100%' }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传封面</div>
                </div>
              )}
            </Upload>
            <div className="upload-tip">建议尺寸：800 x 600 像素，JPG/PNG 格式</div>
          </Form.Item>
          
          <Form.Item label="套餐包含项目">
            <Form.List name="features" rules={[
              {
                validator: async (_: any, features: string[]) => {
                  if (!features || features.length < 1) {
                    return Promise.reject(new Error('至少添加一个套餐包含项目'));
                  }
                },
              },
            ]}>
              {(fields: any[], { add, remove }: { add: () => void; remove: (index: number) => void }, { errors }: { errors: string[] }) => (
                <>
                  {fields.map((field: any, index: number) => (
                    <Form.Item required={false} key={field.key}>
                      <div className="feature-item">
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "请输入项目内容或删除此项",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="例如：10张精修照片" style={{ width: '90%' }} />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="remove-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      添加套餐包含项目
                    </Button>
                    {/* 替换为自定义错误显示 */}
                    {errors && errors.length > 0 && (
                      <Alert
                        message={
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        }
                        type="error"
                        showIcon
                        style={{ marginTop: 8 }}
                      />
                    )}
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          
          <Form.Item label="案例展示图片">
            <div className="gallery-container">
              {galleryUrls.map((url, index) => (
                <div key={index} className="gallery-item">
                  <img src={url} alt={`案例 ${index + 1}`} />
                  <Button
                    className="remove-button"
                    type="primary"
                    danger
                    shape="circle"
                    icon={<MinusCircleOutlined />}
                    onClick={() => handleRemoveGalleryImage(index)}
                  />
                </div>
              ))}
              
              <Upload
                name="gallery"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={() => false} // 阻止自动上传
                onChange={handleGalleryChange}
                multiple
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传案例</div>
                </div>
              </Upload>
            </div>
            <div className="upload-tip">可上传多张案例展示图片，建议统一尺寸</div>
          </Form.Item>
          
          <Divider />
          
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="photographerId"
                label="指定摄影师"
                tooltip="如需指定特定摄影师，请在此选择"
              >
                <Select placeholder="请选择摄影师（可选）" allowClear>
                  {photographerOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="recommendIndex"
                label="推荐排序"
                tooltip="数值越大排序越靠前，0表示不推荐"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="isHot"
                label="热门套餐"
                valuePropName="checked"
                tooltip="标记为热门的套餐将在首页展示"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider />
          
          <div className="form-actions">
            <Space>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" onClick={handleSubmit} loading={submitting}>
                {submitting ? '保存中...' : '保存套餐'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="加载套餐数据..." />
      </div>
    );
  }

  return (
    <div className="package-edit-page">
      {renderForm()}
    </div>
  );
};

// 模拟套餐数据
const mockPackageData = {
  id: 1,
  name: '婚纱摄影豪华套餐',
  price: 6999,
  originalPrice: 9999,
  category: '婚纱摄影',
  status: 'active',
  description: '我们的婚纱摄影豪华套餐为您提供全面的服务，包括多场景拍摄、精美相册和专业后期处理，让您的婚纱照更加完美。',
  features: [
    '20张精修照片',
    '3套高级服装',
    '3个拍摄场景',
    '5小时拍摄时间',
    '1本精装相册',
    '化妆造型服务',
    '专车接送服务',
  ],
  cover: 'https://via.placeholder.com/800/FF5733/FFFFFF?text=Wedding+Package',
  gallery: [
    'https://via.placeholder.com/600/33A8FF/FFFFFF?text=Sample+1',
    'https://via.placeholder.com/600/33FF57/FFFFFF?text=Sample+2',
    'https://via.placeholder.com/600/A833FF/FFFFFF?text=Sample+3',
    'https://via.placeholder.com/600/FF33A8/FFFFFF?text=Sample+4',
  ],
  salesCount: 125,
  createdAt: '2023-02-10 09:00:00',
  updatedAt: '2023-06-15 11:30:00',
  photographer: {
    id: '2',
    name: '张摄影',
    avatar: 'https://via.placeholder.com/100/33FF57/FFFFFF?text=P',
  },
  recommendIndex: 10,
  isHot: true,
};

export default PackageEdit;
