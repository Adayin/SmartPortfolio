import { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { AssetCard } from '../components/dashboard/AssetCard';
import { AssetList } from '../components/dashboard/AssetList';
import { AssetForm } from '../components/dashboard/AssetForm';
import { Modal } from '../components/common/Modal';
import { useAssets } from '../hooks/useAssets';

export function Dashboard() {
  const {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    totalAssetsValue,
    totalProfit,
  } = useAssets();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();

  const handleAddAsset = (assetData: Omit<Asset, 'id' | 'currentRatio' | 'profit' | 'profitPercent'>) => {
    if (editingAsset) {
      updateAsset(editingAsset.id, assetData);
    } else {
      addAsset(assetData);
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
      <div className="px-4 py-6 pb-20">
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
