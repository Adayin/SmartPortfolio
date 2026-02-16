import { useState } from 'react';
import { Asset } from '../../types/portfolio';
import { ChevronDown, ChevronUp, ScanText } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  onAdd: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onOCR: () => void;
}

export function AssetList({ assets, onAdd, onEdit, onDelete, onOCR }: AssetListProps) {
  const [showAll, setShowAll] = useState(false);
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const displayAssets = showAll ? assets : assets.slice(0, 3);

  const getAssetEmoji = (type: Asset['type']) => {
    switch (type) {
      case 'stock': return '🚀';
      case 'bond': return '🛡️';
      case 'gold': return '🥇';
      case 'cash': return '💵';
      default: return '📊';
    }
  };

  const getTypeLabel = (type: Asset['type']) => {
    const emoji = getAssetEmoji(type);
    switch (type) {
      case 'stock': return `${emoji} 股票`;
      case 'bond': return `${emoji} 债券`;
      case 'gold': return `${emoji} 黄金`;
      case 'cash': return `${emoji} 现金`;
      default: return `${emoji} 其他`;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400 flex items-center gap-2">
          <span>📋</span>
          <span>持仓列表</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onOCR}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-2xl transition-all text-sm font-medium shadow-lg shadow-purple-500/25"
          >
            <span>📷</span>
            <span>OCR解析</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-2xl transition-all text-sm font-medium shadow-lg shadow-blue-500/25"
          >
            <span>➕</span>
            <span>添加资产</span>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-3xl overflow-hidden shadow-lg border border-gray-700/50">
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-3 p-4 text-xs font-medium text-gray-500 border-b border-gray-700/50 bg-gray-900/30">
          <span>名称</span>
          <span>类别</span>
          <span>金额</span>
          <span>占比</span>
          <span className="text-right">操作</span>
        </div>

        {displayAssets.map((asset) => (
          <div
            key={asset.id}
            className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-3 px-4 py-3 border-b border-gray-700/30 hover:bg-gradient-to-r hover:from-gray-700/30 hover:to-gray-700/20 transition-all last:border-0 items-center"
          >
            <span className="text-sm text-gray-200 font-medium truncate">{asset.name}</span>
            <span className="text-xs text-gray-400 font-medium">
              {getTypeLabel(asset.type)}
            </span>
            <span className="text-sm text-gray-100 font-semibold">¥{asset.value.toLocaleString()}</span>
            <span className="text-sm font-bold">
              {totalValue > 0 ? (
                <span className={asset.profitPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {asset.profitPercent >= 0 ? '✅' : '⚠️'}
                  {' '}
                  {((asset.value / totalValue) * 100).toFixed(2)}%
                </span>
              ) : (
                <span className="text-gray-500">0%</span>
              )}
            </span>
            <div className="flex items-center gap-1 justify-end">
              <button
                onClick={() => onEdit(asset)}
                className="p-2 text-gray-400 hover:text-amber-400 hover:scale-110 transition-all rounded-lg"
                title="编辑"
              >
                <span className="text-base">✏️</span>
              </button>
              <button
                onClick={() => onDelete(asset.id)}
                className="p-2 text-gray-400 hover:text-rose-400 hover:scale-110 transition-all rounded-lg"
                title="删除"
              >
                <span className="text-base">🗑️</span>
              </button>
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="py-16 text-center">
            <div className="mb-4 text-5xl">📊</div>
            <p className="text-gray-500 text-sm mb-2">暂无持仓数据</p>
            <p className="text-gray-600 text-xs">请点击上方按钮添加资产</p>
          </div>
        )}

        {assets.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-4 text-sm text-gray-400 hover:text-gray-200 flex items-center justify-center gap-2 transition-all hover:bg-gray-700/30"
          >
            {showAll ? (
              <>
                <span>收起</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span>展开更多 ({assets.length - 3})</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
