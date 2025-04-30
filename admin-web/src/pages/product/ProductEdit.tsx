import React, { useState, useEffect } from 'react';
import { useParams, history, useLocation } from 'umi';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Switch,
  Upload,
  Divider,
  message,
  Space,
  Tabs,
  Row,
  Col,
  Modal
} from 'antd';
import {
  PlusOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { 
  getProductById,
  createProduct,
  updateProduct,
  getProductCategories
} from '../../services/product';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ProductEdit.scss';

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [details, setDetails] = useState<string>('');
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  
  // 判断是否是编辑模式
  const isEditing = !!id;
  
  // 获取查询参数中的克隆ID
  const query = new URLSearchParams(location.search);
  const cloneId = query.get('clone');
  
  useEffect(() => {
    fetchCategories();
    
    if (isEditing) {
      fetchProductData(parseInt(id));
    } else if (cloneId) {
      fetchProductData(parseInt(cloneId), true);
    }
  }, [id, cloneId]);
  
  // 获取产品分类
  const fetchCategories = async () => {
    try {
      const response = await getProductCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('获取产品分类失败:', error);
      message.error('获取产品分类失败');
    }
  };
  
  // 获取产品数据
  const fetchProductData = async (productId: number, isClone: boolean = false) => {
    try {
      setLoading(true);
      const response = await getProductById(productId);
      const product = response.data;
      
      // 克隆模式下，重置部分字段
      if (isClone) {
        product.name = `${product.name} - 副本`;
        product.sku = `${product.sku}-COPY`;
        product.salesCount = 0;
      }
      
      // 设置表单初始值
      // Define interfaces for type safety
      interface Category {
        id: number;
      }
      
      interface Product {
        name: string;
        sku: string;
        price: number;
        stock: number;
        categories?: Category[];
        tags?: string[];
        isActive: boolean;
        description?: string;
        details?: string;
        images?: string[];
      }
      
      form.setFieldsValue({
        name: product.name,
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        categoryIds: product.categories?.map((c: Category) => c.id) || [],
        tags: product.tags,
        isActive: product.isActive,
        description: product.description,
      });
      
      // 设置编辑器内容
      setDetails(product.details || '');
      
      // 设置图片
      if (product.images && product.images.length > 0) {
        const uploadFileList = product.images.map((url: string, index: number) => ({
          uid: `-${index}`,
          name: `product-image-${index}.jpg`,
          status: 'done' as const,
          url,
        }));
        
        setFileList(uploadFileList);
      }
    } catch (error) {
      console.error('获取产品数据失败:', error);
      message.error('获取产品数据失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      // 构建要保存的数据
      const productData = {
        ...values,
        images: fileList.map(file => file.url || file.response?.url),
        details,
      };
      
      // 提交表单
      if (isEditing) {
        await updateProduct(parseInt(id), productData);
        message.success('产品更新成功');
      } else {
        await createProduct(productData);
        message.success('产品创建成功');
      }
      
      // 返回列表页
      history.push('/product/list');
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
        history.push('/product/list');
      },
      okText: '确定',
      cancelText: '继续编辑',
    });
  };
  
  // 处理文件上传变化
  const handleFileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };
  
  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };
  
  // 将文件转换为 Base64
  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // 图片上传组件
  const uploadProps = {
    name: 'file',
    action: '/api/upload/image',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    listType: 'picture-card',
    fileList,
    onChange: handleFileChange,
    onPreview: handlePreview,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('您只能上传图片文件!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片必须小于5MB!');
      }
      return isImage && isLt5M;
    },
  };
  
  // 富文本编辑器配置
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean'],
    ],
  };
  
  return (
    <div className="product-edit-page">
      <Card
        title={
          <div className="page-header">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleCancel}
              className="back-button"
            >
              返回
            </Button>
            <span className="page-title">
              {isEditing ? '编辑产品' : cloneId ? '复制产品' : '添加产品'}
            </span>
          </div>
        }
        loading={loading}
        extra={
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button
              type="primary"
              icon={SaveOutlined}
              loading={submitting}
              onClick={handleSubmit}
            >
              保存
            </Button>
          </Space>
        }
      >
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基本信息" key="basic">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                isActive: true,
                stock: 0,
                price: 0,
              }}
            >
              <Row gutter={24}>
                <Col span={16}>
                  <Card bordered={false} className="form-card">
                    <Form.Item
                      name="name"
                      label="产品名称"
                      rules={[{ required: true, message: '请输入产品名称' }]}
                    >
                      <Input placeholder="输入产品名称" />
                    </Form.Item>
                    
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name="sku"
                          label="SKU"
                          rules={[{ required: true, message: '请输入SKU' }]}
                        >
                          <Input placeholder="输入产品SKU" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="price"
                          label="价格"
                          rules={[{ required: true, message: '请输入价格' }]}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            style={{ width: '100%' }}
                            prefix="¥"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="stock"
                          label="库存"
                          rules={[{ required: true, message: '请输入库存' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="categoryIds"
                          label="产品分类"
                          rules={[{ required: true, message: '请选择产品分类' }]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="选择产品分类"
                            style={{ width: '100%' }}
                          >
                            {categories.map(category => (
                              <Option key={category.id} value={category.id}>{category.name}</Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="tags"
                          label="标签"
                        >
                          <Select
                            mode="tags"
                            placeholder="输入标签"
                            style={{ width: '100%' }}
                          >
                            <Option value="热销">热销</Option>
                            <Option value="新品">新品</Option>
                            <Option value="推荐">推荐</Option>
                            <Option value="限时">限时</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    
                    <Form.Item
                      name="description"
                      label="产品简介"
                    >
                      <TextArea rows={4} placeholder="输入产品简介" />
                    </Form.Item>
                    
                    <Divider />
                    
                    <Form.Item
                      name="isActive"
                      label="上架状态"
                      valuePropName="checked"
                    >
                      <Switch checkedChildren="上架" unCheckedChildren="下架" />
                    </Form.Item>
                  </Card>
                </Col>
                
                <Col span={8}>
                  <Card title="产品图片" bordered={false} className="form-card">
                    <Upload {...uploadProps}>
                      {fileList.length >= 8 ? null : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>上传图片</div>
                        </div>
                      )}
                    </Upload>
                    <div className="upload-hint">
                      支持JPG、PNG格式，单张图片不超过5MB，最多上传8张
                    </div>
                    <Modal
                      visible={previewVisible}
                      title="图片预览"
                      footer={null}
                      onCancel={() => setPreviewVisible(false)}
                    >
                      <img
                        alt="预览图片"
                        style={{ width: '100%' }}
                        src={previewImage}
                      />
                    </Modal>
                  </Card>
                </Col>
              </Row>
            </Form>
          </TabPane>
          
          <TabPane tab="详细描述" key="details">
            <Card bordered={false} className="editor-card">
              <div className="rich-editor">
                <ReactQuill
                  theme="snow"
                  value={details}
                  onChange={setDetails}
                  modules={quillModules}
                  style={{ height: '400px' }}
                />
              </div>
            </Card>
          </TabPane>
          
          <TabPane tab="规格与参数" key="specs">
            <Card bordered={false}>
              <div className="specs-placeholder">
                <p>产品规格与参数设置功能正在开发中...</p>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProductEdit;
