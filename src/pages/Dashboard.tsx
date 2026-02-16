import { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { AssetCard } from '../components/dashboard/AssetCard';
import { AssetList } from '../components/dashboard/AssetList';
import { AssetForm } from '../components/dashboard/AssetForm';
import { ProfitAttribution } from '../components/dashboard/ProfitAttribution';
import { Modal } from '../components/common/Modal';
import { useAssets } from '../hooks/useAssets';
import { useToast } from '../components/common/Toast';
import type { Asset } from '../types/portfolio';

export function Dashboard() {
  const {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    totalAssetsValue,
    totalProfit,
  } = useAssets();

  const { showToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();

  const handleAddAsset = (assetData: Omit<Asset, 'id' | 'currentRatio' | 'profit' | 'profitPercent' | 'targetRatio'>) => {
    if (editingAsset) {
      updateAsset(editingAsset.id, assetData);
      showToast('资产更新成功', 'success');
    } else {
      addAsset(assetData);
      showToast('资产添加成功', 'success');
    }
    setShowAddModal(false);
    setEditingAsset(undefined);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setShowAddModal(true);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('确定要删除这个资产吗？')) {
      deleteAsset(id);
      showToast('资产删除成功', 'success');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAsset(undefined);
  };

  const todayProfitPercent = totalAssetsValue > 0 ? (totalProfit / totalAssetsValue) * 100 : 0;

  return (
    <div className="max-w-md mx-auto min-h-screen">
      <TopBar />
      <div className="px-4 py-4 pb-20">
        <AssetCard
          totalAssets={totalAssetsValue}
          todayProfit={totalProfit}
          todayProfitPercent={todayProfitPercent}
        />

        <AssetList
          assets={assets}
          onAdd={() => setShowAddModal(true)}
          onEdit={handleEditAsset}
          onDelete={handleDeleteAsset}
        />

        {/* 收益归因分析 */}
        <div className="mt-4">
          <ProfitAttribution assets={assets} />
        </div>
      </div>

      {/* 添加/编辑资产弹窗 */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingAsset ? '编辑资产' : '添加资产'}
      >
        <AssetForm
          asset={editingAsset}
          onSave={handleAddAsset}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}
