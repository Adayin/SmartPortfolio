import { Outlet } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '资产', emoji: '💰' },
    { path: '/market', label: '市场', emoji: '🌏' },
    { path: '/analysis', label: '分析', emoji: '📊' },
    { path: '/rebalancing', label: '调仓', emoji: '⚖️' },
    { path: '/history', label: '历史', emoji: '📜' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pb-20 md:pb-0">
      {children || <Outlet />}

      {/* Bottom Navigation - 固定在底部 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/98 to-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-40 md:relative">
        <div className="max-w-md mx-auto">
          <ul className="flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path} className="flex-1">
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center py-4 px-2 transition-all rounded-2xl mx-1 ${
                      isActive
                        ? 'text-blue-400 bg-blue-500/15'
                        : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                    }`}
                  >
                    <span className={`text-2xl mb-1 ${isActive ? 'scale-110' : ''}`}>{item.emoji}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
