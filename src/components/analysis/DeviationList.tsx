import { Deviation } from '../../types/portfolio';

interface DeviationListProps {
  deviations: Deviation[];
}

export function DeviationList({ deviations }: DeviationListProps) {
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
    <div className="bg-gray-800 rounded-2xl p-6 mt-6">
      <h2 className="text-sm font-medium text-gray-400 mb-4">偏离度分析</h2>
      <div className="space-y-3">
        {deviations.map((deviation) => {
          const indicator = getIndicator(deviation.level);

          return (
            <div key={deviation.type} className="flex items-center justify-between p-3 bg-gray-850 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-lg">{indicator.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">{deviation.name}</p>
                  <p className="text-xs text-gray-500">
                    当前 {deviation.current}% vs 目标 {deviation.target}%
                  </p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-lg ${indicator.bgColor}`}>
                <p className={`text-sm font-medium ${indicator.textColor}`}>
                  {deviation.deviation > 0 ? '+' : ''}{deviation.deviation.toFixed(1)}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
