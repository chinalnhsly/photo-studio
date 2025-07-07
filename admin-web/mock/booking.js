import moment from 'moment';

// 模拟预约状态
const bookingStatus = ['pending', 'confirmed', 'cancelled', 'completed', 'in_progress', 'no_show', 'rescheduled'];

// 模拟拍摄类型
const shootingTypes = ['standard', 'wedding', 'portrait', 'family', 'children', 'maternity', 'newborn', 'event', 'product', 'commercial'];

// 模拟摄影师数据
const photographers = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
  { id: 3, name: '王五' },
];

// 生成 mock 预约数据
const bookings = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  bookingNumber: `BK20230${i + 1}`,
  customerName: `客户${i + 1}`,
  customerPhone: `1380000000${i}`,
  date: moment().add(i, 'days').format('YYYY-MM-DD'),
  startTime: '10:00',
  endTime: '11:00',
  status: bookingStatus[i % bookingStatus.length],
  photographerId: photographers[i % photographers.length].id,
  photographerName: photographers[i % photographers.length].name,
  shootingType: shootingTypes[i % shootingTypes.length],
}));

export default {
  // mock 预约列表
  'GET /api/bookings': (req, res) => {
    res.json({
      data: {
        items: bookings,
        total: bookings.length,
      },
    });
  },
  // mock 预约日历（带参数）
  'GET /api/bookings/calendar': (req, res) => {
    res.json({
      data: [
        { date: '2025-05-01', bookings: 3 },
        { date: '2025-05-02', bookings: 2 },
        { date: '2025-05-03', bookings: 1 },
      ],
    });
  },
  // mock 预约统计分析
  'GET /api/bookings/stats': (req, res) => {
    res.json({
      data: {
        total: 15,
        byStatus: [
          { status: 'pending', count: 3 },
          { status: 'confirmed', count: 4 },
          { status: 'completed', count: 5 },
          { status: 'cancelled', count: 2 },
          { status: 'in_progress', count: 1 },
        ],
        byPhotographer: [
          { id: 1, name: '张三', count: 6 },
          { id: 2, name: '李四', count: 5 },
          { id: 3, name: '王五', count: 4 },
        ],
        byDate: [
          { date: '2025-05-01', count: 2 },
          { date: '2025-05-02', count: 3 },
          { date: '2025-05-03', count: 1 },
        ],
        photographers: [
          { id: 1, name: '张三' },
          { id: 2, name: '李四' },
          { id: 3, name: '王五' },
        ],
      },
    });
  },
  // mock 预约趋势分析
  'GET /api/bookings/trends': (req, res) => {
    res.json({
      data: [
        { date: '2025-05-01', count: 2 },
        { date: '2025-05-02', count: 3 },
        { date: '2025-05-03', count: 1 },
      ],
    });
  },
  // 你可以继续添加其他 mock 接口
};