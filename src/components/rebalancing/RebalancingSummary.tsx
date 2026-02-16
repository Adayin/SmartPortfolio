import { TrendingDown, Target, DollarSign } from 'lucide-react';

interface Summary {
  totalBuyAmount: number;
  totalSellAmount: number;
  netAmount: number;
  maxDeviation: number;
}

interface RebalancingSummaryProps {
  summary: Summary;
}

export function RebalancingSummary({ summary }: RebalancingSummaryProps) {
  const getDeviationColor = (deviation: number) => {
    if (deviation <= 5) return 'emerald-500';
    if (deviation <= 15) return 'amber-500';
    return 'rose-500';
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-sm font-medium text-gray-400 mb-4">调仓摘要</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-blue-500/20 rounded-full">
            <DollarSign size={20} className="text-blue-500" />
          </div>
          <p className="text-lg font-bold text-gray-100">
            {summary.totalBuyAmount > 0 ? `¥${(summary.totalBuyAmount / 1000).toFixed(1)}k` : '¥0'}
          </p>
          <p className="text-xs text-gray-500">买入总额</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-emerald-500/20 rounded-full">
            <Target size={20} className="text-emerald-500" />
          </div>
          <p className="text-lg font-bold text-gray-100">{summary.maxDeviation.toFixed(1)}%</p>
          <p className="text-xs text-gray-500">调仓后偏离度</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-rose-500/20 rounded-full">
            <TrendingDown size={20} className="text-rose-500" />
          </div>
          <p className="text-lg font-bold text-gray-100">
            {summary.totalSellAmount > 0 ? `¥${(summary.totalSellAmount / 1000).toFixed(1)}k` : '¥0'}
          </p>
          <p className="text-xs text-gray-500">卖出总额</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-gray-500/20 rounded-full">
            <Target size={20} className="text-gray-500" />
          </div>
          <p className="text-lg font-bold text-gray-100">
            {summary.netAmount > 0 ? `+¥${(summary.netAmount / 1000).toFixed(1)}k` : summary.netAmount < 0 ? `-¥${Math.abs(summary.netAmount / 1000).toFixed(1)}k` : '¥0'}
          </p>
          <p className="text-xs text-gray-500">净买入</p>
        </div>
      </div>
    </div>
  );
}
