import React, { useEffect, useState } from 'react';
import { Card, Table, Button, message } from 'antd';
import { Link } from 'umi';
import { getBookingList, Booking } from '../../services/booking';
import './BookingList.scss';

const BookingList: React.FC = () => {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await getBookingList();
      setData(res.data.items);
      //console.log('BookingList data:', res.data.items); // 调试输出
    } catch (e) {
      message.error('加载预约列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: '预约号', dataIndex: 'bookingNumber', key: 'bookingNumber' },
    { title: '客户姓名', dataIndex: 'customerName', key: 'customerName' },
    { title: '电话', dataIndex: 'customerPhone', key: 'customerPhone' },
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '时间', render: (_: any, r: Booking) => `${r.startTime} - ${r.endTime}` },
    { title: '状态', dataIndex: 'status', key: 'status' },
    {
      title: '操作', key: 'action', render: (_: any, r: Booking) => (
        <Link to={`/booking/detail/${r.id}`}>查看</Link>
      )
    },
  ];

  return (
    <div className="booking-list-page">
      <div style={{ color: 'red', marginBottom: 8 }}></div>
      <Card title="预约列表">
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link to="/booking/create">新建预约</Link>
        </Button>
        <Table
          rowKey="id"
          dataSource={data}
          columns={columns}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default BookingList;
