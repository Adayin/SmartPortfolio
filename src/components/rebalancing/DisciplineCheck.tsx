import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import type { DisciplineCheck } from '../../types/portfolio';

interface DisciplineCheckProps {
  checkResult: DisciplineCheck;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function DisciplineCheck({ checkResult, onConfirm, onCancel }: DisciplineCheckProps) {
  const { passed, warnings, blocking } = checkResult;

  if (passed && warnings.length === 0) {
    return (
      <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle size={20} />
          <span className="text-sm font-medium">交易纪律检查通过</span>
        </div>
        <p className="text-xs text-emerald-300/70 mt-1">当前交易建议符合交易纪律要求</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mb-4">
      {/* 阻断级警告 */}
      {blocking && blocking.length > 0 && (
        <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-rose-400 mb-3">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">阻断级警告</span>
          </div>
          <ul className="space-y-2">
            {blocking.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-rose-300">
                  <span className="font-medium">{warning.assetName || ''}:</span> {warning.message}
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-rose-400/70 mt-3">
            ⚠️ 存在阻断级警告，需要您确认理解风险后才能继续
          </p>
        </div>
      )}

      {/* 普通警告 */}
      {warnings.length > 0 && (
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <Info size={20} />
            <span className="text-sm font-medium">交易提示</span>
          </div>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <Info size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-300">
                  <span className="font-medium">{warning.assetName || ''}:</span> {warning.message}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 操作按钮 */}
      {blocking && blocking.length > 0 && onConfirm && onCancel && (
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-xl transition-colors"
          >
            取消调仓
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            确认继续（已知悉风险）
          </button>
        </div>
      )}
    </div>
  );
}
