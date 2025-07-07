import React from 'react';
import { Card, Descriptions, Button, Tag, Spin, Divider, message } from 'antd';
import { useParams } from 'umi';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { history } from '../../utils/compatibility';

interface EmployeeDetailProps {}

const EmployeeDetail: React.FC<EmployeeDetailProps> = () => {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [employeeData, setEmployeeData] = React.useState<any>(null);

  React.useEffect(() => {
    fetchEmployeeData();
  }, [params.id]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setEmployeeData({
        id: params.id,
        name: '张三',
        gender: '男',
        position: '摄影师',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区',
        joinDate: '2022-03-15',
        status: 'active',
        remark: '资深摄影师',
        projects: 45,
        level: '高级'
      });
      setLoading(false);
    }, 1000);
  };

  const handleEdit = () => {
    history.push(`/employee/edit/${params.id}`);
  };

  const handleBack = () => {
    history.push('/employee/list');
  };

  return (
    <div className="employee-detail-page">
      <Card
        title={
          <div>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
              style={{ marginRight: 16 }}
            >
              返回
            </Button>
            员工详情
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={handleEdit}
          >
            编辑
          </Button>
        }
      >
        <Spin spinning={loading}>
          {employeeData ? (
            <div className="employee-info">
              <Descriptions bordered>
                <Descriptions.Item label="姓名">{employeeData.name}</Descriptions.Item>
                <Descriptions.Item label="性别">{employeeData.gender}</Descriptions.Item>
                <Descriptions.Item label="职位">{employeeData.position}</Descriptions.Item>
                <Descriptions.Item label="手机号">{employeeData.phone}</Descriptions.Item>
                <Descriptions.Item label="邮箱" span={2}>{employeeData.email}</Descriptions.Item>
                <Descriptions.Item label="地址" span={3}>{employeeData.address}</Descriptions.Item>
                <Descriptions.Item label="入职日期">{employeeData.joinDate}</Descriptions.Item>
                <Descriptions.Item label="状态">
                  {employeeData.status === 'active' ? (
                    <Tag color="green">在职</Tag>
                  ) : (
                    <Tag color="red">离职</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="经验等级">{employeeData.level}</Descriptions.Item>
                <Descriptions.Item label="完成项目数">{employeeData.projects} 个</Descriptions.Item>
                <Descriptions.Item label="备注" span={2}>
                  {employeeData.remark}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : (
            <div className="empty-data">暂无数据</div>
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default EmployeeDetail;
