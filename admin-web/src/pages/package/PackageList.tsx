import React, { useState, useRef } from "react";
import {
  Card,
  Button,
  Tag,
  Space,
  Image,
  message,
  Modal,
  Dropdown,
  Menu,
  Typography,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { history, Link } from "umi";
import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import "./PackageList.less";

const { Paragraph } = Typography;

// 套餐类型定义
type PackageItem = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  status: string;
  description: string;
  features: string[];
  cover: string;
  salesCount: number;
  createdAt: string;
};

const PackageList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRows, setSelectedRows] = useState<PackageItem[]>([]);
 // const history = useHistory();
  // 删除套餐
  const handleDelete = async (id: number) => {
    try {
      // 实际项目中这里应该调用API删除套餐
      message.success("套餐删除成功");
      actionRef.current?.reload();
    } catch (error) {
      message.error("删除失败");
    }
  };

  // 批量删除
  const handleBatchDelete = () => {
    Modal.confirm({
      title: "批量删除套餐",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRows.length} 个套餐吗？此操作不可撤销。`,
      okText: "确认删除",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          // 实际项目中这里应该调用API批量删除套餐
          message.success(`成功删除 ${selectedRows.length} 个套餐`);
          setSelectedRows([]);
          actionRef.current?.reload();
        } catch (error) {
          message.error("批量删除失败");
        }
      },
    });
  };

  // 套餐状态映射
  const statusMap = {
    active: { color: "green", text: "已上架" },
    inactive: { color: "default", text: "已下架" },
    soldout: { color: "red", text: "已售罄" },
    coming: { color: "blue", text: "即将推出" },
  };

  // 表格列定义
  const columns: ProColumns<PackageItem>[] = [
    {
      title: "套餐",
      dataIndex: "name",
      render: (_, record) => (
        <div className="package-info">
          <div className="package-cover">
            <Image
              src={record.cover || "https://via.placeholder.com/100"}
              alt={record.name}
              width={80}
              height={60}
              preview={false}
            />
          </div>
          <div className="package-details">
            <div className="package-name">
              <Link to={`/package/detail/${record.id}`}>{record.name}</Link>
            </div>
            <div className="package-category">
              <Tag>{record.category}</Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "价格",
      dataIndex: "price",
      sorter: true,
      render: (_, record) => (
        <div className="package-price-info">
          <div className="current-price">¥{record.price}</div>
          {record.originalPrice && record.originalPrice > record.price && (
            <div className="original-price">¥{record.originalPrice}</div>
          )}
        </div>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      filters: Object.entries(statusMap).map(([key, { text }]) => ({
        text,
        value: key,
      })),
      render: (status) => {
        const { color, text } = statusMap[status as keyof typeof statusMap] || {
          color: "default",
          text: "未知状态",
        };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "销量",
      dataIndex: "salesCount",
      sorter: true,
    },
    {
      title: "说明",
      dataIndex: "description",
      search: false,
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2, tooltip: text }}>{text}</Paragraph>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      valueType: "dateTime",
      sorter: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => history.push(`/package/detail/${record.id}`)}>
            <EyeOutlined /> 查看
          </a>
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    key: "edit",
                    icon: <EditOutlined />,
                    label: <Link to={`/package/edit/${record.id}`}>编辑</Link>,
                  },
                  {
                    key: "delete",
                    icon: <DeleteOutlined />,
                    danger: true,
                    label: (
                      <Popconfirm
                        title="确定删除该套餐?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="删除"
                        cancelText="取消"
                      >
                        <a>删除</a>
                      </Popconfirm>
                    ),
                  },
                ]}
              />
            }
          >
            <a>
              <MoreOutlined /> 更多
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  // 模拟获取套餐数据
  const fetchPackageList = async (params: any, sorter: any, filter: any) => {
    // 实际项目中这里应该调用API获取套餐数据
    const mockData: PackageItem[] = [
      {
        id: 1,
        name: "婚纱摄影基础套餐",
        price: 3999,
        originalPrice: 4999,
        category: "婚纱摄影",
        status: "active",
        description: "包含10张精修照片，1套服装，1个场景，拍摄时间3小时。",
        features: ["10张精修", "1套服装", "1个场景", "3小时拍摄"],
        cover: "https://via.placeholder.com/300/FF5733/FFFFFF?text=Wedding",
        salesCount: 125,
        createdAt: "2023-02-10 09:00:00",
      },
      {
        id: 2,
        name: "全家福高级套餐",
        price: 2499,
        originalPrice: 2999,
        category: "全家福",
        status: "active",
        description: "包含8张精修照片，2套服装，2个场景，拍摄时间2小时。",
        features: ["8张精修", "2套服装", "2个场景", "2小时拍摄"],
        cover: "https://via.placeholder.com/300/33A8FF/FFFFFF?text=Family",
        salesCount: 87,
        createdAt: "2023-03-15 10:30:00",
      },
      {
        id: 3,
        name: "儿童摄影套餐",
        price: 1299,
        category: "儿童摄影",
        status: "inactive",
        description: "包含6张精修照片，2套服装，1个场景，拍摄时间1.5小时。",
        features: ["6张精修", "2套服装", "1个场景", "1.5小时拍摄"],
        cover: "https://via.placeholder.com/300/FF33A8/FFFFFF?text=Kids",
        salesCount: 56,
        createdAt: "2023-04-20 14:15:00",
      },
    ];

    return {
      data: mockData,
      success: true,
      total: mockData.length,
    };
  };

  return (
    <div className="package-list-page">
      <Card>
        <ProTable<PackageItem>
          headerTitle="套餐管理"
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button
              key="create"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => history.push("/package/create")}
            >
              新增套餐
            </Button>,
            selectedRows.length > 0 && (
              <Button key="remove" danger onClick={handleBatchDelete}>
                批量删除
              </Button>
            ),
          ]}
          request={fetchPackageList}
          columns={columns}
          rowSelection={{
            onChange: (_: React.Key[], selectedRows: PackageItem[]) => {
              setSelectedRows(selectedRows);
            },
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};

export default PackageList;
