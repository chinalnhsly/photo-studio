export default {
  'GET /api/customers': (req, res) => {
    res.json({
      data: [
        { id: 1, name: '客户A', phone: '13800000001', email: 'a@example.com', gender: '男', status: '正常' },
        { id: 2, name: '客户B', phone: '13800000002', email: 'b@example.com', gender: '女', status: '禁用' },
      ],
      total: 2,
    });
  },
  // mock 选项接口（修正：同时支持 /api/customer/options 和 /api/customers/options）
  'GET /api/customer/options': (req, res) => {
    res.json({
      data: [
        { label: '客户A', value: 1 },
        { label: '客户B', value: 2 },
      ],
    });
  },
  'GET /api/customers/options': (req, res) => {
    res.json({
      data: [
        { label: '客户A', value: 1 },
        { label: '客户B', value: 2 },
      ],
    });
  },
  'POST /api/customers/export': (req, res) => {
    res.json({
      success: true,
      message: '导出成功（mock）',
      url: '/mock/export/customers.xlsx',
    });
  },
};
