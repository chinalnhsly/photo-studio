import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Upload,
  Typography,
  Tooltip,
  Select,
  Divider,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  StarOutlined,
  PercentageOutlined,
  DollarOutlined,
  QuestionCircleOutlined,
  CheckOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { getMemberLevels, createMemberLevel, updateMemberLevel, deleteMemberLevel } from '../../services/member';
import './MemberLevels.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MemberLevel {
  id: number;
  name: string;
  code: string;
  icon?: string;
  pointsThreshold: number;
  discount: number;
  description?: string;
  benefits?: string[];
  isDefault: boolean;
  color?: string;
  memberCount: number;
}

const MemberLevels: React.FC = () => {
  const [levels, setLevels] = useState<MemberLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLevel, setEditingLevel] = useState<MemberLevel | null>(null);
  const [form] = Form.useForm();
  const [iconFile, setIconFile] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 加载会员等级数据
  useEffect(() => {
    fetchMemberLevels();
  }, []);

  const fetchMemberLevels = async () => {
    setLoading(true);
    try {
      const response = await getMemberLevels();
      setLevels(response.data);
    } catch (error) {
      console.error('获取会员等级失败', error);
      message.error('获取会员等级列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 打开添加等级对话框
  const handleAddLevel = () => {
    form.resetFields();
    setEditingLevel(null);
    setIconFile([]);
    setModalVisible(true);
  };

  // 打开编辑等级对话框
  const handleEditLevel = (level: MemberLevel) => {
    setEditingLevel(level);
    form.setFieldsValue({
      name: level.name,
      code: level.code,
      pointsThreshold: level.pointsThreshold,
      discount: level.discount * 100, // 转换为百分比显示
      description: level.description,
      benefits: level.benefits || [],
      isDefault: level.isDefault,
      color: level.color || '#333333',
    });

    if (level.icon) {
      setIconFile([
        {
          uid: '-1',
          name: 'icon.png',
          status: 'done',
          url: level.icon,
        },
      ]);
    } else {
      setIconFile([]);
    }

    setModalVisible(true);
  };

  // 图片预览处理
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as Blob);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // 处理图标上传变更
  const handleIconChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setIconFile(fileList);
  };

  // 删除会员等级
  const handleDeleteLevel = async (id: number) => {
    try {
      await deleteMemberLevel(id);
      message.success('会员等级删除成功');
      fetchMemberLevels();
    } catch (error) {
      console.error('删除会员等级失败', error);
      message.error('删除失败，该等级可能有关联会员');
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // 转换折扣值为小数
      values.discount = values.discount / 100;

      // 获取图标 URL
      const iconUrl = iconFile.length > 0
        ? (iconFile[0].url || iconFile[0].response?.url)
        : undefined;

      const submitData = {
        ...values,
        icon: iconUrl,
      };

      if (editingLevel) {
        // 更新等级
        await updateMemberLevel(editingLevel.id, submitData);
        message.success('会员等级更新成功');
      } else {
        // 创建新等级
        await createMemberLevel(submitData);
        message.success('会员等级创建成功');
      }

      setModalVisible(false);
      fetchMemberLevels();
    } catch (error) {
      console.error('保存会员等级失败', error);
      message.error('保存会员等级失败');
    } finally {
      setSubmitting(false);
    }
  };

  // 获取文件base64内容
  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // 上传组件属性
  const uploadProps = {
    name: 'file',
    listType: 'picture-card' as const,
    fileList: iconFile,
    onChange: handleIconChange,
    onPreview: handlePreview,
    action: '/api/upload',
    maxCount: 1,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片必须小于2MB!');
      }
      return isImage && isLt2M;
    },
  };

  // 表格列定义
  const columns = [
    {
      title: '等级名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: MemberLevel) => (
        <div className="level-name">
          {record.icon && (
            <img src={record.icon} alt={name} className="level-icon" />
          )}
          <span style={{ color: record.color || '#333' }}>{name}</span>
          {record.isDefault && <Tag color="green">默认</Tag>}
        </div>
      ),
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '积分门槛',
      dataIndex: 'pointsThreshold',
      key: 'pointsThreshold',
      render: (points: number) => (
        <div className="point-threshold">
          <StarOutlined className="point-icon" />
          <span>{points}</span>
        </div>
      ),
    },
    {
      title: '折扣权益',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => (
        <div className="member-discount">
          <PercentageOutlined className="discount-icon" />
          <span>{(discount * 100).toFixed(0)}%</span>
        </div>
      ),
    },
    {
      title: '特权',
      dataIndex: 'benefits',
      key: 'benefits',
      render: (benefits: string[]) => (
        <div className="level-benefits">
          {benefits && benefits.length > 0 ? (
            benefits.slice(0, 2).map((benefit, index) => (
              <Tag key={index} className="benefit-tag">{benefit}</Tag>
            ))
          ) : (
            <span className="no-benefits">无特权</span>
          )}
          {benefits && benefits.length > 2 && (
            <Tooltip title={benefits.slice(2).join(', ')}>
              <Tag className="benefit-tag">+{benefits.length - 2}</Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: '会员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MemberLevel) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditLevel(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={
              <>
                <div>确定要删除此会员等级吗?</div>
                <div style={{ fontSize: 'smaller', marginTop: '8px' }}>
                  删除后将影响关联会员权益，默认等级无法删除
                </div>
              </>
            }
            onConfirm={() => handleDeleteLevel(record.id)}
            disabled={record.isDefault}
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              disabled={record.isDefault}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="member-levels-page">
      <Card
        title="会员等级管理"
        className="page-card"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddLevel}
          >
            添加等级
          </Button>
        }
      >
        <div className="level-description">
          <Text>
            会员等级决定会员享有的折扣和权益，根据积分门槛自动升级。每个等级可以设置不同的折扣比例和特殊权益，需要设置一个默认等级作为新会员的初始等级。
          </Text>
        </div>
        
        <Table
          dataSource={levels}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="levels-table"
        />
        
        <div className="rules-section">
          <Divider orientation="left">
            <Space>
              <InfoCircleOutlined />
              <span>会员等级规则说明</span>
            </Space>
          </Divider>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <div className="rule-item">
                <Title level={5}>积分获取</Title>
                <ul>
                  <li>消费1元获得1积分</li>
                  <li>首次注册赠送100积分</li>
                  <li>每日签到获得5积分</li>
                  <li>评价晒图获得20积分</li>
                </ul>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="rule-item">
                <Title level={5}>等级提升</Title>
                <ul>
                  <li>系统每天自动计算会员积分</li>
                  <li>达到等级门槛自动升级</li>
                  <li>等级有效期为1年</li>
                  <li>到期后不满足积分将降级</li>
                </ul>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="rule-item">
                <Title level={5}>等级特权</Title>
                <ul>
                  <li>不同等级享受专属折扣</li>
                  <li>高等级会员专享活动</li>
                  <li>生日特权和礼品</li>
                  <li>预约和售后优先服务</li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
      
      {/* 等级编辑对话框 */}
      <Modal
        title={editingLevel ? '编辑会员等级' : '添加会员等级'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={submitting} 
            onClick={handleSubmit}
          >
            保存
          </Button>,
        ]}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          className="level-form"
        >
          <div className="level-form-container">
            <div className="level-form-left">
              <Form.Item
                name="name"
                label="等级名称"
                rules={[{ required: true, message: '请输入等级名称' }]}
              >
                <Input placeholder="请输入等级名称，如黄金会员" />
              </Form.Item>
              
              <Form.Item
                name="code"
                label="等级编码"
                rules={[
                  { required: true, message: '请输入等级编码' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '编码只能包含字母、数字和下划线' }
                ]}
                tooltip="编码用于系统识别等级，只能包含字母、数字和下划线"
              >
                <Input placeholder="请输入等级编码，如 gold" />
              </Form.Item>
              
              <Form.Item
                name="pointsThreshold"
                label="积分门槛"
                rules={[{ required: true, message: '请输入积分门槛' }]}
                tooltip="会员达到此积分后自动升级到此等级"
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="输入升级所需积分值" />
              </Form.Item>
              
              <Form.Item
                name="discount"
                label="折扣比例 (%)"
                rules={[{ required: true, message: '请输入折扣比例' }]}
                tooltip="购买商品时的折扣比例，例如90表示9折"
              >
                <InputNumber
                  min={1}
                  max={100}
                  style={{ width: '100%' }}
                  placeholder="输入折扣百分比，如 90 表示九折"
                />
              </Form.Item>
              
              <Form.Item
                name="color"
                label="等级颜色"
                tooltip="用于在系统中显示等级名称的颜色"
              >
                <Select placeholder="请选择等级颜色">
                  <Option value="#333333">默认</Option>
                  <Option value="#1890ff">蓝色</Option>
                  <Option value="#52c41a">绿色</Option>
                  <Option value="#fa8c16">橙色</Option>
                  <Option value="#f5222d">红色</Option>
                  <Option value="#722ed1">紫色</Option>
                  <Option value="#faad14">金色</Option>
                  <Option value="#c0c0c0">银色</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="isDefault"
                label="设为默认等级"
                valuePropName="checked"
                tooltip="新会员注册时将拥有此等级，只能有一个默认等级"
              >
                <Switch />
              </Form.Item>
            </div>
            
            <div className="level-form-right">
              <Form.Item
                label="等级图标"
              >
                <Upload {...uploadProps}>
                  {iconFile.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传</div>
                    </div>
                  )}
                </Upload>
                <div className="upload-hint">
                  建议上传尺寸: 200x200px, PNG透明背景
                </div>
              </Form.Item>
              
              <Form.Item
                name="description"
                label="等级描述"
              >
                <TextArea rows={4} placeholder="请输入等级描述信息" />
              </Form.Item>
              
              <Form.Item
                name="benefits"
                label="等级权益"
                tooltip="每条权益将显示在会员中心"
              >
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="输入权益并回车添加，如：生日礼品"
                  tokenSeparators={[',']}
                />
              </Form.Item>
            </div>
          </div>
          
          <div className="level-preview">
            <div className="preview-title">
              <Divider orientation="left">等级卡片预览</Divider>
            </div>
            <div className="preview-card">
              <div className="level-badge">
                {(iconFile.length > 0 && (iconFile[0].url || iconFile[0].thumbUrl)) ? (
                  <img src={iconFile[0].url || iconFile[0].thumbUrl} className="badge-icon" alt="等级图标" />
                ) : (
                  <StarOutlined className="badge-icon-placeholder" />
                )}
                <span className="badge-name" style={{ color: form.getFieldValue('color') || '#333333' }}>
                  {form.getFieldValue('name') || '会员等级'}
                </span>
              </div>
              <div className="level-discount">
                <PercentageOutlined /> 专享{form.getFieldValue('discount') || 100}%折扣
              </div>
              <div className="level-benefits">
                {(form.getFieldValue('benefits') || []).map((benefit: string, index: number) => (
                  <div key={index} className="benefit-item">
                    <CheckOutlined /> {benefit}
                  </div>
                ))}
                {!(form.getFieldValue('benefits') || []).length && (
                  <div className="no-benefits">暂无特权</div>
                )}
              </div>
              <div className="level-threshold">
                <StarOutlined /> 所需积分: {form.getFieldValue('pointsThreshold') || 0}
              </div>
            </div>
          </div>
        </Form>
      </Modal>
      
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default MemberLevels;
