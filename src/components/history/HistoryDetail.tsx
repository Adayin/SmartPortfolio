import { Calendar, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { RebalanceHistory } from '../../types/portfolio';

interface HistoryDetailProps {
  historyItem: RebalanceHistory;
  onClose?: () => void;
}

export function HistoryDetail({ historyItem, onClose }: HistoryDetailProps) {
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="space-y-4">
      {/* 基本信息 */}
      <div className="bg-gray-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <Calendar size={16} />
          <span className="text-xs">调仓时间</span>
        </div>
        <div className="text-sm text-gray-100">{formatDate(historyItem.timestamp)}</div>
      </div>

      {/* 策略信息 */}
      <div className="bg-gray-700/50 rounded-xl p-4">
        <div className="text-xs text-gray-400 mb-1">使用策略</div>
        <div className="text-sm font-medium text-gray-100">{historyItem.strategyName}</div>
      </div>

      {/* 偏离度改善 */}
      <div className="bg-gray-700/50 rounded-xl p-4">
        <div className="text-xs text-gray-400 mb-3">偏离度改善</div>
        <div className="flex items-center justify-center gap-3">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">调仓前</div>
            <div className="text-lg font-bold text-rose-400">
              {historyItem.preDeviation.toFixed(1)}%
            </div>
          </div>
          <ArrowRight size={20} className="text-gray-500" />
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">调仓后</div>
            <div className="text-lg font-bold text-emerald-400">
              {historyItem.postDeviation.toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="text-center mt-3 pt-3 border-t border-gray-600">
          <span className="text-xs text-gray-400">改善幅度：</span>
          <span className="text-sm font-medium text-emerald-400 ml-1">
            {formatAmount(historyItem.preDeviation - historyItem.postDeviation)}%
          </span>
        </div>
      </div>

      {/* 买卖明细 */}
      <div className="bg-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-400">交易明细</div>
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-emerald-400">
                买入: {formatAmount(historyItem.totalBuyAmount)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown size={14} className="text-rose-400" />
              <span className="text-rose-400">
                卖出: {formatAmount(historyItem.totalSellAmount)}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {historyItem.trades.map((trade, index) => (
            <div
              key={index}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                trade.type === 'buy'
                  ? 'bg-emerald-900/20 border border-emerald-800/30'
                  : 'bg-rose-900/20 border border-rose-800/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {trade.type === 'buy' ? (
                  <TrendingUp size={16} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={16} className="text-rose-400" />
                )}
                <span className="text-sm text-gray-100">{trade.assetName}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-100">
                  {formatAmount(trade.amount)}
                </div>
                {trade.reason && (
                  <div className="text-xs text-gray-500">{trade.reason}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 关闭按钮 */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          关闭
        </button>
      )}
    </div>
  );
}
