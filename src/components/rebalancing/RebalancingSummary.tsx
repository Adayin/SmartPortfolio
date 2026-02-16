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
    if (deviation <= 5) return 'emerald-400';
    if (deviation <= 15) return 'amber-400';
    return 'rose-400';
  };

  const getDeviationEmoji = (deviation: number) => {
    if (deviation <= 5) return '😊';
    if (deviation <= 15) return '😐';
    return '😰';
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl p-4 shadow-lg border border-gray-700/50">
      <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
        <span>📊</span>
        <span>调仓摘要</span>
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-blue-500/20 rounded-2xl">
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-base font-bold text-gray-100">
            {summary.totalBuyAmount > 0 ? `¥${(summary.totalBuyAmount / 1000).toFixed(1)}k` : '¥0'}
          </p>
          <p className="text-xs text-gray-500">买入总额</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-emerald-500/20 rounded-2xl">
            <span className="text-2xl">✅</span>
          </div>
          <p className={`text-base font-bold text-${getDeviationColor(summary.maxDeviation)}`}>
            {summary.maxDeviation.toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>调仓后偏离度</span>
            <span className="text-lg">{getDeviationEmoji(summary.maxDeviation)}</span>
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-rose-500/20 rounded-2xl">
            <span className="text-2xl">💸</span>
          </div>
          <p className="text-base font-bold text-gray-100">
            {summary.totalSellAmount > 0 ? `¥${(summary.totalSellAmount / 1000).toFixed(1)}k` : '¥0'}
          </p>
          <p className="text-xs text-gray-500">卖出总额</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-gray-500/20 rounded-2xl">
            <span className="text-2xl">⚖️</span>
          </div>
          <p className={`text-base font-bold ${summary.netAmount > 0 ? 'text-blue-400' : summary.netAmount < 0 ? 'text-rose-400' : 'text-gray-400'}`}>
            {summary.netAmount > 0 ? `+¥${(summary.netAmount / 1000).toFixed(1)}k` : summary.netAmount < 0 ? `-¥${Math.abs(summary.netAmount / 1000).toFixed(1)}k` : '¥0'}
          </p>
          <p className="text-xs text-gray-500">净买入</p>
        </div>
      </div>
    </div>
  );
}
