import { Asset } from '../../types/portfolio';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PortfolioChartProps {
  assets: Asset[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#6366f1', '#14b8a6', '#f97316',
];

export function PortfolioChart({ assets }: PortfolioChartProps) {
  const chartData = assets
    .filter((asset) => asset.currentRatio > 0)
    .map((asset) => ({
      name: asset.name,
      value: asset.value,
      ratio: asset.currentRatio,
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-gray-200 font-medium">{payload[0].payload.name}</p>
          <p className="text-xs text-gray-400">
            ¥{payload[0].payload.value.toLocaleString()} ({payload[0].payload.ratio}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <h2 className="text-sm font-medium text-gray-400 mb-4">持仓分布</h2>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-100">{assets.length}</p>
            <p className="text-xs text-gray-500">只基金</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.slice(0, 6).map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-300 truncate">{item.name}</p>
              <p className="text-xs text-gray-500">{item.ratio}%</p>
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 6 && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          及其他 {chartData.length - 6} 只基金
        </p>
      )}
    </div>
  );
}
