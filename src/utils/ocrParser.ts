export interface ParsedHolding {
  name: string;
  code: string | null;
  type: 'fund' | 'stock';
  amount: number;
  shares: number | null;
}

/**
 * 从OCR文本中解析基金/股票持仓信息
 * 支持格式：基金代码（6位数字）+ 基金名称 + 持仓金额
 */
export function parseOCRText(text: string): ParsedHolding[] {
  const holdings: ParsedHolding[] = [];

  // 清理文本，移除多余的空格和换行
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  // 按行分割
  const lines = cleanedText.split('\n').filter(line => line.trim());

  // 常见的基金代码模式（6位数字）
  const fundCodePattern = /(\d{6})/;

  // 金额模式（数字，可能包含小数和千分位）
  const amountPattern = /([\d,]+\.?\d*)/;

  // 排除的关键词（这些不是持仓项）
  const excludeKeywords = [
    '总计', '持仓', '收益', '盈亏', '金额', '份额',
    '确认', '申购', '赎回', '操作', '查看', '详情',
    '元', '份', '¥', 'CNY', '收益', '净值', '日期',
    '持仓市值', '昨日收益', '累计收益', '总资产',
    '持有份额', '可用份额', '今日盈亏', '持仓盈亏'
  ];

  // 临时存储持仓信息
  const pendingHoldings: Map<string, ParsedHolding> = new Map();

  // 遍历每一行，解析持仓信息
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 跳过空行和排除关键词
    if (!line || excludeKeywords.some(keyword => line.includes(keyword))) {
      continue;
    }

    // 尝试匹配基金代码（6位数字）
    const codeMatch = line.match(fundCodePattern);
    if (!codeMatch) {
      continue;
    }

    const code = codeMatch[1];
    const lineWithoutCode = line.replace(codeMatch[0], '').trim();

    // 检查是否已存在该代码的持仓
    if (pendingHoldings.has(code)) {
      // 尝试提取份额信息
      const amountMatch = lineWithoutCode.match(amountPattern);
      if (amountMatch) {
        const shares = parseFloat(amountMatch[1].replace(/,/g, ''));
        if (!isNaN(shares) && shares > 0 && shares < 100000000) {
          // 如果数值很大可能是金额，较小的可能是份额
          const existing = pendingHoldings.get(code)!;
          if (!existing.shares && shares < existing.amount) {
            existing.shares = shares;
          }
        }
      }
      continue;
    }

    // 提取可能的名称（基金代码后的文字）
    let name = lineWithoutCode;

    // 在后续行中查找金额
    let amount = 0;
    let shares = null;

    // 检查当前行是否包含金额
    const currentLineAmounts = lineWithoutCode.match(/(\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?/g);
    if (currentLineAmounts && currentLineAmounts.length > 0) {
      for (const numStr of currentLineAmounts) {
        const num = parseFloat(numStr.replace(/,/g, ''));
        if (!isNaN(num) && num > 0) {
          // 假设金额 > 份额，金额通常比较大
          if (num > 1000) {
            amount = num;
          } else if (shares === null) {
            shares = num;
          }
        }
      }
    }

    // 如果当前行没有金额，检查下一行
    if (amount === 0 && i + 1 < lines.length) {
      const nextLine = lines[i + 1].trim();
      const nextLineNumbers = nextLine.match(/(\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?/g);
      if (nextLineNumbers) {
        for (const numStr of nextLineNumbers) {
          const num = parseFloat(numStr.replace(/,/g, ''));
          if (!isNaN(num) && num > 0) {
            if (num > 1000) {
              amount = num;
            } else if (shares === null) {
              shares = num;
            }
          }
        }
      }
    }

    // 如果还是找不到金额，再检查下下行
    if (amount === 0 && i + 2 < lines.length) {
      const nextNextLine = lines[i + 2].trim();
      const nextNextLineNumbers = nextNextLine.match(/(\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?/g);
      if (nextNextLineNumbers) {
        for (const numStr of nextNextLineNumbers) {
          const num = parseFloat(numStr.replace(/,/g, ''));
          if (!isNaN(num) && num > 0 && num > 1000) {
            amount = num;
            break;
          }
        }
      }
    }

    // 清理名称，移除数字和金额符号
    name = name
      .replace(/[\d,\.¥元CNY份]+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // 如果名称为空或太短，跳过
    if (!name || name.length < 2) {
      continue;
    }

    // 验证金额
    if (amount <= 0 || amount > 100000000) {
      continue;
    }

    // 创建持仓对象
    const holding: ParsedHolding = {
      name,
      code,
      type: 'fund', // 默认为基金
      amount,
      shares: shares !== null ? shares : null
    };

    pendingHoldings.set(code, holding);
  }

  // 转换为数组
  holdings.push(...Array.from(pendingHoldings.values()));

  return holdings;
}

/**
 * 解析基金类型（简单的启发式规则）
 */
function determineFundType(name: string, code: string): 'fund' | 'stock' {
  // 基金常见关键词
  const fundKeywords = ['ETF', '指数', '债券', '货币', '混合', '股票', '黄金', '白银', '商品'];
  const stockKeywords = ['股份', '公司'];

  const upperName = name.toUpperCase();

  // 检查股票关键词
  if (stockKeywords.some(kw => name.includes(kw))) {
    return 'stock';
  }

  // 检查基金关键词
  if (fundKeywords.some(kw => upperName.includes(kw))) {
    return 'fund';
  }

  // 默认为基金
  return 'fund';
}
