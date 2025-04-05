import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from '../components/PrivateRoute';
import { Dashboard } from '../pages/dashboard';
import { Overview } from '../pages/dashboard/Overview';
import { OrderList } from '../pages/orders/OrderList';
import { ProductList } from '../pages/products/ProductList';
import { Login } from '../pages/auth/Login';

export default function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }>
        <Route index element={<Overview />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="products" element={<ProductList />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
