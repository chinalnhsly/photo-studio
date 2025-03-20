import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import Router from './router';
import './styles/global.css';

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ConfigProvider>
  );
}
