import { Trade } from '../../types/portfolio';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TradeListProps {
  trades: Trade[];
}

export function TradeList({ trades }: TradeListProps) {
  return (
    <div className="bg-gray-800 rounded-2xl p-4 mt-3">
      <h2 className="text-sm font-medium text-gray-400 mb-3">调仓操作</h2>
      <div className="space-y-2">
        {trades.map((trade, index) => {
          const isSell = trade.type === 'sell';

          return (
            <div
              key={`${trade.type}-${index}`}
              className={`flex items-center justify-between p-3 rounded-xl border ${
                isSell
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-emerald-500/10 border-emerald-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isSell ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'
                  }`}
                >
                  {isSell ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{trade.assetName}</p>
                  <p className="text-xs text-gray-500">
                    {isSell ? '卖出' : '买入'} ¥{trade.amount.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                {trade.reason && (
                  <p className="text-xs text-gray-500 mb-1">{trade.reason}</p>
                )}
                {trade.currentProfit !== undefined && isSell && (
                  <p className="text-xs text-emerald-500">
                    当前盈亏 +{trade.currentProfit.toFixed(2)}%
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
