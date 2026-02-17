import { Trade } from '../../types/portfolio';

interface TradeListProps {
  trades: Trade[];
}

export function TradeList({ trades }: TradeListProps) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl p-4 mt-3 shadow-lg border border-gray-700/50">
      <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
        <span>🔄</span>
        <span>调仓操作</span>
      </h2>
      <div className="space-y-2">
        {trades.map((trade, index) => {
          const isSell = trade.type === 'sell';

          return (
            <div
              key={`${trade.type}-${index}`}
              className={`flex items-center justify-between p-4 rounded-2xl border ${
                isSell
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-emerald-500/10 border-emerald-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    isSell ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  <span className="text-xl">
                    {isSell ? '🔴' : '🟢'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200">{trade.assetName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>{isSell ? '卖出' : '买入'}</span>
                    <span>¥{trade.amount.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                {trade.reason && (
                  <p className="text-xs text-gray-500 mb-1">{trade.reason}</p>
                )}
                {trade.currentProfit !== undefined && isSell && (
                  <p className="text-xs text-emerald-400 font-medium">
                    当前盈亏 +{trade.currentProfit.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
