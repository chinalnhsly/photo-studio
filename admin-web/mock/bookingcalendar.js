export default {
  'GET /api/booking/calendar': (req, res) => {
    res.json({
      data: [
        { id: 1, date: '2025-05-01', bookings: 3 },
        { id: 2, date: '2025-05-02', bookings: 2 },
      ],
    });
  },
};
