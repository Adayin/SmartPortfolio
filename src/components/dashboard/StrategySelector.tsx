import { Strategy } from '../../types/portfolio';

interface StrategySelectorProps {
  strategies: Strategy[];
  selectedStrategyId: string;
  onSelectStrategy: (strategyId: string) => void;
}

export function StrategySelector({ strategies, selectedStrategyId, onSelectStrategy }: StrategySelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-gray-400 mb-3">选择策略</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onSelectStrategy(strategy.id)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
              selectedStrategyId === strategy.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <p className="text-sm font-medium">{strategy.name}</p>
            <p className={`text-xs mt-1 ${selectedStrategyId === strategy.id ? 'text-blue-100' : 'text-gray-500'}`}>
              {strategy.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
