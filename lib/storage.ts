import { Record, AccountBook, Budget, Asset, Category } from './types'

// 本地存储键名
const STORAGE_KEYS = {
  RECORDS: 'base_accounting_records',
  ACCOUNT_BOOKS: 'base_accounting_account_books',
  BUDGETS: 'base_accounting_budgets',
  ASSETS: 'base_accounting_assets',
  CATEGORIES: 'base_accounting_categories',
  SETTINGS: 'base_accounting_settings',
} as const

// 通用存储操作
export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
}

// 记录管理
export const recordStorage = {
  getAll(): Record[] {
    return storage.get(STORAGE_KEYS.RECORDS, [])
  },

  save(record: Record): void {
    const records = this.getAll()
    const existingIndex = records.findIndex(r => r.id === record.id)
    
    if (existingIndex >= 0) {
      records[existingIndex] = record
    } else {
      records.push(record)
    }
    
    storage.set(STORAGE_KEYS.RECORDS, records)
  },

  delete(id: string): void {
    const records = this.getAll()
    const filtered = records.filter(r => r.id !== id)
    storage.set(STORAGE_KEYS.RECORDS, filtered)
  },

  getByAccountBook(accountBookId: string): Record[] {
    return this.getAll().filter(r => r.accountBookId === accountBookId)
  },

  getByDateRange(startDate: string, endDate: string): Record[] {
    return this.getAll().filter(r => r.date >= startDate && r.date <= endDate)
  },
}

// 账本管理
export const accountBookStorage = {
  getAll(): AccountBook[] {
    return storage.get(STORAGE_KEYS.ACCOUNT_BOOKS, [
      {
        id: 'default',
        name: '生活费',
        icon: '🏠',
        color: '#3B82F6',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'investment',
        name: '投资账本',
        icon: '📈',
        color: '#10B981',
        createdAt: new Date().toISOString(),
      },
    ])
  },

  save(accountBook: AccountBook): void {
    const accountBooks = this.getAll()
    const existingIndex = accountBooks.findIndex(ab => ab.id === accountBook.id)
    
    if (existingIndex >= 0) {
      accountBooks[existingIndex] = accountBook
    } else {
      accountBooks.push(accountBook)
    }
    
    storage.set(STORAGE_KEYS.ACCOUNT_BOOKS, accountBooks)
  },

  delete(id: string): void {
    const accountBooks = this.getAll()
    const filtered = accountBooks.filter(ab => ab.id !== id)
    storage.set(STORAGE_KEYS.ACCOUNT_BOOKS, filtered)
  },
}

// 预算管理
export const budgetStorage = {
  getAll(): Budget[] {
    return storage.get(STORAGE_KEYS.BUDGETS, [])
  },

  save(budget: Budget): void {
    const budgets = this.getAll()
    const existingIndex = budgets.findIndex(b => b.id === budget.id)
    
    if (existingIndex >= 0) {
      budgets[existingIndex] = budget
    } else {
      budgets.push(budget)
    }
    
    storage.set(STORAGE_KEYS.BUDGETS, budgets)
  },

  delete(id: string): void {
    const budgets = this.getAll()
    const filtered = budgets.filter(b => b.id !== id)
    storage.set(STORAGE_KEYS.BUDGETS, filtered)
  },

  getByAccountBook(accountBookId: string): Budget[] {
    return this.getAll().filter(b => b.accountBookId === accountBookId)
  },
}

// 资产管理
export const assetStorage = {
  getAll(): Asset[] {
    return storage.get(STORAGE_KEYS.ASSETS, [])
  },

  save(asset: Asset): void {
    const assets = this.getAll()
    const existingIndex = assets.findIndex(a => a.id === asset.id)
    
    if (existingIndex >= 0) {
      assets[existingIndex] = asset
    } else {
      assets.push(asset)
    }
    
    storage.set(STORAGE_KEYS.ASSETS, assets)
  },

  delete(id: string): void {
    const assets = this.getAll()
    const filtered = assets.filter(a => a.id !== id)
    storage.set(STORAGE_KEYS.ASSETS, filtered)
  },
}

// 分类管理
export const categoryStorage = {
  getAll(): Category[] {
    return storage.get(STORAGE_KEYS.CATEGORIES, [
      // 收入分类
      { id: 'income_salary', name: 'Salary', type: 'income', icon: '💰', color: '#10B981' },
      { id: 'income_bonus', name: 'Bonus', type: 'income', icon: '🎁', color: '#8B5CF6' },
      { id: 'income_investment', name: 'Investment', type: 'income', icon: '📈', color: '#3B82F6' },
      { id: 'income_others', name: 'Others', type: 'income', icon: '💵', color: '#6B7280' },
      
      // 支出分类
      { id: 'expense_food', name: 'Food & Drink', type: 'expense', icon: '🍽️', color: '#F59E0B' },
      { id: 'expense_transport', name: 'Transportation', type: 'expense', icon: '🚗', color: '#3B82F6' },
      { id: 'expense_housing', name: 'Housing', type: 'expense', icon: '🏠', color: '#8B5CF6' },
      { id: 'expense_shopping', name: 'Shopping', type: 'expense', icon: '🛍️', color: '#EC4899' },
      { id: 'expense_entertainment', name: 'Entertainment', type: 'expense', icon: '🎮', color: '#F97316' },
      { id: 'expense_trade', name: 'Trade', type: 'expense', icon: '💹', color: '#EAB308' },
      { id: 'expense_others', name: 'Others', type: 'expense', icon: '📝', color: '#6B7280' },
    ])
  },

  save(category: Category): void {
    const categories = this.getAll()
    const existingIndex = categories.findIndex(c => c.id === category.id)
    
    if (existingIndex >= 0) {
      categories[existingIndex] = category
    } else {
      categories.push(category)
    }
    
    storage.set(STORAGE_KEYS.CATEGORIES, categories)
  },

  delete(id: string): void {
    const categories = this.getAll()
    const filtered = categories.filter(c => c.id !== id)
    storage.set(STORAGE_KEYS.CATEGORIES, filtered)
  },

  getByType(type: 'income' | 'expense'): Category[] {
    return this.getAll().filter(c => c.type === type)
  },
}
