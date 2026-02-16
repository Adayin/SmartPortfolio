import { Settings } from 'lucide-react';

export function TopBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      <h1 className="text-xl font-bold text-gray-100">SmartPortfolio</h1>
      <button className="p-2 text-gray-400 hover:text-gray-100 transition-colors">
        <Settings size={20} />
      </button>
    </header>
  );
}
