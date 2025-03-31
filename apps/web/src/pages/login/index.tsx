import { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Role } from '@prisma/client';
import { auth } from '@/services/api';
import type { LoginRequest, LoginResponse } from '@/types/auth';
import styles from './index.module.css';

// 定义标签页类型
type TabKey = 'login' | 'register' | 'resetPassword';

const roleOptions = [
  { label: '普通用户', value: Role.USER },
  { label: '员工', value: Role.STAFF },
  { label: '管理员', value: Role.ADMIN },
];

interface ResetPasswordForm {
  email: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('login');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data } = await auth.login(values);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: { 
    email: string; 
    password: string; 
    name: string; 
    confirmPassword: string;
    role: Role;
    phone?: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      await auth.register({
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role as Role,
        phone: values.phone
      });
      message.success('注册成功，请登录');
      setActiveTab('login');
      form.resetFields();
    } catch (error) {
      message.error('注册失败');
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (values: ResetPasswordForm) => {
    setLoading(true);
    try {
      // TODO: 实现密码重置接口
      message.success('重置密码邮件已发送，请查收');
      setActiveTab('login');
    } catch (error) {
      message.error('发送重置邮件失败');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'login',
      label: '登录',
      children: (
        <Form onFinish={onLogin}>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'register',
      label: '注册',
      children: (
        <Form form={form} onFinish={onRegister} initialValues={{ role: 'USER' }}>
          <Form.Item name="email" rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}>
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item name="phone" rules={[{ pattern: /^1\d{10}$/, message: '请输入有效的手机号' }]}>
            <Input placeholder="手机号（选填）" />
          </Form.Item>
          <Form.Item name="role" rules={[{ required: true, message: '请选择角色' }]}>
            <Select
              options={roleOptions}
              placeholder="请选择角色"
            />
          </Form.Item>
          <Form.Item name="password" rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度不能小于6位' }
          ]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: '请确认密码' }]}>
            <Input.Password placeholder="确认密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'resetPassword',
      label: '找回密码',
      children: (
        <Form onFinish={onResetPassword}>
          <Form.Item name="email" rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}>
            <Input placeholder="请输入注册邮箱" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              发送重置邮件
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="影楼管理系统" style={{ width: 400 }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key as TabKey)}
          items={items}
          centered
        />
      </Card>
    </div>
  );
}
