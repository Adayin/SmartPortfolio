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
        return { emoji: '✅', textColor: 'text-emerald-400', bgColor: 'bg-emerald-500/20' };
      case 'medium':
        return { emoji: '⚠️', textColor: 'text-amber-400', bgColor: 'bg-amber-500/20' };
      case 'high':
        return { emoji: '🔴', textColor: 'text-rose-400', bgColor: 'bg-rose-500/20' };
    }
  };

  const getDeviationEmoji = (deviation: number) => {
    if (Math.abs(deviation) <= 5) return '✅';
    if (Math.abs(deviation) <= 15) return '⚠️';
    return '🔴';
  };

  const getLevelEmoji = (level: Deviation['level']) => {
    switch (level) {
      case 'low': return '😊';
      case 'medium': return '😐';
      case 'high': return '😰';
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl p-4 shadow-lg border border-gray-700/50">
        <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
          <span>📊</span>
          <span>偏离度分析</span>
        </h2>
        <div className="space-y-2">
          {displayDeviations.map((deviation) => {
            const indicator = getIndicator(deviation.level);
            const deviationEmoji = getDeviationEmoji(deviation.deviation);
            const levelEmoji = getLevelEmoji(deviation.level);

            return (
              <div key={deviation.type} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl hover:bg-gray-900/70 transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{indicator.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-gray-200">{deviation.name}</p>
                      <span className="text-lg">{levelEmoji}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>当前</span>
                      <span className="text-gray-300 font-semibold">{deviation.current.toFixed(1)}%</span>
                      <span>vs</span>
                      <span>目标</span>
                      <span className="text-gray-300 font-semibold">{deviation.target.toFixed(1)}%</span>
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-2 rounded-xl ${indicator.bgColor}`}>
                  <p className={`text-base font-bold ${indicator.textColor} flex items-center gap-1`}>
                    <span>{deviationEmoji}</span>
                    <span>
                      {deviation.deviation > 0 ? '+' : ''}
                      {deviation.deviation.toFixed(1)}%
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {deviations.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 text-sm text-gray-400 hover:text-gray-200 flex items-center justify-center gap-2 transition-all hover:bg-gray-800/50 rounded-xl"
        >
          {showAll ? (
            <>
              <span>收起</span>
              <ChevronUp size={16} />
            </>
          ) : (
            <>
              <span>展开更多 ({deviations.length - 3})</span>
              <ChevronDown size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
