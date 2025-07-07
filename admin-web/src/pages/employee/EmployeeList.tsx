import React, { useState, useRef } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  Avatar,
  Modal,
  message,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Col,
  Input,
  Switch
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
  UserAddOutlined
} from '@ant-design/icons';
// 导入Link组件
import { useParams, Link } from 'umi';
// 从兼容层导入history，而不是从umi
import { history } from '../../utils/compatibility';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import './EmployeeList.less';

// 员工类型
interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  status: string;
  avatar?: string;
}

const EmployeeList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [visible, setVisible] = useState<boolean>(false);

  // 删除员工
  const handleDelete = async (id: number) => {
    try {
      // 实际项目中这里应该调用API删除员工
      message.success('员工删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 批量删除员工
  const handleBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 名员工吗？此操作不可逆。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        // 实际项目中这里应该调用API批量删除员工
        message.success(`成功删除 ${selectedRowKeys.length} 名员工`);
        setSelectedRowKeys([]);
        actionRef.current?.reload();
      },
    });
  };

  // 导入员工
  const handleImportClick = () => {
    setVisible(true);
  };

  // 导出员工
  const handleExport = () => {
    message.success('正在导出员工数据...');
    // 实际项目中这里应该调用API导出数据
    setTimeout(() => {
      message.success('员工数据导出成功！');
    }, 1500);
  };

  // 表格列定义
  const columns: ProColumns<Employee>[] = [
    {
      title: '员工',
      dataIndex: 'name',
      render: (_, record) => (
        <div className="employee-info">
          <Avatar src={record.avatar} size="small" className="employee-avatar" />
          <div className="employee-name">
            <Link to={`/employee/detail/${record.id}`}>{record.name}</Link>
          </div>
        </div>
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      valueEnum: {
        'photographer': { text: '摄影师' },
        'receptionist': { text: '前台' },
        'manager': { text: '经理' },
        'assistant': { text: '助理' },
        'postProduction': { text: '后期制作' },
      },
      render: (_, record) => {
        const positionColorMap = {
          photographer: 'blue',
          receptionist: 'green',
          manager: 'purple',
          assistant: 'orange',
          postProduction: 'cyan',
        };
        
        const positionTextMap = {
          photographer: '摄影师',
          receptionist: '前台',
          manager: '经理',
          assistant: '助理',
          postProduction: '后期制作',
        };
        
        return (
          <Tag color={positionColorMap[record.position as keyof typeof positionColorMap]}>
            {positionTextMap[record.position as keyof typeof positionTextMap] || record.position}
          </Tag>
        );
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      valueEnum: {
        'photography': { text: '摄影部' },
        'customer': { text: '客服部' },
        'admin': { text: '行政部' },
        'production': { text: '制作部' },
      },
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      copyable: true,
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
      search: false,
    },
    {
      title: '入职日期',
      dataIndex: 'hireDate',
      valueType: 'date',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        'active': { text: '在职', status: 'Success' },
        'leave': { text: '请假', status: 'Warning' },
        'resigned': { text: '离职', status: 'Error' },
      },
      render: (_, record) => {
        const statusMap = {
          active: { color: 'green', text: '在职' },
          leave: { color: 'orange', text: '请假' },
          resigned: { color: 'red', text: '离职' },
        };
        
        return (
          <Tag color={statusMap[record.status as keyof typeof statusMap]?.color}>
            {statusMap[record.status as keyof typeof statusMap]?.text || record.status}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a 
          key="detail" 
          onClick={() => history.push(`/employee/detail/${record.id}`)}
        >
          <EyeOutlined /> 查看
        </a>,
        <a 
          key="edit" 
          onClick={() => history.push(`/employee/edit/${record.id}`)}
        >
          <EditOutlined /> 编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除该员工吗？"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <a><DeleteOutlined /> 删除</a>
        </Popconfirm>,
      ],
    },
  ];

  // 模拟获取员工数据
  const fetchEmployeeList = async () => {
    // 此处为模拟数据，实际项目中应该通过API获取
    const mockEmployees: Employee[] = [
      {
        id: 1,
        name: '李摄影',
        position: 'photographer',
        department: 'photography',
        phone: '13800138000',
        email: 'li@example.com',
        hireDate: '2021-03-15',
        status: 'active',
      },
      {
        id: 2,
        name: '张经理',
        position: 'manager',
        department: 'admin',
        phone: '13900139000',
        email: 'zhang@example.com',
        hireDate: '2020-01-10',
        status: 'active',
      },
      {
        id: 3,
        name: '王前台',
        position: 'receptionist',
        department: 'customer',
        phone: '13700137000',
        email: 'wang@example.com',
        hireDate: '2022-05-20',
        status: 'leave',
      },
      {
        id: 4,
        name: '赵后期',
        position: 'postProduction',
        department: 'production',
        phone: '13600136000',
        email: 'zhao@example.com',
        hireDate: '2021-11-05',
        status: 'active',
      },
      {
        id: 5,
        name: '钱助理',
        position: 'assistant',
        department: 'photography',
        phone: '13500135000',
        email: 'qian@example.com',
        hireDate: '2022-02-18',
        status: 'active',
      },
    ];
    
    return {
      data: mockEmployees,
      success: true,
      total: mockEmployees.length,
    };
  };

  return (
    <div className="employee-list-page">
      <Card>
        <ProTable<Employee>
          headerTitle="员工管理"
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
              onClick={() => history.push('/employee/create')}
            >
              新增员工
            </Button>,
            <Dropdown
              key="more"
              overlay={
                <Menu
                  items={[
                    {
                      key: 'import',
                      icon: <ImportOutlined />,
                      label: <a onClick={handleImportClick}>导入员工</a>,
                    },
                    {
                      key: 'export',
                      icon: <ExportOutlined />,
                      label: <a onClick={handleExport}>导出员工</a>,
                    },
                  ]}
                />
              }
            >
              <Button>
                更多操作 <MoreOutlined />
              </Button>
            </Dropdown>,
            selectedRowKeys.length > 0 && (
              <Button
                key="remove"
                danger
                onClick={handleBatchDelete}
              >
                批量删除
              </Button>
            ),
          ]}
          request={fetchEmployeeList}
          columns={columns}
          rowSelection={{
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
        />
      </Card>
      
      {/* 导入员工弹窗 */}
      <Modal
        title="导入员工信息"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          setVisible(false);
          message.success('导入成功');
          actionRef.current?.reload();
        }}
      >
        <div className="import-modal">
          <div className="upload-area">
            <Input type="file" accept=".xlsx,.csv" />
            <div className="upload-tip">
              <p>支持 .xlsx、.csv 格式，文件大小不超过5MB</p>
              <a href="#">下载导入模板</a>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeList;
