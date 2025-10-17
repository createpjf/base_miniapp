'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Camera, BarChart3, Wallet, Settings, TrendingUp, Loader2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TokenPriceList } from '@/components/tokens/TokenPriceList'
import { ExchangeRateCalculator } from '@/components/tokens/ExchangeRateCalculator'
import { CameraCapture } from '@/components/camera/CameraCapture'
import { RecordForm } from '@/components/records/RecordForm'
import { RecordList } from '@/components/records/RecordList'
import { AccountBookManager } from '@/components/records/AccountBookManager'
import { ExpenseChart } from '@/components/statistics/ExpenseChart'
import { BudgetTracker } from '@/components/statistics/BudgetTracker'
import { AssetManager } from '@/components/assets/AssetManager'
import { BalanceSheet } from '@/components/assets/BalanceSheet'
import { Token, ExchangeRate, Record } from '@/lib/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [tokens, setTokens] = useState<Token[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [loading, setLoading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [selectedAccountBook, setSelectedAccountBook] = useState('default')
  const [showAccountBookManager, setShowAccountBookManager] = useState(false)
  const [assetView, setAssetView] = useState<'manager' | 'balance'>('manager')
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense')
  const [records, setRecords] = useState<Record[]>([])
  const [categoryBalances, setCategoryBalances] = useState<{[key: string]: number}>({})
  const [presetCategory, setPresetCategory] = useState<string | undefined>(undefined)
  const [presetType, setPresetType] = useState<'expense' | 'income' | undefined>(undefined)

  // 获取代币价格
  const fetchPrices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/prices')
      const data = await response.json()
      setTokens(data.tokens || [])
      setExchangeRates(data.exchangeRates || [])
    } catch (error) {
      console.error('Error fetching prices:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取记录数据
  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/records')
      if (response.ok) {
        const data = await response.json()
        setRecords(data.records || [])
        calculateCategoryBalances(data.records || [])
      }
    } catch (error) {
      console.error('Error fetching records:', error)
    }
  }

  // 计算分类余额
  const calculateCategoryBalances = (records: Record[]) => {
    const balances: {[key: string]: number} = {}
    
    records.forEach(record => {
      // 将分类名称转换为小写并替换空格为下划线
      const categoryKey = record.category.toLowerCase().replace(/\s+/g, '_')
      const key = `${record.type}_${categoryKey}`
      if (!balances[key]) {
        balances[key] = 0
      }
      balances[key] += record.amount
    })
    
    setCategoryBalances(balances)
  }

  // 处理拍照
  const handleImageCapture = async (file: File) => {
    setCameraLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', 'receipt')

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      console.log('OCR Result:', result)
      
      // 关闭相机，打开记账表单并预填充数据
      setShowCamera(false)
      setEditingRecord(null)
      setShowRecordForm(true)
      
      // 这里可以处理识别结果，自动填充记账表单
      // 由于表单组件还没有接收预填充数据的 props，暂时先记录到控制台
      if (result.amount || result.merchant || result.category) {
        console.log('识别到的数据:', {
          amount: result.amount,
          merchant: result.merchant,
          category: result.category,
          date: result.date,
          description: result.description
        })
      }
      
    } catch (error) {
      console.error('Error processing image:', error)
      alert('图片识别失败，请重试')
    } finally {
      setCameraLoading(false)
    }
  }

  // 处理记录保存
  const handleRecordSave = (record: Record) => {
    setShowRecordForm(false)
    setEditingRecord(null)
    // 刷新记录数据
    fetchRecords()
  }

  // 处理记录编辑
  const handleRecordEdit = (record: Record) => {
    setEditingRecord(record)
    setShowRecordForm(true)
  }

  // 处理添加记录
  const handleAddRecord = (categoryName?: string, type?: 'expense' | 'income') => {
    setEditingRecord(null)
    setPresetCategory(categoryName)
    setPresetType(type)
    if (type) {
      setCategoryType(type)
    }
    setShowRecordForm(true)
  }

  useEffect(() => {
    fetchPrices()
    fetchRecords()
  }, [])

  const tabs = [
    { id: 'home', label: 'Home', icon: TrendingUp },
    { id: 'records', label: 'Records', icon: Calendar },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'assets', label: 'Assets', icon: Wallet },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundImage: `url('/images/backgrounds/abstract-wave-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#000000'
    }}>
      {/* 轻微的深色遮罩层以增强UI元素对比度 */}
      <div className="absolute inset-0 bg-black/30"></div>
      

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-4 sm:py-6 pb-20 lg:pb-6 relative z-10 lg:ml-72">
        <div className="lg:max-w-none relative">
        {activeTab === 'home' && (
          <div className="h-screen flex flex-col">
            {/* 主要内容区域 */}
            <div className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
              {/* Categories with Toggle */}
              <div className="glass-card mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Categories</h3>
                  <div className="flex bg-white/20 rounded-lg p-1">
                    <button
                      onClick={() => setCategoryType('expense')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        categoryType === 'expense'
                          ? 'bg-accent-orange text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      onClick={() => setCategoryType('income')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        categoryType === 'income'
                          ? 'bg-accent-lime text-dark-gray'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Income
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {(categoryType === 'expense' ? [
                    { name: 'Food & Drink', icon: '🍽️', key: 'expense_food', color: 'text-accent-green', bg: 'bg-accent-green/20' },
                    { name: 'Transportation', icon: '🚗', key: 'expense_transport', color: 'text-accent-blue-2', bg: 'bg-accent-blue-2/20' },
                    { name: 'Shopping', icon: '🛍️', key: 'expense_shopping', color: 'text-accent-pink', bg: 'bg-accent-pink/20' },
                    { name: 'Housing', icon: '🏠', key: 'expense_housing', color: 'text-accent-orange', bg: 'bg-accent-orange/20' },
                    { name: 'Entertainment', icon: '🎮', key: 'expense_entertainment', color: 'text-accent-yellow', bg: 'bg-accent-yellow/20' },
                    { name: 'Trade', icon: '💹', key: 'expense_trade', color: 'text-accent-brown', bg: 'bg-accent-brown/20' },
                    { name: 'Others', icon: '📝', key: 'expense_others', color: 'text-medium-gray', bg: 'bg-medium-gray/20' },
                  ] : [
                    { name: 'Salary', icon: '💰', key: 'income_salary', color: 'text-accent-lime', bg: 'bg-accent-lime/20' },
                    { name: 'Investment', icon: '📈', key: 'income_investment', color: 'text-accent-blue-1', bg: 'bg-accent-blue-1/20' },
                    { name: 'Bonus', icon: '🎁', key: 'income_bonus', color: 'text-accent-pink', bg: 'bg-accent-pink/20' },
                    { name: 'Others', icon: '💵', key: 'income_others', color: 'text-medium-gray', bg: 'bg-medium-gray/20' },
                  ]).map((category, index) => {
                    const balance = categoryBalances[category.key] || 0
                    return (
                      <button 
                        key={index} 
                        onClick={() => handleAddRecord(category.name, categoryType)}
                        className={`${category.bg} rounded-xl p-3 text-center hover:bg-white/30 transition-all`}
                      >
                        <div className="text-2xl mb-1">{category.icon}</div>
                        <div className="text-xs text-white/80 mb-1">{category.name}</div>
                        <div className={`text-sm font-bold ${category.color}`}>${balance.toFixed(2)}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Recent Records */}
              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent</h3>
                  <button 
                    onClick={() => setActiveTab('records')}
                    className="text-sm text-blue-300 hover:text-blue-200"
                  >
                    View All
                  </button>
                </div>
                
                {records.length === 0 ? (
                  <div className="text-center text-white/70 py-8">
                    No records yet, start accounting!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {records.slice(0, 5).map((record, index) => (
                      <div key={record.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">{record.type === 'income' ? '💰' : '💸'}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{record.description || 'No description'}</div>
                            <div className="text-xs text-white/60">{record.category} • {new Date(record.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className={`text-sm font-bold ${record.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {record.type === 'income' ? '+' : '-'}${record.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-4 sm:space-y-6 pb-24 overflow-y-auto">
            {/* Calendar and Transactions */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-white/80">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  <button className="px-3 py-1 bg-blue-400 rounded-full text-sm text-white">Day</button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-xs text-white/60 py-2">{day}</div>
                ))}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const today = new Date().getDate();
                  const isToday = day === today;
                  const hasTransaction = records.some(record => new Date(record.date).getDate() === day);
                  const dayRecords = records.filter(record => new Date(record.date).getDate() === day);
                  const totalAmount = dayRecords.reduce((sum, record) => sum + record.amount, 0);
                  
                  return (
                    <div key={day} className={`text-center py-2 relative ${isToday ? 'bg-blue-400 rounded-full' : ''}`}>
                      <div className={`text-sm ${isToday ? 'text-white font-bold' : 'text-white/80'}`}>
                        {day}
                      </div>
                      {hasTransaction && (
                        <div className="text-xs text-green-400 mt-1">${totalAmount.toFixed(0)}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Monthly Summary */}
              <div className="flex justify-between text-sm">
                <div className="text-green-400">
                  Income: ${records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0).toFixed(0)}
                </div>
                <div className="text-red-400">
                  Expense: ${records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0).toFixed(0)}
                </div>
                <div className="text-blue-400">
                  Balance: ${(records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0) - records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0)).toFixed(0)}
                </div>
              </div>
            </div>

            {/* Today's Transactions */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Today</h3>
                <div className="text-sm text-red-400">
                  Expense ${records.filter(r => r.type === 'expense' && new Date(r.date).toDateString() === new Date().toDateString()).reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                </div>
              </div>

              {records.length === 0 ? (
                <div className="text-center text-white/70 py-8">
                  No records yet, start accounting!
                </div>
              ) : (
                <div className="space-y-3">
                  {records
                    .filter(record => new Date(record.date).toDateString() === new Date().toDateString())
                    .slice(0, 10)
                    .map((record, index) => (
                    <div key={record.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-xl">{record.type === 'income' ? '💰' : '💸'}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{record.description || 'No description'}</div>
                          <div className="text-xs text-white/60">
                            {record.category} • {new Date(record.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${record.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {record.type === 'income' ? '+' : '-'}${record.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-4 sm:space-y-6 pb-24 overflow-y-auto">
            {/* 时间选择器 */}
            <div className="glass-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">Day</button>
                  <button className="px-3 py-1 bg-blue-400 rounded-full text-sm text-white">Month</button>
                  <button className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">Year</button>
                </div>
                <div className="text-sm text-white/80">{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
              </div>
            </div>

            {/* 支出趋势图 */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4">Expense Trend</h3>
              <div className="h-48 bg-white/10 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-white/60">Chart Component</div>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-sm">
                <div className="text-pink-400">
                  Expense ${records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                </div>
                <div className="text-green-400">
                  Income ${records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* 支出TOP5 */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Expense TOP5</h3>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">📊</span>
                  </button>
                  <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">⋯</span>
                  </button>
                </div>
              </div>
              
              {records.length === 0 ? (
                <div className="text-center text-white/70 py-8">
                  No expense data yet, start accounting!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {Object.entries(
                      records
                        .filter(r => r.type === 'expense')
                        .reduce((acc, record) => {
                          acc[record.category] = (acc[record.category] || 0) + record.amount;
                          return acc;
                        }, {} as {[key: string]: number})
                    )
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([category, amount], index) => {
                        const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
                        const percentage = totalExpense > 0 ? (amount / totalExpense * 100).toFixed(1) : '0.0';
                        const colors = ['bg-purple-400', 'bg-pink-400', 'bg-teal-400', 'bg-red-400', 'bg-orange-400'];
                        
                        return (
                          <div key={category} className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${colors[index] || 'bg-gray-400'}`}></div>
                            <div className="flex-1">
                              <div className="text-sm text-white">{category}</div>
                              <div className="text-xs text-white/60">{percentage}%</div>
                            </div>
                            <div className="text-sm font-bold text-white">${amount.toFixed(2)}</div>
                          </div>
                        );
                      })}
                  </div>
                  
                  {/* 饼图占位符 */}
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl mb-1">🥧</div>
                        <div className="text-xs text-white/60">Pie Chart</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 预算进度 */}
            <div className="glass-card">
              <h3 className="text-lg font-semibold text-white mb-4">Budget Progress</h3>
              <div className="text-center text-white/70 py-8">
                Budget feature coming soon...
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assets' && (
          <div className="space-y-4 sm:space-y-6 pb-24 overflow-y-auto">
            {/* 净资产概览 */}
            <div className="glass-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Net Worth</h3>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">👁️</span>
                  </button>
                  <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">🔄</span>
                  </button>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">$0.00</div>
                <div className="flex justify-between text-sm">
                  <div className="text-white/80">Total Assets: $0.00</div>
                  <div className="text-white/80">Total Liabilities: $0.00</div>
                </div>
              </div>
            </div>

            {/* 账户分类 */}
            <div className="space-y-4">
              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-white">Assets</h4>
                  <div className="text-sm text-green-400">Balance $0.00</div>
                </div>
                
                <div className="text-center text-white/70 py-8">
                  No assets recorded yet, start adding your accounts!
                </div>
              </div>

              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-white">Liabilities</h4>
                  <div className="text-sm text-red-400">Debt $0.00</div>
                </div>
                
                <div className="text-center text-white/70 py-8">
                  No liabilities recorded yet.
                </div>
              </div>

              <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base font-semibold text-white">Investments</h4>
                  <div className="text-sm text-green-400">$0.00</div>
                </div>
                
                <div className="text-center text-white/70 py-8">
                  No investments recorded yet.
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </main>

      {/* Bottom Navigation - 移动端显示 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 lg:hidden">
        <div className="glass-card">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center py-2 sm:py-3 px-1 sm:px-2 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-300 bg-white/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1 drop-shadow-lg" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* 桌面端侧边导航 */}
      <nav className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 glass-card m-4 z-40">
        <div className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 py-3 px-4 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-300 bg-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 drop-shadow-lg" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

        {/* 悬浮的Quick Actions图标 */}
        <div className="fixed right-4 bottom-36 z-50 space-y-3">
          <button
            onClick={() => handleAddRecord()}
            className="w-16 h-12 glass-button rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-lg"
          >
            <Plus className="w-8 h-8 text-blue-300" />
          </button>
          <button
            onClick={() => setShowCamera(true)}
            className="w-16 h-12 glass-button rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-lg"
          >
            <Camera className="w-8 h-8 text-green-300" />
          </button>
        </div>

        {/* 相机组件 */}
        {showCamera && (
          <CameraCapture
            onImageCapture={handleImageCapture}
            onClose={() => setShowCamera(false)}
            loading={cameraLoading}
          />
        )}

        {/* 记账表单 */}
        {showRecordForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <RecordForm
              onSave={handleRecordSave}
              onCancel={() => {
                setShowRecordForm(false)
                setEditingRecord(null)
                setPresetCategory(undefined)
                setPresetType(undefined)
              }}
              initialRecord={editingRecord || undefined}
              presetCategory={presetCategory}
              presetType={presetType}
            />
          </div>
        )}
    </div>
  )
}
