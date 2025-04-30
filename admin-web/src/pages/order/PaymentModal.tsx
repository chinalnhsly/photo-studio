import React, { useState } from 'react';
import { Modal, message } from 'antd';
// 修改导入路径，使用正确的相对路径
import PaymentForm from '../../components/PaymentForm';

interface PaymentModalProps {
  visible: boolean;
  orderId: number;
  amount: number;
  onSuccess?: () => void;
  onCancel: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  orderId,
  amount,
  onSuccess,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);

  // 处理支付提交
  const handlePaymentSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // 实际项目中应该调用API处理支付
      // await api.order.payment(orderId, {
      //   ...values,
      //   amount
      // });
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('支付成功');
      setLoading(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('支付失败:', error);
      message.error('支付处理失败，请重试');
      setLoading(false);
    }
  };

  return (
    <Modal
      title="订单支付"
      open={visible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose
      width={600}
    >
      <PaymentForm
        amount={amount}
        onSubmit={handlePaymentSubmit}
        loading={loading}
      />
    </Modal>
  );
};

export default PaymentModal;
