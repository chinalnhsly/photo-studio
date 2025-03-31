import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select, message, Spin } from 'antd';
import { api } from '@/services/api';
import { useCategories } from '@/hooks/useCategories';

interface EditFormProps {
  visible: boolean;
  record?: any;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditForm: React.FC<EditFormProps> = ({
  visible,
  record,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data: categories = [], loading: categoriesLoading } = useCategories();

  // 编辑模式下，加载记录数据
  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (record) {
        console.log('编辑商品:', record);
        form.setFieldsValue(record);
      }
    }
  }, [visible, record, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      console.log('提交商品数据:', values);
      
      // 确保所有数值正确转换
      const payload = {
        name: values.name.trim(),
        price: Number(values.price) || 0, // 确保价格是数字且不为NaN
        stock: parseInt(values.stock, 10) || 0, // 确保库存是整数且不为NaN
        categoryId: Number(values.categoryId),
        isActive: values.isActive === undefined ? true : values.isActive,
        description: values.description?.trim() || null
      };
      
      console.log('处理后的请求数据:', payload);
      
      // 尝试不同的API路径
      let response;
      try {
        if (record?.id) {
          // 更新已有商品
          response = await api.patch(`/products/${record.id}`, payload);
        } else {
          // 创建新商品 - 直接使用/products路径
          response = await api.post('/products', payload);
        }
      } catch (error) {
        console.log('尝试备用API路径');
        if (record?.id) {
          response = await api.patch(`/api/products/${record.id}`, payload);
        } else {
          response = await api.post('/api/products', payload);
        }
      }
      
      console.log('提交响应:', response);
      
      if (response.data?.success) {
        message.success(`${record ? '更新' : '创建'}商品成功`);
        onSuccess();
      } else {
        message.error(response.data?.message || `${record ? '更新' : '创建'}失败`);
      }
    } catch (error: any) {
      console.error('提交商品数据失败:', error);
      console.error('错误详情:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.error 
        || error.message 
        || `商品${record ? '更新' : '创建'}失败`;
        
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={record ? '编辑商品' : '新增商品'}
      open={visible}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
      >
        <Form.Item
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="请输入商品名称" />
        </Form.Item>
        
        <Form.Item
          name="categoryId"
          label="商品分类"
          rules={[{ required: true, message: '请选择商品分类' }]}
        >
          <Select
            placeholder={categoriesLoading ? '加载中...' : '请选择商品分类'}
            loading={categoriesLoading}
            showSearch
            optionFilterProp="children"
            notFoundContent={categoriesLoading ? <Spin size="small" /> : '暂无分类数据'}
          >
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled value="">暂无分类数据</Select.Option>
            )}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="price"
          label="商品价格"
          rules={[{ required: true, message: '请输入价格' }]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            min={0}
            precision={2}
            placeholder="请输入价格"
          />
        </Form.Item>
        
        {/* 添加库存数量表单项 */}
        <Form.Item
          name="stock"
          label="库存数量"
          rules={[{ required: true, message: '请输入库存数量' }]}
          initialValue={0}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            min={0}
            precision={0}
            placeholder="请输入库存数量"
          />
        </Form.Item>
        
        <Form.Item
          name="description"
          label="商品描述"
        >
          <Input.TextArea rows={3} placeholder="请输入商品描述" />
        </Form.Item>
        
        <Form.Item
          name="isActive"
          label="上架状态"
          valuePropName="checked"
        >
          <Switch checkedChildren="上架" unCheckedChildren="下架" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
