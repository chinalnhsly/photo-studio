import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Table,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  Popconfirm,
  message,
  Typography,
  Upload,
  Switch,
  Tooltip,
  Empty,
  Select
} from 'antd';
import Tree from 'antd/es/tree';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
  DragOutlined,
  InfoCircleOutlined,
  FileImageOutlined,
  UploadOutlined
} from '@ant-design/icons';
import type { DataNode, TreeProps } from 'antd/es/tree';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoriesOrder
} from '@/services/category';
import './index.scss';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId: number | null;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  level: number;
  path: string;
  children?: CategoryItem[];
  productCount?: number;
}

const ProductCategory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [dragMode, setDragMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 初始化数据
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // 获取分类列表
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategoryList();
      
      // 构建分类树
      const categoryTree = buildCategoryTree(response.data);
      setCategories(categoryTree);
      
      // 默认展开一级分类
      const rootKeys = categoryTree.map(item => item.id);
      setExpandedKeys(rootKeys);
    } catch (error) {
      console.error('获取分类列表失败:', error);
      message.error('获取分类列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 构建分类树
  const buildCategoryTree = (items: CategoryItem[]): CategoryItem[] => {
    // 深拷贝
    const allItems = JSON.parse(JSON.stringify(items));
    const result: CategoryItem[] = [];
    const itemMap: Record<number, CategoryItem> = {};
    
    // 创建一个哈希表来存储每个项的引用
    allItems.forEach((item: CategoryItem) => {
      itemMap[item.id] = item;
      item.children = [];
    });
    
    // 将子分类添加到其父分类的children数组中
    allItems.forEach((item: CategoryItem) => {
      if (item.parentId !== null) {
        const parent = itemMap[item.parentId];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(item);
        } else {
          result.push(item);
        }
      } else {
        result.push(item);
      }
    });
    
    // 对分类进行排序
    const sortItems = (items: CategoryItem[]): void => {
      items.sort((a, b) => a.sortOrder - b.sortOrder);
      items.forEach(item => {
        if (item.children && item.children.length > 0) {
          sortItems(item.children);
        }
      });
    };
    
    sortItems(result);
    return result;
  };
  
  // 打开添加分类的弹窗
  const handleAddCategory = (parentId?: number) => {
    form.resetFields();
    setFileList([]);
    setEditingCategory(null);
    
    if (parentId) {
      form.setFieldsValue({
        parentId,
        isActive: true
      });
    } else {
      form.setFieldsValue({
        parentId: null,
        isActive: true
      });
    }
    
    setModalVisible(true);
  };
  
  // 打开编辑分类的弹窗
  const handleEditCategory = (category: CategoryItem) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    
    if (category.image) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: category.image,
        }
      ]);
    } else {
      setFileList([]);
    }
    
    setModalVisible(true);
  };
  
  // 删除分类
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      message.success('分类删除成功');
      fetchCategories();
    } catch (error) {
      console.error('删除分类失败:', error);
      message.error('删除分类失败，可能因为该分类下有商品或子分类');
    }
  };
  
  // 处理表单提交
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      
      // 处理图片
      const imageUrl = fileList.length > 0 ? (fileList[0].url || fileList[0].response?.url) : undefined;
      
      const submitData = {
        ...values,
        image: imageUrl
      };
      
      if (editingCategory) {
        // 更新分类
        await updateCategory(editingCategory.id, submitData);
        message.success('分类更新成功');
      } else {
        // 创建新分类
        await createCategory(submitData);
        message.success('分类创建成功');
      }
      
      setModalVisible(false);
      fetchCategories();
    } catch (error) {
      console.error('提交表单失败:', error);
      message.error('保存分类失败');
    } finally {
      setSubmitting(false);
    }
  };
  
  // 处理拖拽排序完成
  const handleDragSortEnd = async (sortedItems: CategoryItem[]) => {
    try {
      // 更新分类排序
      const flattenItems = flattenCategories(sortedItems);
      const updateData = flattenItems.map((item, index) => ({
        id: item.id,
        sortOrder: index,
        parentId: item.parentId
      }));
      
      await updateCategoriesOrder(updateData);
      message.success('分类排序更新成功');
      fetchCategories();
    } catch (error) {
      console.error('更新分类排序失败:', error);
      message.error('更新分类排序失败');
    }
  };
  
  // 将分类树扁平化
  const flattenCategories = (items: CategoryItem[]): CategoryItem[] => {
    let result: CategoryItem[] = [];
    
    items.forEach(item => {
      const { children, ...rest } = item;
      result.push(rest as CategoryItem);
      
      if (children && children.length > 0) {
        result = [...result, ...flattenCategories(children)];
      }
    });
    
    return result;
  };
  
  // 文件上传变更
  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };
  
  // 生成分类表格数据
  const renderCategoryTable = () => {
    // 搜索过滤逻辑
    const filterCategories = (items: CategoryItem[], searchText: string): CategoryItem[] => {
      if (!searchText) {
        return items;
      }
      
      return items.filter(item => {
        const match = item.name.toLowerCase().includes(searchText.toLowerCase());
        
        if (match) {
          return true;
        }
        
        if (item.children && item.children.length > 0) {
          const filteredChildren = filterCategories(item.children, searchText);
          if (filteredChildren.length > 0) {
            item.children = filteredChildren;
            return true;
          }
        }
        
        return false;
      });
    };
    
    const displayCategories = filterCategories(
      JSON.parse(JSON.stringify(categories)), // 深拷贝
      searchValue
    );
    
    // 表格列定义
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
        render: (text: string, record: CategoryItem) => (
          <Space>
            {record.image && (
              <img
                src={record.image}
                alt={text}
                className="category-thumbnail"
              />
            )}
            <span>{text}</span>
            {!record.isActive && (
              <Tag color="red">已停用</Tag>
            )}
          </Space>
        ),
      },
      {
        title: '别名',
        dataIndex: 'slug',
        key: 'slug',
      },
      {
        title: '商品数量',
        dataIndex: 'productCount',
        key: 'productCount',
        render: (count: number | undefined) => count ?? 0,
      },
      {
        title: '层级/排序',
        key: 'levelOrder',
        render: (_: any, record: CategoryItem) => (
          <Tooltip title="层级/排序">
            <Tag color="blue">{record.level} / {record.sortOrder}</Tag>
          </Tooltip>
        ),
      },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: CategoryItem) => (
          <Space>
            <Button
              type="link"
              icon={<PlusOutlined />}
              onClick={() => handleAddCategory(record.id)}
            >
              添加子分类
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditCategory(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要删除此分类吗?"
              description="删除后将无法恢复，如果有子分类或关联商品将无法删除"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => handleDeleteCategory(record.id)}
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];
    
    return (
      <Table
        columns={columns}
        dataSource={displayCategories}
        rowKey="id"
        loading={loading}
        pagination={false}
        expandable={{
          defaultExpandAllRows: false,
          expandedRowKeys: expandedKeys as React.Key[],
          onExpandedRowsChange: (expandedKeys: React.Key[]) => {
            setExpandedKeys(expandedKeys);
          },
        }}
      />
    );
  };
  
  // 渲染分类树（用于拖拽模式）
  const renderCategoryTree = () => {
    // 转换数据为树形格式
    const convertToTreeNodes = (categories: CategoryItem[]): DataNode[] => {
      return categories.map(category => ({
        key: category.id,
        title: (
          <div className="tree-node-title">
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="category-tree-thumbnail"
              />
            )}
            <span className="category-title">{category.name}</span>
            {!category.isActive && (
              <Tag color="red" className="status-tag">已停用</Tag>
            )}
            {(category.productCount ?? 0) > 0 && (
              <Tag color="blue" className="count-tag">{category.productCount}个商品</Tag>
            )}
          </div>
        ),
        children: category.children && category.children.length > 0
          ? convertToTreeNodes(category.children)
          : undefined,
      }));
    };
    
    const treeData = convertToTreeNodes(categories);
    
    // 处理拖拽事件
    const onDrop: TreeProps['onDrop'] = (info) => {
      const dropKey = info.node.key as number;
      const dragKey = info.dragNode.key as number;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      
      // 复制一份数据进行操作
      const data = [...categories];
      let dragObj: CategoryItem | null = null;
      let parentId: number | null = null;
      
      // 先找到被拖拽的节点
      const loop = (
        items: CategoryItem[],
        key: number,
        callback: (item: CategoryItem, index: number, arr: CategoryItem[]) => void
      ) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].id === key) {
            callback(items[i], i, items);
            return;
          }
          if (items[i].children && items[i].children!.length > 0) {
            // 使用类型断言，因为我们已经检查了 children 存在且长度大于 0
            loop(items[i].children as CategoryItem[], key, callback);
          }
        }
      };
      
      // 移除拖拽的节点
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = { ...item };
      });
      
      // 确保我们有拖拽对象
      if (!dragObj) return;
      
      // 插入到目标位置
      if (info.dropToGap) {
        // 如果是放在两个节点之间
        let ar: CategoryItem[] = [];
        let i: number = 0;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
          // 更新parentId
          dragObj!.parentId = item.parentId ?? null;
          parentId = item.parentId ?? null;
        });
        
        if (dropPosition === -1) {
          // 插入到目标节点之前
          ar.splice(i, 0, dragObj!);
        } else {
          // 插入到目标节点之后
          ar.splice(i + 1, 0, dragObj!);
        }
      } else {
        // 如果是作为子节点
        loop(data, dropKey, (item) => {
          // 更新parentId
          dragObj!.parentId = item.id;
          parentId = item.id ?? null; // 添加空值检查，尽管 id 应该总是存在的
          
          // 确保children数组存在
          item.children = item.children || [];
          // 将节点添加到目标节点的children的最前面
          item.children.unshift(dragObj!);
        });
      }
      
      // 更新状态
      setCategories(data);
      
      // 保存排序到服务器
      handleDragSortEnd(data);
    };
    
    return (
      <div className="category-tree-container">
        <div className="tree-instructions">
          <InfoCircleOutlined /> 拖拽分类可调整顺序和层级，直接拖动到其他分类上成为子分类，拖动到两个分类之间成为同级分类。
        </div>
        <Tree
          className="draggable-tree"
          draggable
          blockNode
          onDrop={onDrop}
          treeData={treeData}
          expandedKeys={expandedKeys as React.Key[]}
          onExpand={(keys: React.Key[]) => setExpandedKeys(keys)}
        />
      </div>
    );
  };
  
  // 文件上传组件属性
  const uploadProps = {
    name: 'file',
    action: '/api/upload/image', // 上传API
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    listType: 'picture-card' as const,
    fileList,
    onChange: handleFileChange,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('请上传图片文件!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片必须小于2MB!');
      }
      return isImage && isLt2M;
    },
    onPreview: async (file: UploadFile) => {
      let src = file.url as string;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as File);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    },
  };
  
  return (
    <div className="category-management-page">
      <Card
        title="商品分类管理"
        extra={
          <Space>
            <Button
              icon={dragMode ? <SaveOutlined /> : <DragOutlined />}
              onClick={() => setDragMode(!dragMode)}
            >
              {dragMode ? '退出排序模式' : '排序模式'}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddCategory()}
            >
              添加一级分类
            </Button>
          </Space>
        }
      >
        <div className="category-header">
          <Search
            placeholder="搜索分类名称"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
            style={{ width: 300, marginBottom: 16 }}
            allowClear
          />
        </div>
        
        {dragMode ? (
          renderCategoryTree()
        ) : (
          renderCategoryTable()
        )}
        
        {categories.length === 0 && !loading && (
          <Empty description="暂无分类数据" />
        )}
      </Card>
      
      {/* 分类表单 */}
      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleFormSubmit}
        confirmLoading={submitting}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="输入分类名称" />
          </Form.Item>
          
          <Form.Item
            name="slug"
            label="别名"
            rules={[{ required: true, message: '请输入别名' }]}
            tooltip="别名用于URL中，只能包含小写字母、数字和连字符"
          >
            <Input placeholder="输入别名，如'summer-clothes'" />
          </Form.Item>
          
          <Form.Item
            name="parentId"
            label="父级分类"
          >
            <Select
              allowClear
              placeholder="选择父级分类"
              options={flatten(categories).map(item => ({
                label: item.name,
                value: item.id,
                disabled: editingCategory && item.id === editingCategory.id
              }))}
            />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="分类描述"
          >
            <TextArea rows={4} placeholder="输入分类描述" />
          </Form.Item>
          
          <Form.Item
            name="sortOrder"
            label="排序"
            tooltip="值越小排序越靠前，相同值按创建时间排序"
            initialValue={0}
          >
            <Input type="number" placeholder="输入排序值" />
          </Form.Item>
          
          <Form.Item
            name="image"
            label="分类图片"
            valuePropName="fileList"
          >
            <Upload {...uploadProps}>
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          
          <Form.Item
            name="isActive"
            label="启用状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="停用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// 辅助函数：将分类树扁平化为一维数组，用于选择父级分类
const flatten = (items: CategoryItem[], result: CategoryItem[] = []): CategoryItem[] => {
  items.forEach(item => {
    result.push(item);
    if (item.children && item.children.length > 0) {
      flatten(item.children, result);
    }
  });
  return result;
};

export default ProductCategory;
