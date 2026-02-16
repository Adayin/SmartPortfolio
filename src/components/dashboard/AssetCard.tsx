interface AssetCardProps {
  totalAssets: number;
  todayProfit: number;
  todayProfitPercent: number;
}

export function AssetCard({ totalAssets, todayProfit, todayProfitPercent }: AssetCardProps) {
  const isPositive = todayProfit >= 0;

  return (
    <div className="bg-gray-800 rounded-2xl p-6 mb-6">
      <p className="text-sm text-gray-400 mb-2">总资产</p>
      <p className="text-3xl font-bold text-gray-100 mb-4">¥{totalAssets.toLocaleString()}</p>

      <div className="flex items-center gap-2">
        <span className={`text-sm ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '+' : ''}¥{Math.abs(todayProfit).toLocaleString()}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            isPositive ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
          }`}
        >
          {isPositive ? '+' : ''}{todayProfitPercent.toFixed(2)}%
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">今日收益</p>
    </div>
  );
}
