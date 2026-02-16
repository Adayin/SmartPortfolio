import { useMemo } from 'react';
import { usePortfolio } from './usePortfolio';
import { useAssets } from './useAssets';
import { Trade } from '../types/portfolio';

export function useRebalancing() {
  const { portfolio, selectStrategy } = usePortfolio();
  const { assets, totalAssetsValue } = useAssets();

  // 计算当前实际配置
  const currentAllocation = useMemo(() => {
    return assets.reduce(
      (acc, asset) => {
        acc[asset.type] += asset.value;
        return acc;
      },
      { stock: 0, bond: 0, gold: 0, cash: 0 }
    );
  }, [assets]);

  // 计算各类型实际占比
  const currentRatios = useMemo(() => {
    if (totalAssetsValue === 0) {
      return { stock: 0, bond: 0, gold: 0, cash: 0 };
    }
    return {
      stock: (currentAllocation.stock / totalAssetsValue) * 100,
      bond: (currentAllocation.bond / totalAssetsValue) * 100,
      gold: (currentAllocation.gold / totalAssetsValue) * 100,
      cash: (currentAllocation.cash / totalAssetsValue) * 100,
    };
  }, [currentAllocation, totalAssetsValue]);

  // 根据策略目标计算调仓建议
  const trades = useMemo(() => {
    if (!portfolio.currentStrategy.allocations) return [];

    const target = portfolio.currentStrategy.allocations;
    const current = currentRatios;
    const trades: Trade[] = [];

    // 计算总偏差（正数表示需要买入，负数表示需要卖出）
    const calculateTrade = (
      type: 'buy' | 'sell',
      assetName: string,
      amount: number,
      reason?: string
    ) => {
      const deviation = target.stock - current.stock;
      if (Math.abs(deviation) >= 1) {
        trades.push({
          type: deviation > 0 ? 'buy' : 'sell',
          assetName: '股票类资产',
          amount: Math.abs(totalAssetsValue * (deviation / 100)),
          reason: deviation > 0 ? '补充股票仓位' : '减少股票仓位',
        });
      }
    };

    const calculateTradeForType = (
      type: 'buy' | 'sell',
      assetTypeName: string,
      targetType: keyof typeof target,
      targetCurrAmount: number
    ) => {
      const targetAmount = target[targetType];
      const currentAmount = currentAllocation[targetType];
      const deviation = targetAmount - currentAmount;

      if (Math.abs(deviation) >= totalAssetsValue * 0.01) {
        // 只有偏差超过 1% 才生成交易
        trades.push({
          type: deviation > 0 ? 'buy' : 'sell',
          assetName: assetTypeName,
          amount: Math.abs(totalAssetsValue * (deviation / 100)),
          reason: deviation > 0 ? `补充${assetTypeName}仓位` : `减少${assetTypeName}仓位`,
        });
      }
    };

    calculateTradeForType('buy', '债券类资产', 'bond', currentAllocation.bond);
    calculateTradeForType('buy', '黄金类资产', 'gold', currentAllocation.gold);
    calculateTradeForType('buy', '现金类资产', 'cash', currentAllocation.cash);

    // 为每种类型的资产找到需要调仓的具体资产
    const rebalanceAsset = (
      type: 'stock' | 'bond' | 'gold' | 'cash',
      needAmount: number
    ) => {
      const matchingAssets = assets.filter(a => a.type === type);
      let adjusted = 0;

      matchingAssets.forEach(asset => {
        if (adjusted >= needAmount) return;
        const available = needAmount - adjusted;
        const tradeAmount = Math.min(asset.value, available);

        if (tradeAmount >= asset.value * 0.01) {
          const deviation = type === 'stock' ? target.stock - current.stock :
                        type === 'bond' ? target.bond - current.bond :
                        type === 'gold' ? target.gold - current.gold :
                        target.cash - current.cash;

          trades.push({
            type: deviation > 0 ? 'buy' : 'sell',
            assetName: asset.name,
            amount: tradeAmount,
            reason: deviation > 0 ? '补充仓位' : '减少仓位',
            currentProfit: asset.profitPercent,
          });
        }
        adjusted += tradeAmount;
      });
    };

    // 根据目标比例计算每种类型需要的金额
    const targetStockAmount = totalAssetsValue * (target.stock / 100);
    const targetBondAmount = totalAssetsValue * (target.bond / 100);
    const targetGoldAmount = totalAssetsValue * (target.gold / 100);
    const targetCashAmount = totalAssetsValue * (target.cash / 100);

    rebalanceAsset('stock', targetStockAmount - currentAllocation.stock);
    rebalanceAsset('bond', targetBondAmount - currentAllocation.bond);
    rebalanceAsset('gold', targetGoldAmount - currentAllocation.gold);
    rebalanceAsset('cash', targetCashAmount - currentAllocation.cash);

    // 过滤掉金额太小的交易
    return trades.filter(t => t.amount >= totalAssetsValue * 0.01);
  }, [currentRatios, totalAssetsValue, portfolio.currentStrategy]);

  // 计算调仓后的预期配置
  const postRebalancingAllocation = useMemo(() => {
    const target = portfolio.currentStrategy.allocations;
    if (!target) return { stock: 0, bond: 0, gold: 0, cash: 0 };

    return {
      stock: target.stock,
      bond: target.bond,
      gold: target.gold,
      cash: target.cash,
    };
  }, [portfolio.currentStrategy]);

  // 计算调仓摘要
  const summary = useMemo(() => {
    const totalBuyAmount = trades.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.amount, 0);
    const totalSellAmount = trades.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.amount, 0);

    // 计算调仓后的偏离度
    const maxDeviation = Math.max(
      ...Object.values(postRebalancingAllocation || {}).map((_, i) => {
        const current = currentRatios[Object.keys(postRebalancingAllocation || {})[i] as keyof typeof currentRatios] || 0;
        const target = postRebalancingAllocation?.[Object.keys(postRebalancingAllocation || {})[i] as keyof typeof postRebalancingAllocation] || 0;
        return Math.abs(target - current);
      })
    );

    return {
      totalBuyAmount,
      totalSellAmount,
      netAmount: totalBuyAmount - totalSellAmount,
      maxDeviation: Math.round(maxDeviation * 100) / 100,
    };
  }, [trades, currentRatios, postRebalancingAllocation]);

  return {
    trades,
    postRebalancingAllocation,
    summary,
    currentRatios,
  };
}
