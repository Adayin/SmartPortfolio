import { useState } from 'react';
import { Deviation } from '../../types/portfolio';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DeviationListProps {
  deviations: Deviation[];
}

export function DeviationList({ deviations }: DeviationListProps) {
  const [showAll, setShowAll] = useState(false);

  // 按偏离度绝对值排序，取前3个最大的
  const sortedDeviations = [...deviations].sort((a, b) =>
    Math.abs(b.deviation) - Math.abs(a.deviation)
  );
  const displayDeviations = showAll ? sortedDeviations : sortedDeviations.slice(0, 3);

  const getIndicator = (level: Deviation['level']) => {
    switch (level) {
      case 'low':
        return { emoji: '🟢', textColor: 'text-emerald-500', bgColor: 'bg-emerald-500/20' };
      case 'medium':
        return { emoji: '🟡', textColor: 'text-yellow-500', bgColor: 'bg-yellow-500/20' };
      case 'high':
        return { emoji: '🔴', textColor: 'text-rose-500', bgColor: 'bg-rose-500/20' };
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-4 mt-4">
      <h2 className="text-sm font-medium text-gray-400 mb-3">偏离度分析</h2>
      <div className="space-y-2">
        {displayDeviations.map((deviation) => {
          const indicator = getIndicator(deviation.level);

          return (
            <div key={deviation.type} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-base">{indicator.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">{deviation.name}</p>
                  <p className="text-xs text-gray-500">
                    当前 {deviation.current.toFixed(2)}% vs 目标 {deviation.target.toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg ${indicator.bgColor}`}>
                <p className={`text-sm font-medium ${indicator.textColor}`}>
                  {deviation.deviation > 0 ? '+' : ''}{deviation.deviation.toFixed(2)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {deviations.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-200 flex items-center justify-center gap-2 transition-colors"
        >
          {showAll ? (
            <>
              <span>收起</span>
              <ChevronUp size={16} />
            </>
          ) : (
            <>
              <span>展开更多</span>
              <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
