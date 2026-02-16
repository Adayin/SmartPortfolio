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
  const actualDeviations: Array<{
    type: 'stock' | 'bond' | 'gold' | 'cash';
    name: string;
    current: number;
    target: number;
    deviation: number;
    level: 'low' | 'medium' | 'high';
  }> = portfolio.currentStrategy.allocations ? [
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
    if (deviation <= 10) return { level: 'low', color: 'emerald-400', label: '低', emoji: '😊' };
    if (deviation <= 20) return { level: 'medium', color: 'amber-400', label: '中', emoji: '😐' };
    return { level: 'high', color: 'rose-400', label: '高', emoji: '😰' };
  };

  const overallLevel = getOverallLevel(overallDeviation);

  const getStrategyEmoji = (strategyId: string) => {
    switch (strategyId) {
      case 'harry-browne': return '⚖️';
      case 'all-weather': return '🌤';
      case 'golden-balance': return '🥇';
      case 'custom': return '🎯';
      default: return '🎯';
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-850 border-b border-gray-800">
        <Link to="/">
          <button className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-xl hover:bg-gray-800/50">
            <span className="text-xl">←</span>
          </button>
        </Link>

        <div className="flex-1"></div>

        {/* 策略选择器 */}
        <div className="relative">
          <button
            onClick={() => setShowStrategyDropdown(!showStrategyDropdown)}
            className="flex items-center gap-3 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-2xl transition-all shadow-lg border border-gray-700/50"
          >
            <span className="text-2xl">{getStrategyEmoji(portfolio.currentStrategy.id)}</span>
            <span className="text-sm text-gray-100 font-medium">{portfolio.currentStrategy.name}</span>
            <ChevronDown size={18} className="text-gray-400" />
          </button>

          {showStrategyDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-gradient-to-b from-gray-800 to-gray-850 rounded-2xl border border-gray-700 shadow-2xl z-50 overflow-hidden">
              {STRATEGIES.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => {
                    selectStrategy(strategy.id);
                    setShowStrategyDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-3 ${
                    strategy.id === portfolio.currentStrategy.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <span className="text-xl">{getStrategyEmoji(strategy.id)}</span>
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium">{strategy.name}</span>
                    <span className="block text-xs text-gray-500">{strategy.description}</span>
                  </div>
                  {strategy.id === portfolio.currentStrategy.id && (
                    <span className="text-sm">✅</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="px-4 py-4 pb-24">
        {/* 综合偏离度卡片 */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl p-5 mb-4 shadow-lg border border-gray-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <span>🎯</span>
              <span>综合偏离度</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-2xl text-lg font-bold bg-${overallLevel.color}/20 text-${overallLevel.color}`}>
                {overallDeviation.toFixed(2)}%
              </span>
              <span className="text-2xl">{overallLevel.emoji}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-2">
            {overallLevel.level === 'low' && (
              <>
                <span>✅</span>
                <span>配置合理</span>
              </>
            )}
            {overallLevel.level === 'medium' && (
              <>
                <span>⚠️</span>
                <span>需要关注</span>
              </>
            )}
            {overallLevel.level === 'high' && (
              <>
                <span>🔴</span>
                <span>需要调仓</span>
              </>
            )}
          </p>
        </div>

        <AllocationRadar
          currentAllocation={actualRatios}
          targetAllocation={portfolio.currentStrategy.allocations || { stock: 0, bond: 0, gold: 0, cash: 0 }}
        />

        <DeviationList deviations={actualDeviations} />

        {/* 固定底部按钮 */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/95 to-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4 md:relative md:bg-transparent md:border-0 md:backdrop-blur-none md:p-0 md:mt-6">
          <Link to="/rebalancing" className="block">
            <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
              <span>⚖️</span>
              <span>查看调仓方案</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
