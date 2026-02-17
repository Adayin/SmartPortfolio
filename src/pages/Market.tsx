import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

// 市场数据接口
interface MarketData {
  price: number;
  change: number;
  high: number;
  low: number;
  previousClose: number;
  updateTime: string;
}

interface MarketCard {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  category: string;
  data: MarketData;
  trendData: number[];
  detailUrl: string;
}

// 基础数据（模拟）
const baseData = {
  nasdaq: { symbol: 'NASDAQ', price: 18500, change: 150, high: 18600, low: 18400 },
  sp500: { symbol: 'S&P500', price: 5500, change: 80, high: 5550, low: 5480 },
  djia: { symbol: 'DJIA', price: 42000, change: 100, high: 42100, low: 41900 },
  nikkei: { symbol: 'N225', price: 40000, change: 200, high: 40200, low: 39800 },
  hsi: { symbol: 'HSI', price: 20000, change: 100, high: 20100, low: 19900 },
  kospi: { symbol: 'KS11', price: 2600, change: 15, high: 2650, low: 2580 },
  sse: { symbol: 'SSE', price: 4200, change: 55, high: 4250, low: 4180 },
  gold: { symbol: 'XAU/USD', price: 2700, change: 30, high: 2730, low: 2680 },
  silver: { symbol: 'XAG/USD', price: 32.5, change: -0.3, high: 33.2, low: 32.1 },
  oil: { symbol: 'WTI', price: 75.5, change: 1.2, high: 76.8, low: 74.9 },
  dxy: { symbol: 'DXY', price: 108.5, change: 0.5, high: 109.2, low: 107.8 },
  btc: { symbol: 'BTC', price: 98000, change: 2500, high: 99500, low: 96500 },
  // 科技巨头
  aapl: { symbol: 'AAPL', price: 195, change: 2.5, high: 196, low: 194 },
  msft: { symbol: 'MSFT', price: 420, change: 5, high: 425, low: 418 },
  googl: { symbol: 'GOOGL', price: 145, change: -1.2, high: 147, low: 144 },
  amzn: { symbol: 'AMZN', price: 185, change: 3, high: 187, low: 183 },
  tsla: { symbol: 'TSLA', price: 240, change: -5, high: 245, low: 238 },
  meta: { symbol: 'META', price: 520, change: 8, high: 525, low: 515 },
  nflx: { symbol: 'NFLX', price: 620, change: 12, high: 625, low: 615 }
};

// 新浪财经 API 配置
const SINA_API = 'https://hq.sinajs.cn/list=';

// 指数代码映射
const SINA_SYMBOLS: Record<string, string> = {
  nasdaq: 'gb_ixic',      // 纳斯达克
  sp500: 'gb_inx',        // 标普500
  djia: 'gb_dji',         // 道琼斯
  nikkei: 'gb_n225',      // 日经225
  hsi: 'rt_hkHSI',       // 恒生指数
  kospi: 'rt_ks11',       // 韩国综合指数
  sse: 'sh000001',        // 上证指数
  gold: 'hf_GC',          // 黄金期货
  silver: 'hf_SI',        // 白银期货
  oil: 'hf_CL',          // 原油期货
  dxy: 'hf_DX',          // 美元指数
  btc: 'gb_btc'          // 比特币
};

// 指数详情页面链接
const SINA_INDEX_URLS: Record<string, string> = {
  nasdaq: 'https://stock.finance.sina.com.cn/usstock/quotes/.NDX.html',
  sp500: 'https://stock.finance.sina.com.cn/usstock/quotes/.SPX.html',
  djia: 'https://stock.finance.sina.com.cn/usstock/quotes/.DJI.html',
  nikkei: 'https://stock.finance.sina.com.cn/global/quotes/n225.html',
  hsi: 'https://stock.finance.sina.com.cn/hkstock/quotes/HSI.html',
  kospi: 'https://stock.finance.sina.com.cn/global/quotes/ks11.html',
  sse: 'https://stock.finance.sina.com.cn/realstock/company/sh000001/nc.shtml',
  gold: 'https://stock.finance.sina.com.cn/future/quotes/GC0.html',
  silver: 'https://stock.finance.sina.com.cn/future/quotes/SI0.html',
  oil: 'https://stock.finance.sina.com.cn/future/quotes/cl.html',
  dxy: 'https://stock.finance.sina.com.cn/future/quotes/DX.html',
  btc: 'https://stock.finance.sina.com.cn/usstock/quotes/btc.html'
};

// 科技巨头详情页面链接
const TECH_TITAN_URLS: Record<string, string> = {
  aapl: 'https://stock.finance.sina.com.cn/usstock/quotes/aapl.html',
  msft: 'https://stock.finance.sina.com.cn/usstock/quotes/msft.html',
  googl: 'https://stock.finance.sina.com.cn/usstock/quotes/googl.html',
  amzn: 'https://stock.finance.sina.com.cn/usstock/quotes/amzn.html',
  tsla: 'https://stock.finance.sina.com.cn/usstock/quotes/tsla.html',
  meta: 'https://stock.finance.sina.com.cn/usstock/quotes/meta.html',
  nflx: 'https://stock.finance.sina.com.cn/usstock/quotes/nflx.html'
};

// 市场卡片分类
const marketCategories = [
  {
    title: '🇺🇸 美国市场 - 指数',
    cards: ['nasdaq', 'sp500', 'djia']
  },
  {
    title: '💻 美国科技7巨头',
    cards: ['aapl', 'msft', 'googl', 'amzn', 'tsla', 'meta', 'nflx']
  },
  {
    title: '🌏 亚洲市场',
    cards: ['nikkei', 'hsi', 'kospi', 'sse']
  },
  {
    title: '💰 能源与贵金属市场',
    cards: ['gold', 'silver', 'oil', 'dxy', 'btc']
  }
];

export function Market() {
  const [marketData, setMarketData] = useState<Record<string, MarketData>>(baseData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState('');
  const [isUsingRealData, setIsUsingRealData] = useState(true);

  const chartRefs = useRef<Record<string, HTMLCanvasElement>>({});
  const trendDataCache = useRef<Record<string, number[]>>({});

  // 适配：添加随机波动到基础数据
  const addVolatility = (price: number, volatilityPercent: number): number => {
    const volatility = price * (volatilityPercent / 100);
    const change = (Math.random() - 0.5) * 2 * volatility;
    return price + change;
  };

  // Vue 3 适配：使用计算属性替代过滤器
  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num === undefined || num === null || isNaN(num)) return '--';
    return num.toFixed(decimals);
  };

  const formatPercent = (value: number): string => {
    if (value === undefined || value === null || isNaN(value)) return '--';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatNumber(value)}%`;
  };

  const formatChange = (value: number, price: number): string => {
    if (value === undefined || price === undefined || isNaN(value) || isNaN(price)) return '--';
    const percent = (value / price) * 100;
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatNumber(value)} (${formatPercent(percent)})`;
  };

  const formatUpdateTime = (timeStr: string): string => {
    if (!timeStr) return '--';
    // 适配：更安全的日期解析
    try {
      if (timeStr.includes(' ')) {
        const parts = timeStr.split(' ');
        if (parts.length >= 1) {
          const datePart = parts[0]; // 2025-02-16
          let timePart = parts[1] ? parts[1].substring(0, 5) : ''; // 15:00 (只取时分)

          const dateParts = datePart.split('-');
          if (dateParts.length === 3) {
            const month = dateParts[1];
            const day = dateParts[2];
            const timeParts = timePart.split(':');
            const hour = timeParts.length >= 1 ? timeParts[0] : '';
            const minute = timeParts.length >= 2 ? timeParts[1] : '';
            return `${month}-${day} ${hour}:${minute}`;
          }
        }
      }
      return timeStr.substring(0, 16); // 残单截取
    } catch (e) {
      return timeStr.substring(0, 10);
    }
  };

  // 生成走势图数据
  const generateTrendData = (symbol: string, currentPrice: number, change: number, points: number = 30): number[] => {
    const cache = trendDataCache.current;
    if (!cache[symbol]) {
      cache[symbol] = [];
    }

    const data = [];
    let price = currentPrice;

    for (let i = points - 1; i >= 0; i--) {
      const volatility = price * 0.005; // 0.5% 波动
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const targetPrice = currentPrice - (change * i / points);
      const adjustment = (targetPrice - price) * 0.1;
      price = price + randomChange + adjustment;
      if (price < 0) price = currentPrice * 0.5;
    }

    cache[symbol] = data;
    return data;
  };

  // 绘制趋势图
  const drawTrendChart = (canvas: HTMLCanvasElement, data: number[], change: number) => {
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const minPrice = Math.min(...data);
    const maxPrice = Math.max(...data);
    const range = maxPrice - minPrice || 1;

    const width = rect.width;
    const height = rect.height;
    const padding = 5;
    const chartHeight = height - padding * 2;
    const chartWidth = width;

    const points = data.map((price, index) => ({
      x: (index / (data.length - 1)) * chartWidth,
      y: height - padding - ((price - minPrice) / range) * chartHeight
    }));

    const isPositive = change >= 0;
    const lineColor = isPositive ? '#4aaf7d' : '#f06060';
    const gradientColor = isPositive ? 'rgba(74, 175, 125, 0.2)' : 'rgba(240, 80, 80, 0.2)';

    // 绘制渐变填充
    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, gradientColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制线条
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // 使用贝塞尔曲线使线条更平滑
    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }
    ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // 绘制最后一个点的圆点
    const lastPoint = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = lineColor;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // 从新浪财经获取真实数据
  const fetchRealData = async (): Promise<Record<string, MarketData>> => {
    const data: Record<string, MarketData> = { ...baseData };

    try {
      const promises = Object.entries(SINA_SYMBOLS).map(async ([key, symbol]) => {
        const url = `${SINA_API}${symbol}`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            const text = await response.text();
            const regex = new RegExp(`var hq_str_${symbol.replace(/[^a-zA-Z0-9]/g, '')}="([^"]+)"`);
            const match = text.match(regex);

            if (match && match[1]) {
              const values = match[1].split(',');
              // 格式: 开盘, 涨跌, 昨收, 当前价, 最高, 最低, 买一, 卖一, 成交量, 成交额, 日期, 代码
              if (values.length >= 5) {
                const price = parseFloat(values[3]) || 0;
                const preClose = parseFloat(values[2]) || price;
                const change = price - preClose;
                const high = parseFloat(values[4]) || price;
                const low = parseFloat(values[5]) || price;
                const updateTime = values[10] || ''; // 日期时间

                data[key] = {
                  price,
                  change,
                  high,
                  low,
                  previousClose: preClose,
                  updateTime
                };
              }
            }
          }
        } else {
          throw new Error(`无法解析数据: ${symbol}`);
        }
      } else {
        throw new Error(`HTTP错误: ${response.status}`);
      }
    } catch (error) {
      console.warn(`获取 ${symbol} 失败:`, error.message);
      // 使用模拟数据作为后备
      data[key] = { ...baseData[key] };
      data[key].price = addVolatility(data[key].price, 0.2);
      data[key].change = addVolatility(data[key].change, 30);
    }

    await Promise.all(promises);
    return data;
  };

  // 获取并显示市场数据
  const fetchMarketData = async () => {
    setIsLoading(true);

    try {
      // 适配：最终使用真实数据
      const realData = await fetchRealData();

      // 更新所有市场数据
      setMarketData(realData);
      setIsUsingRealData(true);

      // 更新时间
      setLastUpdateTime(new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));

      // 更新所有图表
      Object.keys(realData).forEach(symbol => {
        const data = realData[symbol];
        if (data && data.trendData && data.trendData.length > 0) {
          generateTrendData(symbol, data.price, data.change);
          const canvas = chartRefs.current[symbol];
          if (canvas) {
            drawTrendChart(canvas, data.trendData, data.change);
          }
        }
      });

    } catch (error) {
      console.error('获取数据失败，使用模拟数据:', error);

      // 失败时使用带波动的模拟数据
      const simulatedData: Record<string, MarketData> = {};

      // 美国市场
      const usMarkets = ['nasdaq', 'sp500', 'djia'];
      usMarkets.forEach(market => {
        simulatedData[market] = {
          ...baseData[market],
          price: addVolatility(baseData[market].price, 0.3),
          change: addVolatility(baseData[market].change, 50)
        };
      });

      // 科技巨头
      const techMarkets = ['aapl', 'msft', 'googl', 'amzn', 'tsla', 'meta', 'nflx'];
      techMarkets.forEach(market => {
        simulatedData[market] = {
          ...baseData[market],
          price: addVolatility(baseData[market].price, 0.5),
          change: addVolatility(baseData[market].change, 3)
        };
      });

      // 亚洲市场
      const asianMarkets = ['nikkei', 'hsi', 'kospi', 'sse'];
      asianMarkets.forEach(market => {
        simulatedData[market] = {
          ...baseData[market],
          price: addVolatility(baseData[market].price, 0.4),
          change: addVolatility(baseData[market].change, 60)
        };
      });

      // 能源与贵金属
      const commodityMarkets = ['gold', 'silver', 'oil', 'dxy', 'btc'];
      commodityMarkets.forEach(market => {
        simulatedData[market] = {
          ...baseData[market],
          price: addVolatility(baseData[market].price, 0.2),
          change: addVolatility(baseData[market].change, 20)
        };
      });

      setMarketData(simulatedData);
      setIsUsingRealData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchMarketData();
  }, []);

  // 自动刷新机制
  useEffect(() => {
    const interval = setInterval(fetchMarketData, 30000); // 30秒
    return () => clearInterval(interval);
  }, []);

  // 适配：计算市场状态
  const marketStatus = () => {
    const allMarkets = Object.values(marketData);
    const validMarkets = allMarkets.filter(m => m && m.price !== undefined && m.price > 0);
    const positiveCount = validMarkets.filter(m => m.change !== undefined && m.change >= 0).length;

    return {
      total: validMarkets.length,
      positive: positiveCount,
      negative: validMarkets.length - positiveCount
    };
  };

  // 适配：获取卡片类型样式
  const getCardTypeClass = (symbol: string): string => {
    if (symbol === 'gold') return 'market-card gold';
    if (symbol === 'silver') return 'market-card silver';
    if (symbol === 'oil') return 'market-card oil';
    if (symbol === 'dxy') return 'market-card dxy';
    if (symbol === 'btc') return 'market-card bitcoin';
    if (symbol === 'nikkei') return 'market-card japan';
    if (symbol === 'hsi') return 'market-card hongkong';
    if (symbol === 'kospi') return 'market-card korea';
    if (symbol === 'sse') return 'market-card china';
    return 'market-card';
  };

  // 适配：获取边框颜色
  const getBorderColorClass = (symbol: string): string => {
    if (symbol === 'gold') return 'border-yellow-500';
    if (symbol === 'silver') return 'border-cyan-400';
    if (symbol === 'oil') return 'border-amber-500';
    if (symbol === 'dxy') return 'border-orange-500';
    if (symbol === 'btc') return 'border-orange-600';
    if (symbol === 'nikkei') return 'border-red-400';
    if (symbol === 'hsi') return 'border-pink-400';
    if (symbol === 'kospi') return 'border-indigo-400';
    if (symbol === 'sse') return 'border-red-500';
    return 'border-gray-700/30';
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-850 border-b border-gray-800">
        <Link to="/">
          <button className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-xl hover:bg-gray-800/50">
            <span className="text-xl">←</span>
          </button>
        </Link>

        <div className="flex-1"></div>

        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
          <span>🌏</span>
          <span>金融市场环球指数</span>
        </h1>
      </header>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-4 py-4">
        <button
          onClick={fetchMarketData}
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800/50'
          }`}
          style={{ backgroundColor: 'rgba(122, 127, 205, 0.2)' }}
        >
          <span className={`text-lg ${isLoading ? '' : 'animate-spin'}`}>
            🔄
          </span>
          <span className="text-sm font-medium text-gray-100">
            刷新数据
          </span>
        </button>
      </div>

      <div className="px-4 pb-24">
        {/* Market Cards Grid */}
        {marketCategories.map((category) => (
          <div key={category.title} className="mb-8">
            <h2 className="text-xl font-bold text-gray-300 mb-4 flex items-center gap-2">
              {category.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.cards.map((cardId) => {
                const card = marketData[cardId];
                const isPositive = card && card.change !== undefined && card.change >= 0;
                const hasData = card && card.price !== undefined;

                return (
                  <div
                    key={cardId}
                    className={`relative bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl overflow-hidden shadow-lg border ${getBorderColorClass(cardId)} transition-transform hover:scale-[1.02] hover:shadow-xl ${
                      isLoading ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="p-5">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700/30">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-gray-100">
                            {card.symbol}
                          </span>
                          <span className="text-sm text-gray-400">
                            {card.name}
                          </span>
                        </div>

                      </div>

                      {/* Price Display */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        {hasData ? (
                          <>
                            <div className="text-3xl font-bold text-gray-100">
                              {formatNumber(card.price, cardId === 'silver' ? 3 : 2)}
                            </div>
                            <div className={`text-sm font-bold px-3 py-1.5 rounded-lg ${
                              isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {card.change !== undefined ? formatChange(card.change, card.price) : '--'}
                            </div>
                          </>
                        ) : (
                          <div className="text-3xl font-bold text-gray-500">
                            --
                          </div>
                        )}
                      </div>

                      {/* Trend Chart */}
                      {hasData && (
                        <div className="relative h-16 mb-4">
                          <canvas
                            ref={el => chartRefs.current[cardId] = el}
                            id={`${cardId}-chart`}
                            className="w-full h-full"
                          />
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-3 pb-2 border-t border-gray-700/30">
                        {hasData && card.updateTime && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="text-gray-500">最后更新:</span>
                            <span>{formatUpdateTime(card.updateTime)}</span>
                          </div>
                        )}
                        {SINA_INDEX_URLS[cardId] && (
                          <a
                            href={SINA_INDEX_URLS[cardId]}
                            target="_blank"
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            查看详情
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        ))}
      </div>

      {/* Market Status */}
      <div className="mx-4 mt-8 p-4 bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl border border-gray-700/50">
        <h3 className="text-lg font-bold text-gray-300 mb-3 flex items-center gap-2">
          <span>📊</span>
          <span>市场状态</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 p-4 bg-gray-900/30 rounded-xl">
            <span className="text-2xl font-bold text-blue-400">{marketStatus().total}</span>
            <span className="text-sm text-gray-400">监控的指数</span>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-gray-900/30 rounded-xl">
            <span className="text-2xl font-bold text-emerald-400">{marketStatus().positive}</span>
            <span className="text-sm text-gray-400">上涨</span>
          </div>
          <div className="flex flex-col gap-2 p-4 bg-gray-900/30 rounded-xl">
            <span className="text-2xl font-bold text-rose-400">{marketStatus().negative}</span>
            <span className="text-sm text-gray-400">下跌</span>
          </div>
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
          下次更新: 30秒后
        </div>
        <div className="text-center mt-2 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            {isUsingRealData ? <span className="text-emerald-400">✅</span> : <span className="text-gray-400">⚠️</span>}
          </span>
          数据来源: {isUsingRealData ? <span className="text-emerald-400">新浪财经 (实时数据)</span> : <span className="text-gray-400">模拟数据</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-500 bg-gradient-to-b from-gray-900 to-gray-850 border-t border-gray-800">
        <p>数据仅供参考，不构成投资建议</p>
      </div>
    </div>
  );
}
