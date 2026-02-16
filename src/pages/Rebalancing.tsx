import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRebalancing } from '../hooks/useRebalancing';
import { RebalancingSummary } from '../components/rebalancing/RebalancingSummary';
import { TradeList } from '../components/rebalancing/TradeList';
import { ComparisonChart } from '../components/rebalancing/ComparisonChart';

export function Rebalancing() {
  const {
    trades,
    postRebalancingAllocation,
    summary,
    currentRatios,
  } = useRebalancing();

  const handleConfirm = () => {
    alert('调仓指令已提交！在实际应用中，这里会连接券商API执行交易。');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-gray-800">
        <Link to="/analysis">
          <button className="p-1 text-gray-400 hover:text-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="text-lg font-medium text-gray-100">调仓建议</h1>
      </header>

      <div className="px-4 py-6">
        <RebalancingSummary summary={summary} />
        <TradeList trades={trades} />
        <ComparisonChart
          currentAllocation={currentRatios}
          postRebalancingAllocation={postRebalancingAllocation}
        />
        <button
          onClick={handleConfirm}
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          确认调仓
        </button>
      </div>
    </div>
  );
}
