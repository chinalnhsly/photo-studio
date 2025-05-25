export default {
  'GET /api/photographers': (req, res) => {
    res.json({
      data: [
        { id: 1, name: '张三', specialty: '婚纱', status: '在职' },
        { id: 2, name: '李四', specialty: '儿童', status: '在职' },
      ],
      total: 2,
    });
  },
  // mock 选项接口
  'GET /api/photographer/options': (req, res) => {
    res.json({
      data: [
        { label: '张三', value: 1 },
        { label: '李四', value: 2 },
      ],
    });
  },
  'GET /api/photographers/options': (req, res) => {
    res.json({
      data: [
        { label: '张三', value: 1 },
        { label: '李四', value: 2 },
      ],
    });
  },
  'GET /api/photographers/workload': (req, res) => {
    res.json({
      data: [
        { id: 1, name: '张三', workload: 12 },
        { id: 2, name: '李四', workload: 8 },
      ],
    });
  },
};
