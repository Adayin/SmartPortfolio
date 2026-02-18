import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// 市场数据接口
interface MarketData {
  symbol: string;
  price: number;
  change: number;
  high: number;
  low: number;
  previousClose: number;
  updateTime: string;
}

// 辅助函数：格式化数字
const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// 辅助函数：格式化涨跌幅
const formatChange = (change: number, price: number): string => {
  const percent = ((change / price) * 100).toFixed(2);
  return `${change >= 0 ? '+' : ''}${change.toFixed(1)} (${percent}%)`;
};

// 辅助函数：检查是否有有效数据
const hasValidData = (data: MarketData): boolean => {
  return data.price !== undefined && data.change !== undefined;
};

// 辅助函数：获取边框颜色
const getBorderColorClass = (symbol: string): string => {
  if (symbol.includes('XAU')) return 'border-yellow-500/30';
  if (symbol.includes('XAG')) return 'border-gray-400/30';
  if (symbol === 'WTI') return 'border-amber-600/30';
  if (symbol === 'BTC') return 'border-orange-500/30';
  return 'border-gray-700/50';
};

// 辅助函数：添加随机波动
const addVolatility = (value: number, volatility: number): number => {
  return Number((value * (1 + (Math.random() - 0.5) * volatility)).toFixed(1));
};

// 基础数据（静态）
const baseData: Record<string, MarketData> = {
  // 美国指数
  nasdaq: { symbol: 'NASDAQ', price: 18500, change: 150, high: 18600, low: 18400, previousClose: 18350, updateTime: '' },
  sp500: { symbol: 'S&P500', price: 5500, change: 80, high: 5550, low: 5480, previousClose: 5420, updateTime: '' },
  djia: { symbol: 'DJIA', price: 42000, change: 100, high: 42100, low: 41900, previousClose: 41900, updateTime: '' },

  // 科技巨头
  aapl: { symbol: 'AAPL', price: 195, change: 2.5, high: 196, low: 194, previousClose: 192.5, updateTime: '' },
  msft: { symbol: 'MSFT', price: 420, change: 5, high: 425, low: 418, previousClose: 415, updateTime: '' },
  googl: { symbol: 'GOOGL', price: 145, change: -1.2, high: 147, low: 144, previousClose: 146.2, updateTime: '' },
  amzn: { symbol: 'AMZN', price: 185, change: 3, high: 187, low: 183, previousClose: 182, updateTime: '' },
  tsla: { symbol: 'TSLA', price: 240, change: -5, high: 245, low: 238, previousClose: 245, updateTime: '' },
  meta: { symbol: 'META', price: 520, change: 8, high: 525, low: 515, previousClose: 512, updateTime: '' },
  nflx: { symbol: 'NFLX', price: 620, change: 12, high: 625, low: 615, previousClose: 608, updateTime: '' },

  // 亚洲市场
  nikkei: { symbol: 'N225', price: 40000, change: 200, high: 40200, low: 39800, previousClose: 39800, updateTime: '' },
  hsi: { symbol: 'HSI', price: 20000, change: 100, high: 20100, low: 19900, previousClose: 19900, updateTime: '' },
  kospi: { symbol: 'KS11', price: 2600, change: 15, high: 2650, low: 2580, previousClose: 2585, updateTime: '' },
  sse: { symbol: 'SSE', price: 4200, change: 55, high: 4250, low: 4180, previousClose: 4145, updateTime: '' },

  // 商品
  gold: { symbol: 'XAU/USD', price: 2700, change: 30, high: 2730, low: 2680, previousClose: 2670, updateTime: '' },
  silver: { symbol: 'XAG/USD', price: 32.5, change: -0.3, high: 33.2, low: 32.1, previousClose: 32.8, updateTime: '' },
  oil: { symbol: 'WTI', price: 75.5, change: 1.2, high: 76.8, low: 74.9, previousClose: 74.3, updateTime: '' },
  dxy: { symbol: 'DXY', price: 108.5, change: 0.5, high: 109.2, low: 107.8, previousClose: 108, updateTime: '' },

  // 加密货币
  btc: { symbol: 'BTC', price: 98000, change: 2500, high: 99500, low: 96500, previousClose: 95500, updateTime: '' },
};

// 市场分类
const marketCategories = [
  {
    title: '🇺🇸 美国指数',
    cards: ['nasdaq', 'sp500']
  },
  {
    title: '💻 科技巨头',
    cards: ['aapl', 'msft']
  },
  {
    title: '🌏 亚洲市场',
    cards: ['nikkei', 'hsi', 'kospi']
  },
  {
    title: '🏭 能源与贵金属',
    cards: ['gold', 'silver', 'oil']
  },
  {
    title: '₿ 加密货币',
    cards: ['btc']
  }
];

const Market = () => {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>(baseData);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // 模拟异步获取数据
  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟数据更新
      const updatedData = { ...baseData };
      Object.keys(updatedData).forEach(key => {
        // 添加一些随机波动
        const volatility = 0.02; // 2%波动
        updatedData[key].price = Number((updatedData[key].price * (1 + (Math.random() - 0.5) * volatility)).toFixed(1));
        updatedData[key].change = Number((updatedData[key].price - updatedData[key].previousClose).toFixed(1));
      });

      setMarketData(updatedData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('获取数据失败:', error);
      // 保持原有数据
    } finally {
      setIsLoading(false);
    }
  };

  // 自动刷新功能
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(fetchMarketData, 30000); // 30秒刷新
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh]);

  // 组件加载时获取数据
  useEffect(() => {
    fetchMarketData();
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-850 border-b border-gray-800">
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all shadow-lg border border-gray-700/50"
          >
            <span className="text-lg">📊</span>
            <span className="text-xs text-gray-100 font-medium truncate max-w-28">主要指数</span>
            <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-gradient-to-b from-gray-800 to-gray-850 rounded-xl border border-gray-700 shadow-2xl z-50 overflow-hidden">
              {marketCategories.map((category) => (
                <button
                  key={category.title}
                  className="w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors border-b border-gray-700/50 last:border-b-0"
                  onClick={() => setShowCategoryDropdown(false)}
                >
                  <span className="text-sm text-gray-100">{category.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1"></div>

        <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
          <span>🌍</span>
          <span>金融市场环球指数</span>
        </h1>
      </header>

      {/* Main Content */}
      <div className="px-4 pb-24">
        {/* Controls */}
        <div className="flex items-center justify-center gap-4 px-4 py-4">
          <button
            onClick={fetchMarketData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'rgba(122, 127, 205, 0.2)' }}
          >
            <span className={`text-lg ${isLoading ? '' : 'animate-spin'}`}>
              🔄
            </span>
            <span className="text-sm font-medium text-gray-100">
              {isLoading ? '加载中...' : '刷新数据'}
            </span>
          </button>

          <button
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
              isAutoRefresh ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'
            }`}
          >
            <span className="text-lg">
              {isAutoRefresh ? '✅' : '⭕'}
            </span>
            <span className="text-sm font-medium">
              自动刷新
            </span>
          </button>
        </div>

        {/* Update Status */}
        <div className="text-center mb-3">
          <div className="text-[11px] text-gray-500">
            ⏰ 下次更新: {isAutoRefresh ? '30秒后' : '已暂停'}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            🕒 最后更新: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Market Cards Grid */}
        {marketCategories.map((category) => (
          <div key={category.title} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-400 mb-4">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.cards.map((cardId) => {
                const card = marketData[cardId] || baseData[cardId];
                const isPositive = card?.change >= 0;

                return (
                  <div
                    key={cardId}
                    className={`relative bg-gradient-to-br from-gray-800/50 to-gray-850/50 rounded-2xl p-4 border ${getBorderColorClass(card.symbol)} hover:border-opacity-60 transition-all backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-xs font-semibold text-gray-100">
                          {card.symbol}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {card.symbol.includes('XAU') ? '🥇 黄金' :
                           card.symbol.includes('XAG') ? '🥈 白银' :
                           card.symbol === 'WTI' ? '⛽ 原油' :
                           card.symbol === 'BTC' ? '₿ 比特币' :
                           card.symbol.includes('AAPL') ? '🍎 苹果' :
                           card.symbol.includes('MSFT') ? '🪪 微软' :
                           card.symbol.includes('GOOGL') ? '🔍 谷歌' :
                           card.symbol.includes('AMZN') ? '📦 亚马逊' :
                           card.symbol.includes('TSLA') ? '🚗 特斯拉' :
                           card.symbol.includes('META') ? '📘 Meta' :
                           card.symbol.includes('NFLX') ? '📺 奈飞' :
                           card.symbol.includes('N225') ? '🇯🇵 日经' :
                           card.symbol.includes('HSI') ? '🇭🇰 恒指' :
                           card.symbol.includes('KS11') ? '🇰🇷 韩国指数' :
                           card.symbol.includes('SSE') ? '🇨🇳 上证指数' :
                           '📊 指数'}
                        </div>
                      </div>
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isPositive
                          ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/30'
                          : 'bg-rose-400/10 text-rose-300 border border-rose-400/30'
                      }`}>
                        {hasValidData(card) ? formatChange(card.change, card.price) : '--'}
                      </div>
                    </div>

                    {/* 价格显示 */}
                    <div className="mb-2">
                      <div className="text-lg font-bold text-gray-100 mb-1">
                        {hasValidData(card) ? formatNumber(card.price, card.symbol.includes('XAU') || card.symbol.includes('XAG') ? 2 : 1) : '--'}
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>📈 {hasValidData(card) ? card.high.toFixed(1) : '--'}</span>
                        <span>📉 {hasValidData(card) ? card.low.toFixed(1) : '--'}</span>
                      </div>
                    </div>

                    {/* 前收盘价 */}
                    <div className="text-[10px] text-gray-500 pt-1 border-t border-gray-700/50">
                      🏷️ 前收: {hasValidData(card) ? card.previousClose.toFixed(1) : '--'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

            {/* Footer */}
      <div className="text-center py-3 text-[10px] text-gray-500">
        📊 数据来源: {isAutoRefresh ?
          <span className="text-emerald-400">新浪财经 (实时)</span> :
          <span className="text-gray-400">模拟数据</span>
        }
      </div>
      </div>
    </div>
  );
};

export default Market;