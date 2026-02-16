import { useState, useEffect } from 'react';
import { Asset } from '../types/portfolio';

const STORAGE_KEY = 'smartportfolio_assets';

// 默认资产数据
const DEFAULT_ASSETS: Asset[] = [
  {
    id: '1',
    name: '全球科技ETF',
    symbol: '513100',
    value: 35000,
    targetRatio: 25,
    currentRatio: 0,
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
    currentRatio: 0,
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
    currentRatio: 0,
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
    currentRatio: 0,
    profit: 200,
    profitPercent: 2,
    type: 'bond',
  },
];

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      console.error('Failed to load assets from localStorage');
      return DEFAULT_ASSETS;
    }
  });

  // 保存到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    } catch (error) {
      console.error('Failed to save assets to localStorage:', error);
    }
  }, [assets]);

  const addAsset = (asset: Omit<Asset, 'id' | 'currentRatio' | 'profit' | 'profitPercent'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      currentRatio: 0,
      profit: 0,
      profitPercent: 0,
      targetRatio: 0,
    };
    setAssets([...assets, newAsset]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(assets.map((asset) =>
      asset.id === id ? { ...asset, ...updates } : asset
    ));
  };

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };

  // 计算总资产
  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  // 计算今日收益（模拟）
  const totalProfit = assets.reduce((sum, asset) => sum + asset.profit, 0);

  return {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    totalAssetsValue,
    totalProfit,
  };
}
