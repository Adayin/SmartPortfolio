import { useState } from 'react';
import { Portfolio, Asset, Trade, Deviation } from '../types/portfolio';
import { STRATEGIES, ASSET_TYPE_LABELS } from '../utils/constants';

export function usePortfolio() {
  const [currentStrategyId, setCurrentStrategyId] = useState('harry-browne');

  // Mock portfolio data with 11 funds
  const portfolio: Portfolio = {
    totalAssets: 100000,
    todayProfit: 1200,
    todayProfitPercent: 1.2,
    currentStrategy: STRATEGIES.find((s) => s.id === currentStrategyId) || STRATEGIES[0],
    assets: [
      {
        id: '1',
        name: '全球科技ETF',
        symbol: '513100',
        value: 35000,
        targetRatio: 25,
        currentRatio: 35,
        profit: 4200,
        profitPercent: 12,
        type: 'stock',
      },
      {
        id: '2',
        name: '黄金ETF',
        symbol: '518880',
        value: 25000,
        targetRatio: 25,
        currentRatio: 25,
        profit: 750,
        profitPercent: 3,
        type: 'gold',
      },
      {
        id: '3',
        name: '货币基金',
        symbol: '000198',
        value: 20000,
        targetRatio: 25,
        currentRatio: 20,
        profit: 20,
        profitPercent: 0.1,
        type: 'cash',
      },
      {
        id: '4',
        name: '短债ETF',
        symbol: '511010',
        value: 10000,
        targetRatio: 25,
        currentRatio: 10,
        profit: 200,
        profitPercent: 2,
        type: 'bond',
      },
      {
        id: '5',
        name: '纳斯达克ETF',
        symbol: '513300',
        value: 5000,
        targetRatio: 0,
        currentRatio: 5,
        profit: 600,
        profitPercent: 12,
        type: 'stock',
      },
      {
        id: '6',
        name: '长债ETF',
        symbol: '511270',
        value: 3000,
        targetRatio: 0,
        currentRatio: 3,
        profit: 60,
        profitPercent: 2,
        type: 'bond',
      },
      {
        id: '7',
        name: '白银ETF',
        symbol: '159986',
        value: 2000,
        targetRatio: 0,
        currentRatio: 2,
        profit: 40,
        profitPercent: 2,
        type: 'gold',
      },
      {
        id: '8',
        name: '红利ETF',
        symbol: '510880',
        value: 2000,
        targetRatio: 0,
        currentRatio: 2,
        profit: 120,
        profitPercent: 6,
        type: 'stock',
      },
      {
        id: '9',
        name: '创业板ETF',
        symbol: '159915',
        value: 1500,
        targetRatio: 0,
        currentRatio: 1.5,
        profit: -150,
        profitPercent: -10,
        type: 'stock',
      },
      {
        id: '10',
        name: '中债指数',
        symbol: '511010',
        value: 1000,
        targetRatio: 0,
        currentRatio: 1,
        profit: 15,
        profitPercent: 1.5,
        type: 'bond',
      },
      {
        id: '11',
        name: '现金管理',
        symbol: 'CASH',
        value: 500,
        targetRatio: 0,
        currentRatio: 0.5,
        profit: 1,
        profitPercent: 0.2,
        type: 'cash',
      },
    ],
  };

  // Calculate current allocation by asset type
  const currentAllocation = portfolio.assets.reduce(
    (acc, asset) => {
      acc[asset.type] += asset.currentRatio;
      return acc;
    },
    { stock: 0, bond: 0, gold: 0, cash: 0 }
  );

  // Calculate deviations from target
  const deviations: Deviation[] = [
    {
      type: 'stock',
      name: ASSET_TYPE_LABELS.stock,
      current: currentAllocation.stock,
      target: portfolio.currentStrategy.allocations.stock,
      deviation: currentAllocation.stock - portfolio.currentStrategy.allocations.stock,
      level:
        Math.abs(currentAllocation.stock - portfolio.currentStrategy.allocations.stock) <= 5
          ? 'low'
          : Math.abs(currentAllocation.stock - portfolio.currentStrategy.allocations.stock) <= 15
            ? 'medium'
            : 'high',
    },
    {
      type: 'bond',
      name: ASSET_TYPE_LABELS.bond,
      current: currentAllocation.bond,
      target: portfolio.currentStrategy.allocations.bond,
      deviation: currentAllocation.bond - portfolio.currentStrategy.allocations.bond,
      level:
        Math.abs(currentAllocation.bond - portfolio.currentStrategy.allocations.bond) <= 5
          ? 'low'
          : Math.abs(currentAllocation.bond - portfolio.currentStrategy.allocations.bond) <= 15
            ? 'medium'
            : 'high',
    },
    {
      type: 'gold',
      name: ASSET_TYPE_LABELS.gold,
      current: currentAllocation.gold,
      target: portfolio.currentStrategy.allocations.gold,
      deviation: currentAllocation.gold - portfolio.currentStrategy.allocations.gold,
      level:
        Math.abs(currentAllocation.gold - portfolio.currentStrategy.allocations.gold) <= 5
          ? 'low'
          : Math.abs(currentAllocation.gold - portfolio.currentStrategy.allocations.gold) <= 15
            ? 'medium'
            : 'high',
    },
    {
      type: 'cash',
      name: ASSET_TYPE_LABELS.cash,
      current: currentAllocation.cash,
      target: portfolio.currentStrategy.allocations.cash,
      deviation: currentAllocation.cash - portfolio.currentStrategy.allocations.cash,
      level:
        Math.abs(currentAllocation.cash - portfolio.currentStrategy.allocations.cash) <= 5
          ? 'low'
          : Math.abs(currentAllocation.cash - portfolio.currentStrategy.allocations.cash) <= 15
            ? 'medium'
            : 'high',
    },
  ];

  // Calculate rebalancing trades
  const trades: Trade[] = [
    {
      type: 'sell',
      assetName: '全球科技ETF',
      amount: 10000,
      reason: '仓位过高',
      currentProfit: 12,
    },
    {
      type: 'sell',
      assetName: '纳斯达克ETF',
      amount: 5000,
      reason: '仓位过高',
      currentProfit: 12,
    },
    {
      type: 'buy',
      assetName: '长债ETF',
      amount: 12000,
      reason: '补仓债券',
    },
    {
      type: 'buy',
      assetName: '中债指数',
      amount: 3000,
      reason: '补仓债券',
    },
  ];

  // Calculate post-rebalancing allocation (simplified)
  const postRebalancingAllocation = {
    stock: 25,
    bond: 25,
    gold: 25,
    cash: 25,
  };

  const selectStrategy = (strategyId: string) => {
    setCurrentStrategyId(strategyId);
  };

  return {
    portfolio,
    currentAllocation,
    deviations,
    trades,
    postRebalancingAllocation,
    selectStrategy,
  };
}
