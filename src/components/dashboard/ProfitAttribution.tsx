import { Asset } from '../../types/portfolio';

interface ProfitAttributionProps {
  assets: Asset[];
}

export function ProfitAttribution({ assets }: ProfitAttributionProps) {
  // 按收益绝对值排序
  const sortedAssets = [...assets].sort((a, b) =>
    Math.abs(b.profit) - Math.abs(a.profit)
  );

  const totalProfit = assets.reduce((sum, asset) => sum + asset.profit, 0);
  const totalLoss = assets.filter(a => a.profit < 0).reduce((sum, asset) => sum + asset.profit, 0);

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const maxProfit = Math.max(...sortedAssets.map(a => a.profit));
  const maxLoss = Math.abs(Math.min(...sortedAssets.map(a => a.profit)));

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-3">收益归因分析</h3>

      {/* 总体收益 */}
      <div className="flex justify-between mb-3 pb-3 border-b border-gray-700">
        <div>
          <div className="text-xs text-gray-500">总盈利</div>
          <div className="text-base font-medium text-emerald-400">
            {formatAmount(totalProfit > 0 ? totalProfit : 0)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">总亏损</div>
          <div className="text-base font-medium text-rose-400">
            {formatAmount(Math.abs(totalLoss))}
          </div>
        </div>
      </div>

      {/* 收益分布条形图 */}
      <div className="space-y-2">
        {sortedAssets.map((asset) => {
          const isProfit = asset.profit >= 0;
          const barWidth = isProfit
            ? maxProfit > 0 ? (asset.profit / maxProfit) * 100 : 0
            : maxLoss > 0 ? (Math.abs(asset.profit) / maxLoss) * 100 : 0;

          return (
            <div key={asset.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-100 truncate">
                      {asset.name}
                    </span>
                    <span className={`text-xs font-medium ${
                      isProfit ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isProfit ? '+' : ''}{formatAmount(asset.profit)}
                      <span className="text-xs ml-1 text-gray-500">
                        ({isProfit ? '+' : ''}{asset.profitPercent.toFixed(2)}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isProfit ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(barWidth, 1)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {sortedAssets.length === 0 && (
        <div className="text-center py-8">
          <div className="mb-2 text-3xl">📈</div>
          <p className="text-gray-500 text-sm">暂无持仓数据</p>
        </div>
      )}
    </div>
  );
}
