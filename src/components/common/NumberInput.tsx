import { useState, useEffect } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

// 数字格式化为带千分位的字符串
function formatNumber(num: number): string {
  if (isNaN(num) || num === 0) return '';
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// 移除千分位分隔符，转换为数字
function parseNumber(str: string): number {
  const cleaned = str.replace(/,/g, '').replace(/[^0-9.-]/g, '');
  return cleaned === '' ? 0 : parseFloat(cleaned) || 0;
}

export function NumberInput({
  value,
  onChange,
  placeholder = '例如：10,000',
  min = 0,
  max,
  disabled = false,
  className = '',
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));

  // 当外部value变化时，更新显示值
  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // 允许输入：数字、小数点、负号（只在开头）
    if (input === '' || /^[-+]?[0-9,]*\.?[0-9]*$/.test(input.replace(/,/g, ''))) {
      setDisplayValue(input);

      // 解析数字并通知父组件
      const parsed = parseNumber(input);
      const clamped = max !== undefined ? Math.min(parsed, max) : parsed;
      onChange(Math.max(min, clamped));
    }
  };

  const handleBlur = () => {
    // 失去焦点时，格式化显示值
    setDisplayValue(formatNumber(value));
  };

  const handleFocus = () => {
    // 聚焦时，显示原始数字（不带千分位）
    setDisplayValue(value === 0 ? '' : value.toString());
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      min={min}
      max={max}
      disabled={disabled}
      inputMode="numeric"
      className={`w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    />
  );
}
