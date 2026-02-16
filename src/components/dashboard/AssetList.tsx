import { useState } from 'react';
import { Asset } from '../../types/portfolio';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface AssetListProps {
  assets: Asset[];
  onAdd: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export function AssetList({ assets, onAdd, onEdit, onDelete }: AssetListProps) {
  const [showAll, setShowAll] = useState(false);
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const displayAssets = showAll ? assets : assets.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400">持仓列表</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm"
        >
          <Plus size={16} />
          <span>添加资产</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 p-3 text-xs font-medium text-gray-500 border-b border-gray-700">
          <span>名称</span>
          <span>类别</span>
          <span>金额</span>
          <span>占比</span>
          <span className="text-right">操作</span>
        </div>

        {displayAssets.map((asset) => (
          <div
            key={asset.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-3 py-3 border-b border-gray-700/50 hover:bg-gray-700/50 transition-colors last:border-0 items-center"
          >
            <span className="text-sm text-gray-200">{asset.name}</span>
            <span className="text-xs text-gray-400">
              {asset.type === 'stock' && '股票'}
              {asset.type === 'bond' && '债券'}
              {asset.type === 'gold' && '黄金'}
              {asset.type === 'cash' && '现金'}
            </span>
            <span className="text-sm text-gray-100">¥{asset.value.toLocaleString()}</span>
            <span className="text-sm">
              {totalValue > 0 ? (
                <span className={asset.profitPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                  {((asset.value / totalValue) * 100).toFixed(2)}%
                </span>
              ) : (
                '0%'
              )}
            </span>
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => onEdit(asset)}
                className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                title="编辑"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(asset.id)}
                className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                title="删除"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {assets.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-3 text-4xl">📊</div>
            <p className="text-gray-500 text-sm mb-1">暂无持仓数据</p>
            <p className="text-gray-600 text-xs">请点击上方按钮添加资产</p>
          </div>
        )}

        {assets.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 text-sm text-gray-400 hover:text-gray-200 flex items-center justify-center gap-2 transition-colors"
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
