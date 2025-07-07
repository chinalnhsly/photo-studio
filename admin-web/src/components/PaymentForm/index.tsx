import React, { useState } from 'react';
import { Form, Input, Radio, Select, Button, DatePicker, Space, Card, Divider } from 'antd';
import { CreditCardOutlined, BankOutlined, PayCircleOutlined, WalletOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface PaymentFormProps {
  amount?: number;
  onSubmit?: (values: any) => void;
  loading?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount = 0,
  onSubmit,
  loading = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('creditCard');
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    if (onSubmit) {
      onSubmit({
        ...values,
        amount,
        paymentDate: values.paymentDate?.format('YYYY-MM-DD HH:mm:ss')
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        paymentMethod: 'creditCard',
        paymentDate: null,
      }}
    >
      <div className="payment-amount">
        <div className="amount-label">支付金额</div>
        <div className="amount-value">¥ {amount.toFixed(2)}</div>
      </div>

      <Divider />

      <Form.Item
        name="paymentMethod"
        label="支付方式"
        rules={[{ required: true, message: '请选择支付方式' }]}
      >
        <Radio.Group 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)} 
          value={paymentMethod}
          buttonStyle="solid"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio.Button value="creditCard">
              <CreditCardOutlined /> 信用卡支付
            </Radio.Button>
            <Radio.Button value="bankTransfer">
              <BankOutlined /> 银行转账
            </Radio.Button>
            <Radio.Button value="wechat">
              <PayCircleOutlined /> 微信支付
            </Radio.Button>
            <Radio.Button value="cash">
              <WalletOutlined /> 现金支付
            </Radio.Button>
          </Space>
        </Radio.Group>
      </Form.Item>

      {paymentMethod === 'creditCard' && (
        <Card size="small" title="信用卡信息" bordered={false}>
          <Form.Item
            name="cardNumber"
            label="卡号"
            rules={[{ required: true, message: '请输入信用卡号' }]}
          >
            <Input placeholder="请输入卡号" maxLength={16} />
          </Form.Item>
          
          <Form.Item
            name="cardHolder"
            label="持卡人"
            rules={[{ required: true, message: '请输入持卡人姓名' }]}
          >
            <Input placeholder="请输入持卡人姓名" />
          </Form.Item>

          <Form.Item
            name="expiry"
            label="有效期"
            rules={[{ required: true, message: '请输入有效期' }]}
          >
            <Input placeholder="MM/YY" maxLength={5} />
          </Form.Item>

          <Form.Item
            name="cvv"
            label="安全码"
            rules={[{ required: true, message: '请输入安全码' }]}
          >
            <Input placeholder="CVV" maxLength={3} />
          </Form.Item>
        </Card>
      )}
      
      {paymentMethod === 'bankTransfer' && (
        <Card size="small" title="银行转账信息" bordered={false}>
          <Form.Item
            name="bankAccount"
            label="转账账号"
            rules={[{ required: true, message: '请输入转账账号' }]}
          >
            <Input placeholder="请输入转账账号" />
          </Form.Item>
          
          <Form.Item
            name="bankName"
            label="开户银行"
            rules={[{ required: true, message: '请选择开户银行' }]}
          >
            <Select placeholder="请选择开户银行">
              <Option value="icbc">中国工商银行</Option>
              <Option value="boc">中国银行</Option>
              <Option value="ccb">中国建设银行</Option>
              <Option value="abc">中国农业银行</Option>
              <Option value="cmb">招商银行</Option>
            </Select>
          </Form.Item>
        </Card>
      )}
      
      {paymentMethod === 'wechat' && (
        <Card size="small" title="微信支付" bordered={false}>
          <div className="qrcode-container">
            <div className="qrcode-placeholder">
              <div className="qrcode-text">微信扫码支付</div>
            </div>
            <p className="qrcode-hint">请使用微信扫一扫功能扫描二维码完成支付</p>
          </div>
        </Card>
      )}
      
      {paymentMethod === 'cash' && (
        <Card size="small" title="现金支付信息" bordered={false}>
          <Form.Item
            name="cashReceiver"
            label="收款人"
            rules={[{ required: true, message: '请输入收款人' }]}
          >
            <Input placeholder="请输入收款人姓名" />
          </Form.Item>
        </Card>
      )}

      <Form.Item
        name="paymentDate"
        label="支付日期"
        rules={[{ required: true, message: '请选择支付日期' }]}
      >
        <DatePicker showTime style={{ width: '100%' }} placeholder="选择支付日期和时间" />
      </Form.Item>

      <Form.Item
        name="remarks"
        label="备注"
      >
        <Input.TextArea rows={3} placeholder="添加备注信息（可选）" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          确认支付
        </Button>
      </Form.Item>

      <style >{`
        .payment-amount {
          text-align: center;
          margin-bottom: 16px;
        }
        .amount-label {
          font-size: 16px;
          color: #666;
        }
        .amount-value {
          font-size: 28px;
          font-weight: bold;
          color: #1890ff;
        }
        .qrcode-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
        }
        .qrcode-placeholder {
          width: 200px;
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed #d9d9d9;
        }
        .qrcode-text {
          color: #666;
        }
        .qrcode-hint {
          margin-top: 8px;
          color: #999;
          font-size: 12px;
        }
      `}</style>
    </Form>
  );
};

export default PaymentForm;
