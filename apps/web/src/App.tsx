import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Router from './router';
import './styles/global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
