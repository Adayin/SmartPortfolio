import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRebalancing } from '../hooks/useRebalancing';
import { useAssets } from '../hooks/useAssets';
import { useDisciplineCheck } from '../hooks/useDisciplineCheck';
import { useRebalanceHistory } from '../hooks/useRebalanceHistory';
import { usePortfolio } from '../hooks/usePortfolio';
import { RebalancingSummary } from '../components/rebalancing/RebalancingSummary';
import { TradeList } from '../components/rebalancing/TradeList';
import { ComparisonChart } from '../components/rebalancing/ComparisonChart';
import { DisciplineCheck } from '../components/rebalancing/DisciplineCheck';

export function Rebalancing() {
  const {
    trades,
    postRebalancingAllocation,
    summary,
    currentRatios,
  } = useRebalancing();

  const { assets } = useAssets();
  const { checkAllTrades } = useDisciplineCheck();
  const { saveRebalance } = useRebalanceHistory();
  const { portfolio } = usePortfolio();

  const [showDisciplineCheck, setShowDisciplineCheck] = useState(false);
  const [disciplineResult, setDisciplineResult] = useState<ReturnType<typeof checkAllTrades> | null>(null);
  const [showBlockingConfirm, setShowBlockingConfirm] = useState(false);

  // 计算调仓前后的最大偏离度
  const calculateMaxDeviation = (ratios: Record<string, number>) => {
    const target = portfolio.currentStrategy.allocations || { stock: 0, bond: 0, gold: 0, cash: 0 };
    return Math.max(
      ...Object.keys(ratios).map((key) =>
        Math.abs((ratios[key] || 0) - (target[key as keyof typeof target] || 0))
      )
    );
  };

  const preDeviation = calculateMaxDeviation(currentRatios);
  const postDeviation = calculateMaxDeviation(postRebalancingAllocation);

  const handleShowConfirm = () => {
    const checkResult = checkAllTrades(trades, assets);
    setDisciplineResult(checkResult);
    setShowDisciplineCheck(true);

    if (!checkResult.passed) {
      setShowBlockingConfirm(true);
    }
  };

  const handleConfirm = () => {
    // 如果有阻断级警告，需要二次确认
    if (disciplineResult && !disciplineResult.passed && !showBlockingConfirm) {
      setShowBlockingConfirm(true);
      return;
    }

    // 保存调仓历史
    saveRebalance(
      portfolio.currentStrategy.id,
      portfolio.currentStrategy.name,
      trades,
      preDeviation,
      postDeviation
    );

    alert('调仓指令已提交！在实际应用中，这里会连接券商API执行交易。');
    setShowDisciplineCheck(false);
    setShowBlockingConfirm(false);
  };

  const handleCancel = () => {
    setShowDisciplineCheck(false);
    setShowBlockingConfirm(false);
  };

  const handleIgnoreBlocking = () => {
    setShowBlockingConfirm(false);
    handleConfirm();
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-850 border-b border-gray-800">
        <Link to="/analysis">
          <button className="p-2 text-gray-400 hover:text-gray-100 transition-colors rounded-xl hover:bg-gray-800/50">
            <span className="text-xl">←</span>
          </button>
        </Link>
        <h1 className="text-lg font-medium text-gray-100 flex items-center gap-2">
          <span>⚖️</span>
          <span>调仓建议</span>
        </h1>
      </header>

      <div className="px-4 py-4 pb-20">
        <RebalancingSummary summary={summary} />
        <TradeList trades={trades} />
        <ComparisonChart
          currentAllocation={currentRatios}
          postRebalancingAllocation={postRebalancingAllocation}
          targetAllocation={portfolio.currentStrategy.allocations || { stock: 0, bond: 0, gold: 0, cash: 0 }}
        />

        {/* 纪律检查结果 */}
        {showDisciplineCheck && disciplineResult && (
          <DisciplineCheck
            checkResult={disciplineResult}
            onConfirm={handleIgnoreBlocking}
            onCancel={handleCancel}
          />
        )}

        {/* 确认按钮 */}
        {!showDisciplineCheck && (
          <button
            onClick={handleShowConfirm}
            className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <span>✅</span>
            <span>确认调仓</span>
          </button>
        )}
      </div>
    </div>
  );
}
