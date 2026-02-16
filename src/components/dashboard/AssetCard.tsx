interface AssetCardProps {
  totalAssets: number;
  todayProfit: number;
  todayProfitPercent: number;
}

export function AssetCard({ totalAssets, todayProfit, todayProfitPercent }: AssetCardProps) {
  const isPositive = todayProfit >= 0;

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl p-5 mb-4 shadow-lg border border-gray-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <div>
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <span>总资产</span>
            </p>
            <p className="text-3xl font-bold text-gray-100 tracking-tight">
              ¥{totalAssets.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            <span>今日收益</span>
            <span>📊</span>
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-base font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPositive ? '+' : ''}¥{Math.abs(todayProfit).toLocaleString()}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {isPositive ? '✅' : '⚠️'}
              {' '}
              {isPositive ? '+' : ''}{todayProfitPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
