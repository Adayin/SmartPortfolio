import { useState } from 'react';
import { TopBar } from '../components/layout/TopBar';
import { AssetCard } from '../components/dashboard/AssetCard';
import { AssetList } from '../components/dashboard/AssetList';
import { AssetForm } from '../components/dashboard/AssetForm';
import { ProfitAttribution } from '../components/dashboard/ProfitAttribution';
import { OCRParsingModal } from '../components/dashboard/OCRParsingModal';
import { Modal } from '../components/common/Modal';
import { useAssets } from '../hooks/useAssets';
import { useToast } from '../components/common/Toast';
import { parseOCRText, ParsedHolding } from '../utils/ocrParser';
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
  const [showOCRModal, setShowOCRModal] = useState(false);

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

  // 处理OCR解析
  const handleOCRParse = (text: string): ParsedHolding[] => {
    return parseOCRText(text);
  };

  // 处理OCR导入
  const handleOCRImport = (holdings: ParsedHolding[]) => {
    let importedCount = 0;

    holdings.forEach((holding) => {
      // 转换为Asset格式
      // 类型映射: fund -> stock/bond/gold/cash (简化处理，fund默认为stock)
      let assetType: 'stock' | 'bond' | 'gold' | 'cash' = 'stock';

      // 根据名称简单推断类型
      if (holding.name.includes('债') || holding.name.includes('BOND') || holding.name.includes('债券')) {
        assetType = 'bond';
      } else if (holding.name.includes('金') || holding.name.includes('GOLD') || holding.name.includes('黄金')) {
        assetType = 'gold';
      } else if (holding.name.includes('货币') || holding.name.includes('现金') || holding.name.includes('CASH')) {
        assetType = 'cash';
      }

      addAsset({
        name: holding.name,
        symbol: holding.code || '',
        value: holding.amount,
        type: assetType,
      });

      importedCount++;
    });

    showToast(`成功导入 ${importedCount} 个持仓`, 'success');
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
          onOCR={() => setShowOCRModal(true)}
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

      {/* OCR解析弹窗 */}
      <OCRParsingModal
        isOpen={showOCRModal}
        onClose={() => setShowOCRModal(false)}
        onParse={handleOCRParse}
        onImport={handleOCRImport}
      />
    </div>
  );
}
