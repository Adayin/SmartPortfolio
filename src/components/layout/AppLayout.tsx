import { Outlet } from 'react-router-dom';
import { LayoutGrid, PieChart, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function AppLayout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '仪表盘', icon: LayoutGrid },
    { path: '/analysis', label: '分析', icon: PieChart },
    { path: '/rebalancing', label: '调仓', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pb-16 md:pb-0">
      {children || <Outlet />}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 md:relative">
        <div className="max-w-md mx-auto">
          <ul className="flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path} className="flex-1">
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center py-3 px-4 transition-colors ${
                      isActive ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-xs">{item.label}</span>
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
