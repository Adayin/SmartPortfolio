import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface AllocationRadarProps {
  currentAllocation: { stock: number; bond: number; gold: number; cash: number };
  targetAllocation: { stock: number; bond: number; gold: number; cash: number };
}

export function AllocationRadar({ currentAllocation, targetAllocation }: AllocationRadarProps) {
  const data = [
    { subject: '股票', current: currentAllocation.stock, target: targetAllocation.stock },
    { subject: '债券', current: currentAllocation.bond, target: targetAllocation.bond },
    { subject: '黄金', current: currentAllocation.gold, target: targetAllocation.gold },
    { subject: '现金', current: currentAllocation.cash, target: targetAllocation.cash },
  ];

  return (
    <div className="bg-gray-800 rounded-2xl p-4">
      <h2 className="text-sm font-medium text-gray-400 mb-2">资产配置对比</h2>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 60]}
              tick={{ fill: '#6b7280', fontSize: 9 }}
              tickCount={4}
            />
            <Radar
              name="当前持仓"
              dataKey="current"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
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
              wrapperStyle={{ paddingTop: 5 }}
              iconType="circle"
              formatter={(value: string) => (
                <span className="text-xs text-gray-300">{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
