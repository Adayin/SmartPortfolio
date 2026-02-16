// 涨幅历史记录
export interface PriceHistory {
  date: string;
  changePercent: number;
}

// 纪律检查结果
export interface DisciplineCheck {
  passed: boolean;
  warnings: DisciplineWarning[];
  blocking?: DisciplineWarning[];
}

export interface DisciplineWarning {
  type: 'chasing_high' | 'profit_take' | 'gold_rule' | 'left_side';
  level: 'warning' | 'blocking';
  message: string;
  assetId?: string;
  assetName?: string;
}

// 调仓历史记录
export interface RebalanceHistory {
  id: string;
  timestamp: string;
  strategyId: string;
  strategyName: string;
  trades: Trade[];
  preDeviation: number;  // 调仓前最大偏离度
  postDeviation: number; // 调仓后最大偏离度
  totalBuyAmount: number;
  totalSellAmount: number;
}

export interface RebalanceHistorySummary {
  totalCount: number;
  totalDeviationSaved: number;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  value: number;
  targetRatio: number;
  currentRatio: number;
  profit: number;
  profitPercent: number;
  type: 'stock' | 'bond' | 'gold' | 'cash';
  recent5DaysChange?: number;  // 近5日涨幅
  recent3DaysChange?: number;   // 近3日涨幅
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  allocations: {
    stock: number;
    bond: number;
    gold: number;
    cash: number;
  };
}

export interface Portfolio {
  totalAssets: number;
  todayProfit: number;
  todayProfitPercent: number;
  assets: Asset[];
  currentStrategy: Strategy;
}

export interface Trade {
  type: 'buy' | 'sell';
  assetName: string;
  amount: number;
  reason?: string;
  currentProfit?: number;
}

export interface Deviation {
  type: 'stock' | 'bond' | 'gold' | 'cash';
  name: string;
  current: number;
  target: number;
  deviation: number;
  level: 'low' | 'medium' | 'high';
}
