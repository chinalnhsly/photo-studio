import React from 'react';
import { Card, Form, Input, Button, Select, DatePicker, Radio, message, Spin } from 'antd';
import { useParams } from 'umi';
import { history } from '../../utils/compatibility';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import './EmployeeEdit.less';

const { Option } = Select;
const { TextArea } = Input;

interface EmployeeEditParams {
  id?: string;
}

const EmployeeEdit: React.FC = () => {
  const params = useParams<EmployeeEditParams>();
  const [form] = Form.useForm();
  const isEdit = !!params.id;
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isEdit) {
      fetchEmployeeData();
    }
  }, [params.id]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      form.setFieldsValue({
        name: '张三',
        gender: 'male',
        position: 'photographer',
        phone: '13800138000',
        email: 'zhangsan@example.com',
        address: '北京市朝阳区',
        joinDate: '2022-03-15',
        status: 'active',
        remark: '资深摄影师'
      });
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async (values: any) => {
    console.log('提交的数据:', values);
    message.success(`${isEdit ? '更新' : '创建'}员工成功`);
    history.push('/employee/list');
  };

  const handleBack = () => {
    history.push('/employee/list');
  };

  return (
    <div className="employee-edit-page">
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
            {isEdit ? '编辑员工' : '新增员工'}
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              gender: 'male',
              status: 'active'
            }}
          >
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>
            
            <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Radio.Group>
                <Radio value="male">男</Radio>
                <Radio value="female">女</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              name="position"
              label="职位"
              rules={[{ required: true, message: '请选择职位' }]}
            >
              <Select placeholder="请选择职位">
                <Option value="photographer">摄影师</Option>
                <Option value="assistant">助理</Option>
                <Option value="receptionist">前台</Option>
                <Option value="manager">经理</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="phone"
              label="手机号"
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            
            <Form.Item
              name="email"
              label="邮箱"
            >
              <Input placeholder="请输入邮箱" />
            </Form.Item>
            
            <Form.Item
              name="address"
              label="地址"
            >
              <Input placeholder="请输入地址" />
            </Form.Item>
            
            <Form.Item
              name="joinDate"
              label="入职日期"
            >
              <Input placeholder="YYYY-MM-DD" />
            </Form.Item>
            
            <Form.Item
              name="status"
              label="状态"
            >
              <Radio.Group>
                <Radio value="active">在职</Radio>
                <Radio value="leave">离职</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              name="remark"
              label="备注"
            >
              <TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
            
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
              >
                保存
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default EmployeeEdit;
