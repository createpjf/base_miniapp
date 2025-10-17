// Record 记账记录
export interface Record {
  id: string;
  type: 'income' | 'expense';
  amount: number; // USDC 计价
  originalAmount?: number; // 原始金额
  originalCurrency?: string; // 原始币种
  category: string;
  date: string;
  description: string;
  accountBookId: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

// AccountBook 账本
export interface AccountBook {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: string;
}

// Budget 预算
export interface Budget {
  id: string;
  accountBookId: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  startDate: string;
}

// Asset 资产
export interface Asset {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'crypto' | 'stock' | 'fund';
  amount: number;
  currency: string;
  updatedAt: string;
}

// Token 代币价格
export interface Token {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

// 分类
export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color: string;
}

// 汇率
export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}
