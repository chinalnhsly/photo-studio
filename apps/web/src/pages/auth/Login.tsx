import React from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { auth, type RegisterData } from '../../services/api';
import type { LoginRequest } from '../../types/auth';

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [loginForm] = Form.useForm<LoginRequest>();
  const [registerForm] = Form.useForm<RegisterFormData>();
  const [resetForm] = Form.useForm<{ email: string }>();

  const handleLogin = async (values: LoginRequest) => {
    try {
      const { data } = await auth.login(values);
      login(data.access_token, data.user);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (error) {
      message.error('登录失败，请检查邮箱和密码');
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    try {
      const registerData: RegisterData = {
        email: values.email,
        password: values.password,
        name: values.name,
        role: 'USER',
      };
      
      await auth.register(registerData);
      message.success('注册成功，请登录');
      loginForm.setFieldsValue({ email: values.email });
    } catch (error) {
      message.error('注册失败，请稍后重试');
    }
  };

  const handleResetPassword = async (values: { email: string }) => {
    try {
      await auth.resetPassword(values.email);
      message.success('重置密码邮件已发送，请查收');
    } catch (error) {
      message.error('重置密码失败，请稍后重试');
    }
  };

  const items = [
    {
      key: '1',
      label: '登录',
      children: (
        <Form form={loginForm} onFinish={handleLogin}>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>登录</Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '注册',
      children: (
        <Form form={registerForm} onFinish={handleRegister}>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input placeholder="邮箱" />
          </Form.Item>
          <Form.Item name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="姓名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password placeholder="密码" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: '请确认密码' }]}>
            <Input.Password placeholder="确认密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>注册</Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '3',
      label: '找回密码',
      children: (
        <Form form={resetForm} onFinish={handleResetPassword}>
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱' }]}>
            <Input placeholder="请输入注册邮箱" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>发送重置邮件</Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>摄影工作室管理系统</h2>
        <Tabs
          defaultActiveKey="1"
          items={items}
          centered
        />
      </Card>
    </div>
  );
};
