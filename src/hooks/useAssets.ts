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
        const parsed = JSON.parse(stored);
        // 确保解析结果是一个有效的数组
        if (Array.isArray(parsed)) {
          // 重新计算占比
          const total = parsed.reduce((sum: number, a: Asset) => sum + a.value, 0);
          return parsed.map((asset: Asset) => ({
            ...asset,
            currentRatio: total > 0 ? (asset.value / total) * 100 : 0,
          }));
        }
      }
    } catch {
      console.error('Failed to load assets from localStorage');
    }
    return DEFAULT_ASSETS;
  });

  // 计算总资产
  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  // 重新计算所有资产的占比
  const recalculateRatios = (assetList: Asset[]): Asset[] => {
    const total = assetList.reduce((sum, asset) => sum + asset.value, 0);
    return assetList.map(asset => ({
      ...asset,
      currentRatio: total > 0 ? (asset.value / total) * 100 : 0,
    }));
  };

  // 保存到 localStorage 并重新计算占比
  useEffect(() => {
    try {
      const assetsWithRatios = recalculateRatios(assets);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assetsWithRatios));
      // 如果占比发生变化，更新状态
      const hasRatioChange = assets.some((asset, index) =>
        Math.abs(asset.currentRatio - assetsWithRatios[index].currentRatio) > 0.01
      );
      if (hasRatioChange) {
        setAssets(assetsWithRatios);
      }
    } catch (error) {
      console.error('Failed to save assets to localStorage:', error);
    }
  }, [assets]);

  const addAsset = (asset: Omit<Asset, 'id' | 'currentRatio' | 'profit' | 'profitPercent' | 'targetRatio'>) => {
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      currentRatio: 0,
      profit: 0,
      profitPercent: 0,
      targetRatio: 0,
    };
    const updatedAssets = recalculateRatios([...assets, newAsset]);
    setAssets(updatedAssets);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    const updatedAssets = recalculateRatios(
      assets.map((asset) =>
        asset.id === id ? { ...asset, ...updates } : asset
      )
    );
    setAssets(updatedAssets);
  };

  const deleteAsset = (id: string) => {
    const updatedAssets = recalculateRatios(
      assets.filter((asset) => asset.id !== id)
    );
    setAssets(updatedAssets);
  };

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
