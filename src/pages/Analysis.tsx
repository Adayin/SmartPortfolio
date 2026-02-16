import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
import { useAssets } from '../hooks/useAssets';
import { STRATEGIES } from '../utils/constants';
import { AllocationRadar } from '../components/analysis/AllocationRadar';
import { DeviationList } from '../components/analysis/DeviationList';

export function Analysis() {
  const [showStrategyDropdown, setShowStrategyDropdown] = useState(false);
  const { portfolio, selectStrategy } = usePortfolio();
  const { assets } = useAssets();

  // 根据实际持仓计算当前配置
  const actualAllocation = assets.reduce(
    (acc, asset) => {
      acc[asset.type] += asset.value;
      return acc;
    },
    { stock: 0, bond: 0, gold: 0, cash: 0 }
  );

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  // 计算各类型实际占比
  const actualRatios = {
    stock: totalValue > 0 ? (actualAllocation.stock / totalValue) * 100 : 0,
    bond: totalValue > 0 ? (actualAllocation.bond / totalValue) * 100 : 0,
    gold: totalValue > 0 ? (actualAllocation.gold / totalValue) * 100 : 0,
    cash: totalValue > 0 ? (actualAllocation.cash / totalValue) * 100 : 0,
  };

  // 基于实际占比计算偏离度
  const actualDeviations = portfolio.currentStrategy.allocations ? [
    {
      type: 'stock',
      name: '股票',
      current: actualRatios.stock,
      target: portfolio.currentStrategy.allocations.stock,
      deviation: actualRatios.stock - portfolio.currentStrategy.allocations.stock,
      level:
        Math.abs(actualRatios.stock - portfolio.currentStrategy.allocations.stock) <= 5
          ? 'low'
          : Math.abs(actualRatios.stock - portfolio.currentStrategy.allocations.stock) <= 15
            ? 'medium'
            : 'high',
    },
    {
      type: 'bond',
      name: '债券',
      current: actualRatios.bond,
      target: portfolio.currentStrategy.allocations.bond,
      deviation: actualRatios.bond - portfolio.currentStrategy.allocations.bond,
      level:
        Math.abs(actualRatios.bond - portfolio.currentStrategy.allocations.bond) <= 5
          ? 'low'
          : Math.abs(actualRatios.bond - portfolio.currentStrategy.allocations.bond) <= 15
            ? 'medium'
            : 'high',
    },
    {
      type: 'gold',
      name: '黄金',
      current: actualRatios.gold,
      target: portfolio.currentStrategy.allocations.gold,
      deviation: actualRatios.gold - portfolio.currentStrategy.allocations.gold,
      level:
        Math.abs(actualRatios.gold - portfolio.currentStrategy.allocations.gold) <= 5
          ? 'low'
          : Math.abs(actualRatios.gold - portfolio.currentStrategy.allocations.gold) <= 15
            ? 'medium'
            : 'high',
    },
    {
      type: 'cash',
      name: '现金',
      current: actualRatios.cash,
      target: portfolio.currentStrategy.allocations.cash,
      deviation: actualRatios.cash - portfolio.currentStrategy.allocations.cash,
      level:
        Math.abs(actualRatios.cash - portfolio.currentStrategy.allocations.cash) <= 5
          ? 'low'
          : Math.abs(actualRatios.cash - portfolio.currentStrategy.allocations.cash) <= 15
            ? 'medium'
            : 'high',
    },
  ] : [];

  // 计算综合偏离度
  const overallDeviation = Math.max(
    ...actualDeviations.map((d) => Math.abs(d.deviation))
  );

  const getOverallLevel = (deviation: number) => {
    if (deviation <= 10) return { level: 'low', color: 'emerald-500', label: '低' };
    if (deviation <= 20) return { level: 'medium', color: 'amber-500', label: '中' };
    return { level: 'high', color: 'rose-500', label: '高' };
  };

  const overallLevel = getOverallLevel(overallDeviation);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <Link to="/">
          <button className="p-1 text-gray-400 hover:text-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>

        <div className="flex-1"></div>

        {/* 策略选择器 */}
        <div className="relative">
          <button
            onClick={() => setShowStrategyDropdown(!showStrategyDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
          >
            <span className="text-sm text-gray-100">{portfolio.currentStrategy.name}</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {showStrategyDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl z-50">
              {STRATEGIES.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => {
                    selectStrategy(strategy.id);
                    setShowStrategyDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    strategy.id === portfolio.currentStrategy.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="block font-medium">{strategy.name}</span>
                  <span className="block text-xs text-gray-500">{strategy.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="px-4 py-6">
        {/* 综合偏离度卡片 */}
        <div className="bg-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-400">综合偏离度</h2>
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${overallLevel.color}`}>
              {overallDeviation.toFixed(1)}% - {overallLevel.label}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {overallLevel.level === 'low' && '✅ 配置合理'}
            {overallLevel.level === 'medium' && '⚠️ 需要关注'}
            {overallLevel.level === 'high' && '🔴 需要调仓'}
          </p>
        </div>

        <AllocationRadar
          currentAllocation={actualRatios}
          targetAllocation={portfolio.currentStrategy.allocations || { stock: 0, bond: 0, gold: 0, cash: 0 }}
        />

        <DeviationList deviations={actualDeviations} />

        <Link to="/rebalancing" className="block">
          <button className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            查看调仓方案
          </button>
        </Link>
      </div>
    </div>
  );
}
