export default {
  'GET /api/analytics': (req, res) => {
    res.json({
      data: {
        sales: [100, 200, 150, 300],
        customers: [10, 20, 15, 30],
      },
    });
  },
};
