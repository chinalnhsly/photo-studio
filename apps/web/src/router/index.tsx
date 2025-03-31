import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login';
import DashboardLayout from '../layouts/DashboardLayout';
import ProductList from '../pages/products';
import CategoryManage from '../pages/products/components/CategoryManage';
import { useAuth } from '../hooks/useAuth';

export default function Router() {
  const { isAuthenticated } = useAuth();
  
  console.log('路由初始化, 认证状态:', isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<div>仪表盘</div>} />
        <Route path="product-list" element={<ProductList key="product-list" />} /> {/* 添加key强制刷新 */}
        <Route path="categories" element={<CategoryManage key="categories" />} /> {/* 添加key强制刷新 */}
      </Route>
    </Routes>
  );
}
