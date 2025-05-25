export default {
  'GET /api/studios': (req, res) => {
    res.json({
      data: [
        {
          id: 1,
          name: '阳光摄影工作室',
          address: '北京市海淀区',
          status: '正常',
          features: ['自然光', '化妆间', '停车位'],
        },
        {
          id: 2,
          name: '星空摄影基地',
          address: '北京市朝阳区',
          status: '正常',
          features: ['大型场地', '多背景', '咖啡区'],
        },
      ],
      total: 2,
    });
  },
  'GET /api/studios/options': (req, res) => {
    res.json({
      data: [
        { label: '阳光摄影工作室', value: 1 },
        { label: '星空摄影基地', value: 2 },
      ],
    });
  },
};
