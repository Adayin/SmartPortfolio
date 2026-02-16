import { Strategy } from '../types/portfolio';

export const STRATEGIES: Strategy[] = [
  {
    id: 'harry-browne',
    name: '哈利·布朗永久组合',
    description: '25%股票 + 25%债券 + 25%黄金 + 25%现金',
    allocations: { stock: 25, bond: 25, gold: 25, cash: 25 },
  },
  {
    id: 'all-weather',
    name: '桥水全天候',
    description: '30%股票 + 40%长债 + 15%中债 + 15%商品',
    allocations: { stock: 30, bond: 40, gold: 15, cash: 15 },
  },
  {
    id: 'golden-balance',
    name: '四六股金平衡',
    description: '60%股票 + 40%黄金',
    allocations: { stock: 60, bond: 0, gold: 40, cash: 0 },
  },
  {
    id: 'custom',
    name: '自定义',
    description: '自由配置各项资产比例',
    allocations: { stock: 0, bond: 0, gold: 0, cash: 0 },
  },
];

export const ASSET_TYPE_LABELS: Record<string, string> = {
  stock: '股票',
  bond: '债券',
  gold: '黄金',
  cash: '现金',
};

export const ASSET_TYPE_COLORS: Record<string, string> = {
  stock: '#3b82f6', // blue-500
  bond: '#10b981', // emerald-500
  gold: '#f59e0b', // amber-500
  cash: '#6b7280', // gray-500
};
