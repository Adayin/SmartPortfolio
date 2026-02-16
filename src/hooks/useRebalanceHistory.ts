import { useState, useEffect } from 'react';
import { RebalanceHistory, RebalanceHistorySummary, Trade } from '../types/portfolio';

const STORAGE_KEY = 'smartportfolio_rebalance_history';

export function useRebalanceHistory() {
  const [history, setHistory] = useState<RebalanceHistory[]>([]);

  // 加载历史记录
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // 按时间倒序排列
          setHistory(parsed.sort((a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ));
        }
      }
    } catch (error) {
      console.error('Failed to load rebalance history from localStorage:', error);
    }
  }, []);

  // 保存调仓记录
  const saveRebalance = (
    strategyId: string,
    strategyName: string,
    trades: Trade[],
    preDeviation: number,
    postDeviation: number
  ): RebalanceHistory => {
    const totalBuyAmount = trades.filter(t => t.type === 'buy').reduce((sum, t) => sum + t.amount, 0);
    const totalSellAmount = trades.filter(t => t.type === 'sell').reduce((sum, t) => sum + t.amount, 0);

    const newHistory: RebalanceHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      strategyId,
      strategyName,
      trades,
      preDeviation,
      postDeviation,
      totalBuyAmount,
      totalSellAmount,
    };

    const updatedHistory = [newHistory, ...history];
    setHistory(updatedHistory);

    // 持久化到 localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to save rebalance history to localStorage:', error);
    }

    return newHistory;
  };

  // 获取所有历史记录
  const getHistory = (): RebalanceHistory[] => {
    return history;
  };

  // 删除单条记录
  const deleteHistory = (id: string): void => {
    const updatedHistory = history.filter(h => h.id !== id);
    setHistory(updatedHistory);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Failed to delete rebalance history from localStorage:', error);
    }
  };

  // 获取统计摘要
  const getSummary = (): RebalanceHistorySummary => {
    return {
      totalCount: history.length,
      totalDeviationSaved: history.reduce((sum, h) => sum + (h.preDeviation - h.postDeviation), 0),
    };
  };

  return {
    history,
    saveRebalance,
    getHistory,
    deleteHistory,
    getSummary,
  };
}
