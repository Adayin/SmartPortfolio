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
