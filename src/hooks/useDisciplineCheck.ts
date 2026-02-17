import { useMemo } from 'react';
import { Asset, Trade, DisciplineCheck, DisciplineWarning } from '../types/portfolio';

// 纪律检查阈值
const DISCIPLINE_THRESHOLDS = {
  CHASING_HIGH_DAYS: 5,     // 追高检查天数
  CHASING_HIGH_PERCENT: 5,  // 追高阈值百分比
  PROFIT_TAKE_PERCENT: 15,  // 止盈提醒百分比
  GOLD_RULE_DAYS: 3,        // 黄金规则检查天数
  GOLD_RULE_PERCENT: 6,     // 黄金规则阈值百分比
};

export function useDisciplineCheck() {
  // 检查单个交易
  const checkTrade = (
    asset: Asset,
    type: 'buy' | 'sell',
    amount: number
  ): DisciplineWarning[] => {
    const warnings: DisciplineWarning[] = [];

    // 规则1：禁止追高 - 近5日涨幅>5%的资产买入时警告
    if (type === 'buy' && asset.recent5DaysChange !== undefined) {
      if (asset.recent5DaysChange > DISCIPLINE_THRESHOLDS.CHASING_HIGH_PERCENT) {
        warnings.push({
          type: 'chasing_high',
          level: 'warning',
          message: `${asset.name} 近5日涨幅 ${asset.recent5DaysChange.toFixed(1)}%，可能存在追高风险`,
          assetId: asset.id,
          assetName: asset.name,
        });
      }
    }

    // 规则2：止盈提醒 - 盈利>15%的资产卖出时提示减仓一半
    if (type === 'sell' && asset.profitPercent > DISCIPLINE_THRESHOLDS.PROFIT_TAKE_PERCENT) {
      warnings.push({
        type: 'profit_take',
        level: 'warning',
        message: `${asset.name} 当前盈利 ${asset.profitPercent.toFixed(1)}%，建议先减仓一半锁定收益`,
        assetId: asset.id,
        assetName: asset.name,
      });
    }

    // 规则3：黄金规则 - 黄金3日涨幅>6%时建议卖出而非买入
    if (type === 'buy' && asset.type === 'gold' && asset.recent3DaysChange !== undefined) {
      if (asset.recent3DaysChange > DISCIPLINE_THRESHOLDS.GOLD_RULE_PERCENT) {
        warnings.push({
          type: 'gold_rule',
          level: 'blocking',
          message: `${asset.name} 近3日涨幅 ${asset.recent3DaysChange.toFixed(1)}%，建议考虑卖出而非买入`,
          assetId: asset.id,
          assetName: asset.name,
        });
      }
    }

    // 规则4：右侧交易确认 - 买入时需确认非左侧抄底
    if (type === 'buy') {
      warnings.push({
        type: 'left_side',
        level: 'warning',
        message: '请确认这是右侧交易（趋势确立后买入），而非左侧抄底',
        assetId: asset.id,
        assetName: asset.name,
      });
    }

    return warnings;
  };

  // 检查所有调仓建议
  const checkAllTrades = (trades: Trade[], assets: Asset[]): DisciplineCheck => {
    const allWarnings: DisciplineWarning[] = [];

    trades.forEach((trade) => {
      // 查找对应的资产
      const asset = assets.find((a) => a.name === trade.assetName);
      if (asset) {
        const warnings = checkTrade(asset, trade.type, trade.amount);
        allWarnings.push(...warnings);
      }
    });

    // 去重（相同的警告只保留一个）
    const uniqueWarnings = allWarnings.filter((warning, index, self) =>
      index === self.findIndex((w) =>
        w.type === warning.type && w.assetId === warning.assetId
      )
    );

    // 分离阻断级警告和普通警告
    const blockingWarnings = uniqueWarnings.filter((w) => w.level === 'blocking');
    const warningWarnings = uniqueWarnings.filter((w) => w.level === 'warning');

    return {
      passed: blockingWarnings.length === 0,
      warnings: warningWarnings,
      blocking: blockingWarnings,
    };
  };

  return {
    checkTrade,
    checkAllTrades,
  };
}
