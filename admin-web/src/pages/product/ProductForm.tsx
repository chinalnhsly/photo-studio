import React, { useState, useEffect } from 'react';
import { useParams, history } from 'umi';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Upload,
  Switch,
  Divider,
  Space,
  Tabs,
  Typography,
  Row,
  Col,
  message,
  Spin,
  Alert,
  Table,
  Tooltip,
  Modal
} from 'antd';
import {
  PlusOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { 
  getProductById, 
  createProduct, 
  updateProduct,
  getProductCategories,
  getPackageItems,
  updatePackageItems
} from '../../services/product';
import { ProductType } from '../../types/product';
import './ProductForm.scss';

// 产品相关类型定义
interface ProductSpecItem {
  key: string;
  value: string;
}

interface PackageItem {
  productId: number;
  product?: {
    id: number;
    name: string;
    type: string;
    price: number;
  };
  quantity: number;
  notes: string;
}

// 用于表示可用产品的类型
interface AvailableProduct {
  id: number;
  name: string;
  type: string;
  price: number;
}

// 用于表示套餐项请求参数的类型
interface PackageItemRequest {
  productId: number;
  quantity: number;
  notes?: string;
}

// 表单字段类型
interface FormListFieldData {
  key: number;
  name: number;
  fieldKey?: number;
}

// 表单操作类型
interface FormListOperation {
  add: () => void;
  remove: (index: number) => void;
}

// 产品类型映射
type ProductTypeString = 'single' | 'service' | 'addon';
const typeMap: Record<ProductTypeString, string> = {
  single: '单品',
  service: '服务',
  addon: '附加项',
};

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<UploadFile[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<UploadFile[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [productType, setProductType] = useState<ProductType>(ProductType.SINGLE);
  const [packageItems, setPackageItems] = useState<PackageItem[]>([]);
  const [packageItemsModalVisible, setPackageItemsModalVisible] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  // 初始数据加载
  useEffect(() => {
    fetchCategories();
    
    if (isEdit) {
      fetchProductData();
    }
  }, [id]);

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
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await getProductById(Number(id));
      const product = response.data;
      
      // 设置表单初始值
      form.setFieldsValue({
        name: product.name,
        code: product.code,
        type: product.type,
        categoryId: product.categoryId,
        price: product.price,
        originalPrice: product.originalPrice,
        shortDescription: product.shortDescription,
        description: product.description,
        isActive: product.isActive,
        isRecommended: product.isRecommended,
        isHot: product.isHot,
        isNew: product.isNew,
        sortOrder: product.sortOrder,
        // 产品详情
        specs: product.details?.specs || [],
        includes: product.details?.includes || [],
        excludes: product.details?.excludes || [],
        notes: product.details?.notes,
        duration: product.details?.duration,
        requiredPhotographerCount: product.details?.requiredPhotographerCount,
        shootingLocation: product.details?.shootingLocation,
        deliveryTime: product.details?.deliveryTime,
        preparationGuidance: product.details?.preparationGuidance,
      });
      
      // 设置产品类型
      setProductType(product.type);
      
      // 设置封面图片
      if (product.coverImage) {
        setCoverFile([{
          uid: '-1',
          name: 'cover.jpg',
          status: 'done',
          url: product.coverImage
        }]);
      }
      
      // 设置相册图片
      if (product.images && product.images.length > 0) {
        const files = product.images.map((url: string, index: number) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url
        }));
        setGalleryFiles(files);
      }

      // 如果是套餐，获取套餐内容
      if (product.type === ProductType.PACKAGE) {
        fetchPackageItems(Number(id));
      }
    } catch (error) {
      console.error('获取产品数据失败:', error);
      message.error('获取产品数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取套餐内容
  const fetchPackageItems = async (packageId: number) => {
    try {
      const response = await getPackageItems(packageId);
      setPackageItems(response.data);
    } catch (error) {
      console.error('获取套餐内容失败:', error);
      message.error('获取套餐内容失败');
    }
  };

  // 处理产品类型变化
  const handleTypeChange = (value: ProductType) => {
    setProductType(value);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      // 处理图片
      const coverImage = coverFile.length > 0 ? coverFile[0].url || coverFile[0].response?.url : undefined;
      const images = galleryFiles.map(file => file.url || file.response?.url).filter(Boolean);
      
      // 构建提交数据
      const submitData = {
        ...values,
        coverImage,
        images,
        details: {
          specs: values.specs,
          includes: values.includes,
          excludes: values.excludes,
          notes: values.notes,
          duration: values.duration,
          requiredPhotographerCount: values.requiredPhotographerCount,
          shootingLocation: values.shootingLocation,
          deliveryTime: values.deliveryTime,
          preparationGuidance: values.preparationGuidance,
        }
      };
      
      // 删除嵌套字段，避免重复提交
      delete submitData.specs;
      delete submitData.includes;
      delete submitData.excludes;
      delete submitData.notes;
      delete submitData.duration;
      delete submitData.requiredPhotographerCount;
      delete submitData.shootingLocation;
      delete submitData.deliveryTime;
      delete submitData.preparationGuidance;
      
      let productId;
      
      if (isEdit) {
        const result = await updateProduct(Number(id), submitData);
        productId = Number(id);
        message.success('产品更新成功');
      } else {
        const result = await createProduct(submitData);
        productId = result.data.id;
        message.success('产品创建成功');
      }
      
      // 如果是套餐，且有套餐内容，更新套餐内容
      if (productType === ProductType.PACKAGE && packageItems.length > 0 && productId) {
        // 过滤掉没有有效productId的项，并确保类型安全
        const validItems: PackageItemRequest[] = packageItems
          .filter(item => (item.productId || item.product?.id) !== undefined)
          .map(item => ({
            productId: (item.productId || item.product?.id) as number,
            quantity: item.quantity,
            notes: item.notes
          }));
        
        await updatePackageItems(productId, validItems);
      }
      
      // 返回产品列表
      history.push('/product/list');
    } catch (error) {
      console.error('提交产品数据失败:', error);
      message.error('保存失败，请检查表单');
    } finally {
      setSubmitting(false);
    }
  };

  // 处理封面图片上传变更
  const handleCoverChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setCoverFile(fileList);
  };

  // 处理相册图片上传变更
  const handleGalleryChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setGalleryFiles(fileList);
  };

  // 打开套餐内容管理模态框
  const handleManagePackageItems = () => {
    // 这里应该获取可用的产品列表
    // 为简化示例，我们使用模拟数据
    setAvailableProducts([
      { id: 1, name: '婚纱照基础套餐', type: 'single', price: 2999 },
      { id: 2, name: '儿童写真', type: 'single', price: 1299 },
      { id: 3, name: '全家福', type: 'single', price: 1599 },
      { id: 4, name: '艺术写真', type: 'single', price: 1899 },
      { id: 5, name: '个人形象照', type: 'single', price: 999 },
    ]);
    setPackageItemsModalVisible(true);
  };

  // 添加套餐内容
  const handleAddPackageItem = (selectedProducts: any[]) => {
    const newPackageItems = [
      ...packageItems,
      ...selectedProducts.map(product => ({
        productId: product.id,
        product,
        quantity: 1,
        notes: ''
      }))
    ];
    
    // 去重
    const uniqueItems = Array.from(new Map(newPackageItems.map(item => 
      [item.productId, item]
    )).values());
    
    setPackageItems(uniqueItems);
    setPackageItemsModalVisible(false);
    setSelectedProductIds([]);
  };

  // 更新套餐项数量
  const handlePackageItemQuantityChange = (productId: number | undefined, quantity: number | null) => {
    // 确保productId不是undefined
    if (productId === undefined) return;
    
    setPackageItems(prevItems => 
      prevItems.map(item => 
        (item.productId === productId || item.product?.id === productId) 
          ? { ...item, quantity: quantity || 1 } 
          : item
      )
    );
  };

  // 更新套餐项备注
  const handlePackageItemNotesChange = (productId: number | undefined, notes: string) => {
    // 确保productId不是undefined
    if (productId === undefined) return;
    
    setPackageItems(prevItems => 
      prevItems.map(item => 
        (item.productId === productId || item.product?.id === productId) 
          ? { ...item, notes } 
          : item
      )
    );
  };

  // 移除套餐项
  const handleRemovePackageItem = (productId: number | undefined) => {
    // 确保productId不是undefined
    if (productId === undefined) return;
    
    setPackageItems(prevItems => 
      prevItems.filter(item => 
        item.productId !== productId && item.product?.id !== productId
      )
    );
  };

  // 返回按钮处理
  const handleBack = () => {
    history.push('/product/list');
  };

  // 上传按钮组件
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传</div>
    </div>
  );

  // 套餐内容列
  const packageItemColumns = [
    {
      title: '产品名称',
      dataIndex: ['product', 'name'],
      render: (text: string, record: PackageItem) => record.product?.name || text,
    },
    {
      title: '类型',
      dataIndex: ['product', 'type'],
      render: (text: string) => {
        return typeMap[text as ProductTypeString] || text;
      },
    },
    {
      title: '单价',
      dataIndex: ['product', 'price'],
      render: (text: number, record: PackageItem) => `¥${record.product?.price || 0}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      render: (text: number, record: PackageItem) => (
        <InputNumber 
          min={1} 
          value={text} 
          onChange={(value: number | null) => handlePackageItemQuantityChange(record.productId || record.product?.id || undefined, value)} 
        />
      ),
    },
    {
      title: '备注',
      dataIndex: 'notes',
      render: (text: string, record: PackageItem) => (
        <Input 
          value={text} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePackageItemNotesChange(record.productId || record.product?.id || undefined, e.target.value)} 
          placeholder="可选备注" 
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PackageItem) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => handleRemovePackageItem(record.productId || record.product?.id || undefined)} 
        />
      ),
    },
  ];

  return (
    <div className="product-form-page">
      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} />
            <span>{isEdit ? '编辑产品' : '新增产品'}</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={submitting}
            onClick={handleSubmit}
          >
            保存
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              type: ProductType.SINGLE,
              isActive: true,
              isRecommended: false,
              isHot: false,
              isNew: false,
              sortOrder: 0,
              specs: [],
              includes: [],
              excludes: [],
            }}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="基本信息" key="1">
                <Row gutter={24}>
                  <Col xs={24} md={16}>
                    <Card title="产品信息" className="inner-card">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="name"
                            label="产品名称"
                            rules={[{ required: true, message: '请输入产品名称' }]}
                          >
                            <Input placeholder="请输入产品名称" />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="code"
                            label="产品编码"
                          >
                            <Input placeholder="请输入产品编码" />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="type"
                            label="产品类型"
                            rules={[{ required: true, message: '请选择产品类型' }]}
                          >
                            <Select onChange={handleTypeChange}>
                              <Option value={ProductType.SINGLE}>单品</Option>
                              <Option value={ProductType.PACKAGE}>套餐</Option>
                              <Option value={ProductType.SERVICE}>服务</Option>
                              <Option value={ProductType.ADDON}>附加项</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="categoryId"
                            label="产品分类"
                            rules={[{ required: true, message: '请选择产品分类' }]}
                          >
                            <Select>
                              {categories.map(category => (
                                <Option key={category.id} value={category.id}>
                                  {category.name}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="price"
                            label="销售价格"
                            rules={[{ required: true, message: '请输入销售价格' }]}
                          >
                            <InputNumber
                              min={0}
                              precision={2}
                              style={{ width: '100%' }}
                              addonBefore="¥"
                              placeholder="请输入销售价格"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="originalPrice"
                            label="原价"
                          >
                            <InputNumber
                              min={0}
                              precision={2}
                              style={{ width: '100%' }}
                              addonBefore="¥"
                              placeholder="请输入原价"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Form.Item
                        name="shortDescription"
                        label="简短描述"
                      >
                        <Input.TextArea rows={2} placeholder="请输入简短描述" />
                      </Form.Item>
                      
                      <Form.Item
                        name="description"
                        label="详细描述"
                      >
                        <Input.TextArea rows={4} placeholder="请输入详细描述" />
                      </Form.Item>
                    </Card>
                    
                    <Card title="产品状态" className="inner-card">
                      <Row gutter={16}>
                        <Col span={6}>
                          <Form.Item
                            name="isActive"
                            label="上架状态"
                            valuePropName="checked"
                          >
                            <Switch checkedChildren="已上架" unCheckedChildren="已下架" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            name="isRecommended"
                            label="推荐产品"
                            valuePropName="checked"
                          >
                            <Switch checkedChildren="是" unCheckedChildren="否" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            name="isHot"
                            label="热销产品"
                            valuePropName="checked"
                          >
                            <Switch checkedChildren="是" unCheckedChildren="否" />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            name="isNew"
                            label="新品"
                            valuePropName="checked"
                          >
                            <Switch checkedChildren="是" unCheckedChildren="否" />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Form.Item
                        name="sortOrder"
                        label="排序值"
                        tooltip="数值越小越靠前"
                      >
                        <InputNumber min={0} style={{ width: '100%' }} />
                      </Form.Item>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={8}>
                    <Card title="封面图片" className="inner-card">
                      <Form.Item>
                        <Upload
                          name="file"
                          listType="picture-card"
                          className="avatar-uploader"
                          fileList={coverFile}
                          onChange={handleCoverChange}
                          action="/api/upload"
                          maxCount={1}
                        >
                          {coverFile.length >= 1 ? null : uploadButton}
                        </Upload>
                        <div className="upload-tip">
                          建议尺寸：800x800像素，支持jpg、png格式
                        </div>
                      </Form.Item>
                    </Card>
                    
                    <Card title="相册图片" className="inner-card">
                      <Form.Item>
                        <Upload
                          name="file"
                          listType="picture-card"
                          fileList={galleryFiles}
                          onChange={handleGalleryChange}
                          action="/api/upload"
                          multiple
                        >
                          {galleryFiles.length >= 10 ? null : uploadButton}
                        </Upload>
                        <div className="upload-tip">
                          最多上传10张图片，建议尺寸：800x800像素
                        </div>
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              <TabPane tab="产品详情" key="2">
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Card title="产品规格" className="inner-card">
                      <Form.List name="specs">
                        {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                          <>
                            {fields.map(({ key, name, ...restField }: FormListFieldData) => (
                              <div key={key} className="dynamic-field">
                                <Row gutter={16}>
                                  <Col span={10}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'key']}
                                      rules={[{ required: true, message: '请输入规格名称' }]}
                                    >
                                      <Input placeholder="规格名称，如尺寸" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={10}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, 'value']}
                                      rules={[{ required: true, message: '请输入规格值' }]}
                                    >
                                      <Input placeholder="规格值，如10寸" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={4}>
                                    <Button
                                      type="text"
                                      icon={<MinusCircleOutlined />}
                                      onClick={() => remove(name)}
                                      danger
                                    />
                                  </Col>
                                </Row>
                              </div>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                block
                              >
                                添加规格
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Card>
                    
                    <Card title="包含内容" className="inner-card">
                      <Form.List name="includes">
                        {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                          <>
                            {fields.map(({ key, name, ...restField }: FormListFieldData) => (
                              <div key={key} className="dynamic-field">
                                <Row gutter={16}>
                                  <Col span={20}>
                                    <Form.Item
                                      {...restField}
                                      name={[name]}
                                      rules={[{ required: true, message: '请输入包含内容' }]}
                                    >
                                      <Input placeholder="包含的内容或服务，如8寸相册一本" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={4}>
                                    <Button
                                      type="text"
                                      icon={<MinusCircleOutlined />}
                                      onClick={() => remove(name)}
                                      danger
                                    />
                                  </Col>
                                </Row>
                              </div>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                block
                              >
                                添加包含内容
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Card>
                    
                    <Card title="不包含内容" className="inner-card">
                      <Form.List name="excludes">
                        {(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                          <>
                            {fields.map(({ key, name, ...restField }: FormListFieldData) => (
                              <div key={key} className="dynamic-field">
                                <Row gutter={16}>
                                  <Col span={20}>
                                    <Form.Item
                                      {...restField}
                                      name={[name]}
                                      rules={[{ required: true, message: '请输入不包含内容' }]}
                                    >
                                      <Input placeholder="不包含的内容或服务，如服装道具" />
                                    </Form.Item>
                                  </Col>
                                  <Col span={4}>
                                    <Button
                                      type="text"
                                      icon={<MinusCircleOutlined />}
                                      onClick={() => remove(name)}
                                      danger
                                    />
                                  </Col>
                                </Row>
                              </div>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => add()}
                                icon={<PlusOutlined />}
                                block
                              >
                                添加不包含内容
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Card>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <Card title="拍摄信息" className="inner-card">
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            name="duration"
                            label={
                              <span>
                                拍摄时长 <Tooltip title="拍摄所需时间（分钟）"><InfoCircleOutlined /></Tooltip>
                              </span>
                            }
                          >
                            <InputNumber
                              min={0}
                              style={{ width: '100%' }}
                              addonAfter="分钟"
                              placeholder="如: 120"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            name="requiredPhotographerCount"
                            label={
                              <span>
                                所需摄影师 <Tooltip title="拍摄所需摄影师人数"><InfoCircleOutlined /></Tooltip>
                              </span>
                            }
                          >
                            <InputNumber
                              min={1}
                              style={{ width: '100%' }}
                              addonAfter="人"
                              placeholder="如: 1"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      <Form.Item
                        name="shootingLocation"
                        label="拍摄地点"
                      >
                        <Input placeholder="如: 室内棚拍/外景" />
                      </Form.Item>
                      
                      <Form.Item
                        name="deliveryTime"
                        label="交付时间"
                      >
                        <InputNumber
                          min={1}
                          style={{ width: '100%' }}
                          addonAfter="工作日"
                          placeholder="如: 7"
                        />
                      </Form.Item>
                    </Card>
                    
                    <Card title="其他信息" className="inner-card">
                      <Form.Item
                        name="notes"
                        label="产品备注"
                      >
                        <TextArea rows={3} placeholder="其他需要说明的事项" />
                      </Form.Item>
                      
                      <Form.Item
                        name="preparationGuidance"
                        label="拍摄准备指南"
                      >
                        <TextArea rows={3} placeholder="给客户的拍摄建议和准备事项" />
                      </Form.Item>
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              
              {productType === ProductType.PACKAGE && (
                <TabPane tab="套餐组合" key="3">
                  <Card title="套餐内容管理" extra={
                    <Button type="primary" onClick={handleManagePackageItems}>
                      添加产品
                    </Button>
                  }>
                    <Table
                      dataSource={packageItems}
                      columns={packageItemColumns}
                      rowKey={(record: PackageItem) => record.productId || record.product?.id}
                      pagination={false}
                      locale={{ emptyText: '尚未添加任何产品到套餐中' }}
                    />
                  </Card>
                </TabPane>
              )}
            </Tabs>
          </Form>
        </Spin>
      </Card>
      
      {/* 套餐产品选择模态框 */}
      <Modal
        title="选择套餐内容"
        open={packageItemsModalVisible}
        onCancel={() => setPackageItemsModalVisible(false)}
        onOk={() => {
          const selectedProducts = availableProducts.filter(
            p => selectedProductIds.includes(p.id)
          );
          handleAddPackageItem(selectedProducts);
        }}
        width={700}
      >
        <Table
          dataSource={availableProducts}
          rowKey="id"
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedProductIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedProductIds(selectedRowKeys as number[]);
            },
          }}
          columns={[
            {
              title: '产品名称',
              dataIndex: 'name',
            },
            {
              title: '类型',
              dataIndex: 'type',
              render: (text: string, record: AvailableProduct) => {
                return typeMap[text as ProductTypeString] || text;
              },
            },
            {
              title: '价格',
              dataIndex: 'price',
              render: (price: number) => `¥${price}`,
            },
          ]}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default ProductForm;
