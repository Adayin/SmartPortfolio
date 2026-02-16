import { useState, useEffect } from 'react';
import { Asset } from '../../types/portfolio';

interface AssetFormProps {
  asset?: Asset;
  onSave: (asset: Omit<Asset, 'id' | 'currentRatio' | 'profit' | 'profitPercent'>) => void;
  onCancel: () => void;
}

export function AssetForm({ asset, onSave, onCancel }: AssetFormProps) {
  const [name, setName] = useState(asset?.name || '');
  const [symbol, setSymbol] = useState(asset?.symbol || '');
  const [value, setValue] = useState(asset?.value || 0);
  const [type, setType] = useState<'stock' | 'bond' | 'gold' | 'cash'>(
    asset?.type || 'stock'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || value <= 0) return;

    onSave({
      name,
      symbol,
      value,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">资产名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：全球科技ETF"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">交易代码</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="例如：513100"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">持有金额（元）</label>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => setValue(Number(e.target.value))}
          placeholder="例如：10000"
          min="0"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">资产类别</label>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setType('stock')}
            className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              type === 'stock'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            股票
          </button>
          <button
            type="button"
            onClick={() => setType('bond')}
            className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              type === 'bond'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            债券
          </button>
          <button
            type="button"
            onClick={() => setType('gold')}
            className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              type === 'gold'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            黄金
          </button>
          <button
            type="button"
            onClick={() => setType('cash')}
            className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              type === 'cash'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
            }`}
          >
            现金
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl transition-colors text-sm font-medium"
        >
          取消
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
        >
          {asset ? '保存修改' : '添加资产'}
        </button>
      </div>
    </form>
  );
}
