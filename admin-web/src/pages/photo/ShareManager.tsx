import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tooltip,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  DatePicker,
  message,
  Popconfirm,
  Divider,
  Typography,
  Menu,
  Dropdown,
  Radio,
  Select,
  Alert,
} from "antd";
import {
  ShareAltOutlined,
  LockOutlined,
  UnlockOutlined,
  CopyOutlined,
  DeleteOutlined,
  ReloadOutlined,
  MailOutlined,
  QrcodeOutlined,
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { QRCodeSVG } from "qrcode.react";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { history } from "umi"; // 修正导入方式
import {
  getPhotoShareLinks,
  createShareLink,
  updateShareLink,
  deletePhotoShareLink,
  extendShareExpiration,
} from "../../services/photo";

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface ShareLink {
  id: string;
  title: string;
  url: string;
  password?: string;
  expiresAt: string;
  createdAt: string;
  photoCount: number;
  downloadAllowed: boolean;
  viewCount: number;
  downloadCount: number;
  isExpired: boolean;
  albumId?: number;
  albumName?: string;
  customerId?: number;
  customerName?: string;
}

// 模拟相册数据
const albums = [
  { id: 1, name: "婚纱照", photoCount: 120 },
  { id: 2, name: "儿童写真", photoCount: 45 },
  { id: 3, name: "证件照", photoCount: 18 },
  { id: 4, name: "全家福", photoCount: 32 },
];

// 模拟客户数据
const customers = [
  { id: 101, name: "张三", phone: "13800138001" },
  { id: 102, name: "李四", phone: "13800138002" },
  { id: 103, name: "王五", phone: "13800138003" },
  { id: 104, name: "赵六", phone: "13800138004" },
];

const ShareManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);
  const [currentShare, setCurrentShare] = useState<ShareLink | null>(null);
  const [form] = Form.useForm();
  // 删除 useHistory，直接使用导入的 history
  
  // 初始化获取数据
  useEffect(() => {
    fetchShareLinks();
  }, []);

  // 获取分享链接列表
  const fetchShareLinks = async () => {
    setLoading(true);
    try {
      const response = await getPhotoShareLinks({});
      // 转换API返回数据以匹配ShareLink接口
      const formattedLinks = response.data.map((item) => ({
        id: item.id,
        title: item.title || `分享 #${item.id}`,
        url: item.url,
        password: item.hasPassword ? item.password : undefined,
        expiresAt:
          item.expiresAt ||
          moment().add(30, "days").format("YYYY-MM-DD HH:mm:ss"),
        createdAt: item.createdAt,
        photoCount: item.photoCount || 0,
        downloadAllowed: item.allowDownload ?? true,
        viewCount: item.viewCount || 0,
        downloadCount: item.downloadCount || 0,
        isExpired: item.expiresAt
          ? moment(item.expiresAt).isBefore(moment())
          : false,
        albumId: item.resourceId,
        albumName: item.resourceName,
        customerId: undefined,
        customerName: undefined,
      }));

      setShareLinks(formattedLinks);
    } catch (error) {
      console.error("获取分享链接失败:", error);
      message.error("获取分享链接列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 打开创建链接对话框
  const handleCreate = () => {
    form.resetFields();
    form.setFieldsValue({
      expirationDays: 7,
      downloadAllowed: true,
    });
    setCurrentShare(null);
    setModalVisible(true);
  };

  // 打开编辑链接对话框
  const handleEdit = (record: ShareLink) => {
    form.resetFields();
    form.setFieldsValue({
      title: record.title,
      password: record.password,
      expirationDays: moment(record.expiresAt).diff(moment(), "days") + 1,
      downloadAllowed: record.downloadAllowed,
    });
    setCurrentShare(record);
    setModalVisible(true);
  };

  // 显示二维码
  const handleShowQRCode = (record: ShareLink) => {
    setCurrentShare(record);
    setQrCodeVisible(true);
  };

  // 处理删除分享链接
  const handleDelete = async (id: string) => {
    try {
      await deletePhotoShareLink(id);
      message.success("链接已删除");
      fetchShareLinks();
    } catch (error) {
      console.error("删除分享链接失败:", error);
      message.error("删除失败");
    }
  };

  // 延长分享链接有效期
  const handleExtendExpiration = async (id: string, days: number) => {
    try {
      await extendShareExpiration(id, days);
      message.success(`有效期已延长${days}天`);
      fetchShareLinks();
    } catch (error) {
      console.error("延长有效期失败:", error);
      message.error("操作失败");
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const expiresAt = moment()
        .add(values.expirationDays, "days")
        .format("YYYY-MM-DD HH:mm:ss");

      if (currentShare) {
        // 更新分享
        await updateShareLink(currentShare.id, {
          expireDays: values.expirationDays,
          password: values.password,
          allowDownload: values.downloadAllowed,
          isActive: true,
        });
        message.success("分享链接更新成功");
      } else {
        // 创建新分享
        const photoIds = values.photoIds || [];
        const response = await createShareLink({
          type: values.photoSource === "album" ? "album" : "photo",
          resourceId:
            values.photoSource === "album" ? values.albumId : undefined,
          expireDays: values.expirationDays,
          password: values.password,
          allowDownload: values.downloadAllowed,
          allowComment: false,
        });

        Modal.success({
          title: "分享链接创建成功",
          content: (
            <div>
              <p>您可以将此链接发送给客户：</p>
              <Input.TextArea
                value={response.data.url}
                readOnly
                rows={2}
                style={{ marginBottom: 16 }}
              />
              {values.password && (
                <p>
                  访问密码: <Text strong>{values.password}</Text>
                </p>
              )}
            </div>
          ),
        });
      }

      setModalVisible(false);
      fetchShareLinks();
    } catch (error) {
      console.error("表单提交失败:", error);
      message.error("操作失败，请检查表单");
    }
  };

  // 发送邮件给客户
  const handleSendEmail = (shareLink: ShareLink) => {
    if (!shareLink.customerName) {
      message.warning("此分享链接未关联客户");
      return;
    }

    // 跳转到邮件发送界面
    Modal.confirm({
      title: "发送分享链接",
      content: (
        <div>
          <p>即将打开邮件发送页面，给以下客户发送分享链接：</p>
          <p>
            <strong>{shareLink.customerName}</strong>
          </p>
        </div>
      ),
      onOk: () => {
        history.push({
          pathname: "/message/send",
          state: {
            type: "email",
            customerId: shareLink.customerId,
            subject: `您的照片 - ${shareLink.title}`,
            content: `
              尊敬的客户，您好：
              
              您的照片已经准备好了，请点击以下链接查看：
              ${shareLink.url}
              
              ${shareLink.password ? `访问密码: ${shareLink.password}` : ""}
              
              链接将在 ${moment(shareLink.expiresAt).format(
                "YYYY-MM-DD"
              )} 过期，请及时查看。
              
              谢谢！
            `,
          },
        });
      },
    });
  };

  // 表格列定义
  const columns = [
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: ShareLink) => (
        <Space direction="vertical" size={0}>
          <Text strong ellipsis style={{ width: 200 }}>
            {text}
          </Text>
          {record.albumName && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              相册: {record.albumName}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "链接",
      dataIndex: "url",
      key: "url",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Input.TextArea
            value={text}
            autoSize
            readOnly
            style={{ width: 240 }}
          />
          <CopyToClipboard
            text={text}
            onCopy={() => message.success("链接已复制到剪贴板")}
          >
            <Button
              icon={<CopyOutlined />}
              type="text"
              style={{ marginLeft: 8 }}
            />
          </CopyToClipboard>
        </div>
      ),
    },
    {
      title: "照片数量",
      dataIndex: "photoCount",
      key: "photoCount",
      render: (count: number) => `${count} 张`,
    },
    {
      title: "客户",
      dataIndex: "customerName",
      key: "customerName",
      render: (name: string | undefined) => name || <Text type="secondary">未关联</Text>,
    },
    {
      title: "安全设置",
      key: "security",
      render: (_: any, record: ShareLink) => (
        <Space>
          {record.password ? (
            <Tooltip title={`密码: ${record.password}`}>
              <Tag icon={<LockOutlined />} color="blue">
                有密码
              </Tag>
            </Tooltip>
          ) : (
            <Tooltip title="公开链接，无需密码">
              <Tag icon={<UnlockOutlined />}>无密码</Tag>
            </Tooltip>
          )}

          {record.downloadAllowed ? (
            <Tag icon={<DownloadOutlined />} color="green">
              可下载
            </Tag>
          ) : (
            <Tag icon={<EyeOutlined />}>仅查看</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "使用情况",
      key: "usage",
      render: (_: any, record: ShareLink) => (
        <Space direction="vertical" size={0}>
          <div>查看: {record.viewCount} 次</div>
          {record.downloadAllowed && <div>下载: {record.downloadCount} 次</div>}
        </Space>
      ),
    },
    {
      title: "有效期",
      key: "expiration",
      render: (_: any, record: ShareLink) => {
        const isExpired = record.isExpired;
        const expiryDate = moment(record.expiresAt);
        const daysLeft = expiryDate.diff(moment(), "days");

        return (
          <Space direction="vertical" size={0}>
            {isExpired ? (
              <Tag color="red">已过期</Tag>
            ) : (
              <Tag color={daysLeft <= 3 ? "warning" : "green"}>
                剩余 {daysLeft} 天
              </Tag>
            )}
            <div style={{ fontSize: 12, color: "#999" }}>
              {expiryDate.format("YYYY-MM-DD")}
            </div>
          </Space>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: ShareLink) => (
        <Space size="small">
          <Tooltip title="查看预览">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => window.open(record.url, "_blank")}
            />
          </Tooltip>

          <Tooltip title="显示二维码">
            <Button
              type="text"
              size="small"
              icon={<QrcodeOutlined />}
              onClick={() => handleShowQRCode(record)}
            />
          </Tooltip>

          <Tooltip title="编辑分享设置">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip title="发送邮件通知">
            <Button
              type="text"
              size="small"
              icon={<MailOutlined />}
              onClick={() => handleSendEmail(record)}
              disabled={!record.customerId}
            />
          </Tooltip>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="extend7"
                  onClick={() => handleExtendExpiration(record.id, 7)}
                >
                  延长7天
                </Menu.Item>
                <Menu.Item
                  key="extend30"
                  onClick={() => handleExtendExpiration(record.id, 30)}
                >
                  延长30天
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="delete" danger>
                  <Popconfirm
                    title="确定要删除此分享链接吗？"
                    onConfirm={() => handleDelete(record.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    删除
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="text" size="small" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="share-manager-page">
      <Card
        title="分享管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchShareLinks}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<ShareAltOutlined />}
              onClick={handleCreate}
            >
              创建分享
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={shareLinks}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* 创建/编辑分享链接对话框 */}
      <Modal
        title={currentShare ? "编辑分享链接" : "创建分享链接"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="分享名称"
            rules={[{ required: true, message: "请输入分享名称" }]}
          >
            <Input placeholder="为此分享命名，如：张先生婚纱照" />
          </Form.Item>

          {!currentShare && (
            <>
              <Form.Item
                name="photoSource"
                label="照片来源"
                initialValue="selection"
              >
                <Radio.Group>
                  <Radio value="selection">已选照片</Radio>
                  <Radio value="album">相册照片</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues: Record<string, any>, currentValues: Record<string, any>) =>
                  prevValues.photoSource !== currentValues.photoSource
                }
              >
                {({ getFieldValue }: { getFieldValue: (name: string) => any }) =>
                  getFieldValue("photoSource") === "album" ? (
                    <Form.Item
                      name="albumId"
                      label="选择相册"
                      rules={[{ required: true, message: "请选择相册" }]}
                    >
                      <Select placeholder="选择要分享的相册">
                        {albums.map((album) => (
                          <Select.Option key={album.id} value={album.id}>
                            {album.name} ({album.photoCount}张)
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="photoIds"
                      label="已选照片"
                      rules={[
                        { required: true, message: "请先选择要分享的照片" },
                      ]}
                      extra="请先在照片库中选择照片，然后再创建分享"
                    >
                      <Input disabled placeholder="已选择照片ID" />
                    </Form.Item>
                  )
                }
              </Form.Item>
            </>
          )}

          <Form.Item
            name="password"
            label="访问密码"
            extra="留空则不需要密码即可访问"
          >
            <Input.Password placeholder="设置访问密码（可选）" />
          </Form.Item>

          <Form.Item
            name="expirationDays"
            label="有效期（天）"
            rules={[{ required: true, message: "请设置有效期" }]}
          >
            <InputNumber min={1} max={365} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="downloadAllowed"
            label="允许下载"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item name="customerId" label="关联客户（可选）">
            <Select
              showSearch
              placeholder="选择关联的客户"
              optionFilterProp="children"
              allowClear
            >
              {customers.map((customer) => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.phone}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 二维码对话框 */}
      <Modal
        title="分享链接二维码"
        visible={qrCodeVisible}
        onCancel={() => setQrCodeVisible(false)}
        footer={[
          <Button key="close" onClick={() => setQrCodeVisible(false)}>
            关闭
          </Button>,
          <Button
            key="download"
            type="primary"
            onClick={() => {
              // 实现二维码下载逻辑
              const canvas = document.querySelector(
                ".qrcode-container canvas"
              ) as HTMLCanvasElement;
              if (canvas) {
                const url = canvas.toDataURL("image/png");
                const a = document.createElement("a");
                a.download = `分享二维码_${
                  currentShare?.title || new Date().getTime()
                }.png`;
                a.href = url;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            }}
          >
            下载二维码
          </Button>,
        ]}
      >
        {currentShare && (
          <div style={{ textAlign: "center" }}>
            <div className="qrcode-container" style={{ margin: "20px 0" }}>
              <QRCodeSVG value={currentShare.url} size={200} />
            </div>
            <Paragraph copyable={{ text: currentShare.url }}>
              {currentShare.url}
            </Paragraph>
            {currentShare.password && (
              <div style={{ marginTop: 20 }}>
                <Alert
                  message={
                    <Space>
                      <LockOutlined />
                      <span>
                        访问密码:{" "}
                        <Text strong copyable>
                          {currentShare.password}
                        </Text>
                      </span>
                    </Space>
                  }
                  type="info"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShareManager;
