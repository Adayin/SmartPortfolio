import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface ComparisonChartProps {
  currentAllocation: { stock: number; bond: number; gold: number; cash: number };
  postRebalancingAllocation: { stock: number; bond: number; gold: number; cash: number };
  targetAllocation: { stock: number; bond: number; gold: number; cash: number };
}

export function ComparisonChart({
  currentAllocation,
  postRebalancingAllocation,
  targetAllocation,
}: ComparisonChartProps) {
  const data = [
    { subject: '股票', current: currentAllocation.stock, after: postRebalancingAllocation.stock, target: targetAllocation.stock },
    { subject: '债券', current: currentAllocation.bond, after: postRebalancingAllocation.bond, target: targetAllocation.bond },
    { subject: '黄金', current: currentAllocation.gold, after: postRebalancingAllocation.gold, target: targetAllocation.gold },
    { subject: '现金', current: currentAllocation.cash, after: postRebalancingAllocation.cash, target: targetAllocation.cash },
  ];

  return (
    <div className="bg-gray-800 rounded-2xl p-6 mt-6">
      <h2 className="text-sm font-medium text-gray-400 mb-4">调仓前后对比</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 60]}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickCount={4}
            />
            <Radar
              name="调仓前"
              dataKey="current"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="调仓后"
              dataKey="after"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="策略目标"
              dataKey="target"
              stroke="#9ca3af"
              fill="none"
              strokeDasharray="4 4"
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              iconType="circle"
              formatter={(value: string) => (
                <span className="text-sm text-gray-300">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
