import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Analysis } from './pages/Analysis';
import Market from './pages/Market';
import { Rebalancing } from './pages/Rebalancing';
import { History } from './pages/History';

function App() {
  return (
    <ToastProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/market" element={<Market />} />
          <Route path="/rebalancing" element={<Rebalancing />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </ToastProvider>
  );
}

// 测试：直接导出一个简单组件
export function TestApp() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#0b0f19', minHeight: '100vh', color: 'white' }}>
      <h1>测试页面</h1>
      <p>如果你能看到这行文字，说明 React 在工作</p>
    </div>
  );
}

export default App;
