import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2, CheckCircle, AlertCircle, FileImage, ZoomIn } from 'lucide-react';
import { Modal } from '../common/Modal';
import Tesseract from 'tesseract.js';

interface ParsedHolding {
  name: string;
  code: string | null;
  type: 'fund' | 'stock';
  amount: number;
  shares: number | null;
}

interface OCRParsingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParse: (text: string) => ParsedHolding[];
  onImport: (holdings: ParsedHolding[]) => void;
}

export function OCRParsingModal({ isOpen, onClose, onParse, onImport }: OCRParsingModalProps) {
  const [ocrText, setOcrText] = useState('');
  const [parsedHoldings, setParsedHoldings] = useState<ParsedHolding[] | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.match(/image\/(jpeg|png|jpg|webp)/)) {
      setParseError('请上传图片文件（JPEG、PNG、WebP格式）');
      return;
    }

    // 验证文件大小（限制10MB）
    if (file.size > 10 * 1024 * 1024) {
      setParseError('图片大小不能超过10MB');
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPreviewImage(imageUrl);
      setShowImagePreview(true);
      setParseError(null);

      // 自动开始OCR识别
      recognizeImage(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // 使用Tesseract.js识别图片
  const recognizeImage = async (imageUrl: string) => {
    setIsRecognizing(true);
    setParseError(null);

    try {
      const result = await Tesseract.recognize(imageUrl, 'chi_sim+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            // 可以在这里显示进度
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      if (result.data && result.data.text) {
        setOcrText(result.data.text);
        setIsRecognizing(false);

        // 自动解析
        const holdings = onParse(result.data.text);
        setParsedHoldings(holdings);

        if (holdings.length === 0) {
          setParseError('未能识别到任何持仓信息，请尝试使用更清晰的截图');
        }
      }
    } catch (error) {
      setParseError(`OCR识别失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setIsRecognizing(false);
    }
  };

  const handleParse = () => {
    if (!ocrText.trim()) {
      setParseError('请先上传图片进行OCR识别');
      return;
    }

    setIsParsing(true);
    setParseError(null);

    try {
      const holdings = onParse(ocrText);
      setParsedHoldings(holdings);
      setIsParsing(false);

      if (holdings.length === 0) {
        setParseError('未能识别到任何持仓信息，请检查截图内容是否清晰');
      }
    } catch (error) {
      setParseError(`解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
      setIsParsing(false);
    }
  };

  const handleImport = () => {
    if (parsedHoldings && parsedHoldings.length > 0) {
      onImport(parsedHoldings);
      handleClear();
      onClose();
    }
  };

  const handleClear = () => {
    setOcrText('');
    setParsedHoldings(null);
    setParseError(null);
    setPreviewImage(null);
    setShowImagePreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="持仓截图OCR解析">
      <div className="space-y-4">
        {/* 说明文字 */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-3">
          <p className="text-xs text-blue-300">
            💡 使用方法：上传支付宝/天天基金持仓截图，系统将自动识别持仓信息并导入
          </p>
        </div>

        {/* 图片上传区域 */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={handleTriggerUpload}
            disabled={isRecognizing}
            className={`w-full py-8 border-2 border-dashed rounded-xl transition-colors flex flex-col items-center justify-center gap-3 ${
              isRecognizing
                ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed'
                : 'border-gray-600 hover:border-blue-500 hover:bg-gray-800/30'
            }`}
          >
            {isRecognizing ? (
              <>
                <Loader2 size={32} className="text-blue-500 animate-spin" />
                <span className="text-sm text-gray-400">正在识别图片文字...</span>
              </>
            ) : (
              <>
                <FileImage size={32} className="text-gray-500" />
                <div className="text-center">
                  <p className="text-sm text-gray-300">点击或拖拽上传截图</p>
                  <p className="text-xs text-gray-500 mt-1">支持 JPEG、PNG、WebP 格式，最大 10MB</p>
                </div>
              </>
            )}
          </button>
        </div>

        {/* 图片预览 */}
        {showImagePreview && previewImage && (
          <div className="relative">
            <div className="bg-gray-900 rounded-xl overflow-hidden">
              <img
                src={previewImage}
                alt="上传的截图"
                className="w-full max-h-64 object-contain"
              />
            </div>
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors"
              title="移除图片"
            >
              <X size={16} className="text-gray-300" />
            </button>
          </div>
        )}

        {/* OCR识别文字显示 */}
        {ocrText && !isRecognizing && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-400">
                识别出的文字
              </label>
              {parsedHoldings && parsedHoldings.length > 0 && (
                <div className="flex items-center gap-1 text-emerald-500">
                  <CheckCircle size={14} />
                  <span className="text-xs">已识别 {parsedHoldings.length} 个持仓</span>
                </div>
              )}
            </div>
            <div className="bg-gray-900 rounded-xl p-3 max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                {ocrText}
              </pre>
            </div>
          </div>
        )}

        {/* 手动解析按钮（如果自动识别失败） */}
        {ocrText && !parsedHoldings && !isRecognizing && (
          <button
            onClick={handleParse}
            disabled={isParsing}
            className={`w-full py-3 flex items-center justify-center gap-2 font-medium rounded-xl transition-colors ${
              isParsing
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isParsing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>解析中...</span>
              </>
            ) : (
              <>
                <ImageIcon size={18} />
                <span>重新解析</span>
              </>
            )}
          </button>
        )}

        {/* 错误提示 */}
        {parseError && (
          <div className="bg-rose-900/20 border border-rose-700/50 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-rose-300">{parseError}</p>
          </div>
        )}

        {/* 解析结果 */}
        {parsedHoldings && parsedHoldings.length > 0 && (
          <div className="space-y-3">
            <div className="bg-gray-900 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
              {parsedHoldings.map((holding, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-800 last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-100 truncate">
                      {holding.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      {holding.code && (
                        <span>代码: {holding.code}</span>
                      )}
                      <span>类型: {holding.type === 'fund' ? '基金' : '股票'}</span>
                      {holding.shares && (
                        <span>份额: {holding.shares}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-100">
                      ¥{holding.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleImport}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
            >
              一键导入 {parsedHoldings.length} 个持仓
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
