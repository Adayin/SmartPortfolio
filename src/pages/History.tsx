import { useState } from 'react';
import { Clock, TrendingDown, Trash2 } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { HistoryDetail } from '../components/history/HistoryDetail';
import { useRebalanceHistory } from '../hooks/useRebalanceHistory';

export function History() {
  const { history, deleteHistory, getSummary } = useRebalanceHistory();
  const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

  const summary = getSummary();

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条历史记录吗？')) {
      deleteHistory(id);
    }
  };

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
    <div className="max-w-md mx-auto min-h-screen bg-gray-950">
      {/* Header */}
      <header className="px-4 py-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-lg font-medium text-gray-100">调仓历史</h1>
      </header>

      <div className="px-4 py-6">
        {/* 统计摘要 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Clock size={16} />
              <span className="text-xs">累计调仓次数</span>
            </div>
            <div className="text-2xl font-bold text-gray-100">{summary.totalCount}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <TrendingDown size={16} />
              <span className="text-xs">累计改善偏离度</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {summary.totalDeviationSaved.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* 历史记录列表 */}
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无调仓历史记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedHistory(item.id)}
                className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl p-4 text-left transition-colors group relative"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-100">
                    {item.strategyName}
                  </span>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(item.timestamp)}</span>
                  <span className="text-emerald-400">
                    改善 {formatAmount(item.preDeviation - item.postDeviation)}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 历史详情弹窗 */}
      {selectedHistory && (
        <Modal
          isOpen={!!selectedHistory}
          onClose={() => setSelectedHistory(null)}
          title="调仓详情"
        >
          {selectedHistory && (
            <HistoryDetail
              historyItem={history.find(h => h.id === selectedHistory)!}
              onClose={() => setSelectedHistory(null)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}
