import { useState, useEffect } from 'react';
import { Strategy } from '../../types/portfolio';

interface CustomStrategyConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (strategy: Strategy) => void;
  currentStrategy: Strategy;
}

export function CustomStrategyConfig({
  isOpen,
  onClose,
  onSave,
  currentStrategy
}: CustomStrategyConfigProps) {
  const [stock, setStock] = useState(currentStrategy.allocations.stock);
  const [bond, setBond] = useState(currentStrategy.allocations.bond);
  const [gold, setGold] = useState(currentStrategy.allocations.gold);
  const [cash, setCash] = useState(currentStrategy.allocations.cash);

  const total = stock + bond + gold + cash;
  const isOverLimit = total > 100;  // 超过100%才显示警告

  const handleSave = () => {
    onSave({
      id: 'custom',
      name: '自定义策略',
      description: `股票${stock}% + 债券${bond}% + 黄金${gold}% + 现金${cash}%`,
      allocations: { stock, bond, gold, cash },
    });
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center bg-black/50 backdrop-blur-sm`}>
      <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span>⚙️</span>
            <span>自定义策略配置</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 text-2xl transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <span>🚀</span>
                <span>股票占比</span>
              </span>
              <span className="text-emerald-400 font-bold">{stock}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <span>🛡️</span>
                <span>债券占比</span>
              </span>
              <span className="text-emerald-400 font-bold">{bond}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={bond}
              onChange={(e) => setBond(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <span>🥇</span>
                <span>黄金占比</span>
              </span>
              <span className="text-emerald-400 font-bold">{gold}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={gold}
              onChange={(e) => setGold(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-gray-300 mb-2">
              <span className="flex items-center gap-2">
                <span>💵</span>
                <span>现金占比</span>
              </span>
              <span className="text-emerald-400 font-bold">{cash}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={cash}
              onChange={(e) => setCash(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-500"
            />
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-400">当前总计</span>
              <span className={`text-lg font-bold ${total === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {total}%
              </span>
            </div>
            {isOverLimit && (
              <p className="text-xs text-rose-400 text-center mb-4 flex items-center justify-center gap-2">
                <span>⚠️</span>
                <span>总和超过100%</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-gray-300 font-medium rounded-2xl hover:bg-gray-700/50 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isOverLimit}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}
