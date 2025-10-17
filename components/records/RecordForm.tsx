'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Record, Category, AccountBook } from '@/lib/types'
import { generateId, formatAmount } from '@/lib/utils'
import { recordStorage, categoryStorage, accountBookStorage } from '@/lib/storage'

// 代币配置
const TOKENS = [
  { symbol: 'USDC', name: 'USD Coin', icon: '/icons/tokens/usdc.svg' },
  { symbol: 'ETH', name: 'Ethereum', icon: '/icons/tokens/eth.svg' },
  { symbol: 'DEGEN', name: 'DEGEN', icon: '/icons/tokens/degen.svg' },
  { symbol: 'FLOCK', name: 'FLOCK', icon: '/icons/tokens/flock.svg' },
]

interface RecordFormProps {
  onSave: (record: Record) => void
  onCancel: () => void
  initialRecord?: Record
  presetCategory?: string
  presetType?: 'expense' | 'income'
}

export function RecordForm({ onSave, onCancel, initialRecord, presetCategory, presetType }: RecordFormProps) {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    originalAmount: '',
    originalCurrency: 'USDC',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    accountBookId: 'default',
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [accountBooks, setAccountBooks] = useState<AccountBook[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCategories(categoryStorage.getAll())
    setAccountBooks(accountBookStorage.getAll())
    
    if (initialRecord) {
      setFormData({
        type: initialRecord.type,
        amount: initialRecord.amount.toString(),
        originalAmount: initialRecord.originalAmount?.toString() || '',
        originalCurrency: initialRecord.originalCurrency || 'USDC',
        category: initialRecord.category,
        date: initialRecord.date,
        description: initialRecord.description,
        accountBookId: initialRecord.accountBookId,
      })
    } else if (presetCategory || presetType) {
      // 设置预设类型和分类
      const categories = categoryStorage.getAll()
      const matchedCategory = categories.find(cat => cat.name === presetCategory)
      
      setFormData(prev => ({
        ...prev,
        type: presetType || prev.type,
        category: matchedCategory?.id || presetCategory || prev.category
      }))
    }
  }, [initialRecord, presetCategory, presetType])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const amount = parseFloat(formData.amount)
      if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount')
        return
      }

      const record: Record = {
        id: initialRecord?.id || generateId(),
        type: formData.type,
        amount,
        originalAmount: formData.originalAmount ? parseFloat(formData.originalAmount) : undefined,
        originalCurrency: formData.originalCurrency,
        category: formData.category,
        date: formData.date,
        description: formData.description,
        accountBookId: formData.accountBookId,
        createdAt: initialRecord?.createdAt || new Date().toISOString(),
      }

      // 保存到后端API
      const response = await fetch('/api/records', {
        method: initialRecord ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        throw new Error('Failed to save record')
      }

      const savedRecord = await response.json()
      onSave(savedRecord.record)
    } catch (error) {
      console.error('Error saving record:', error)
      alert('Failed to save record, please try again')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm glass-card max-h-[80vh] flex flex-col">
        <div className="p-4 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white mb-4 text-center">
            {initialRecord ? 'Edit Record' : 'Add Record'}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <form id="record-form" onSubmit={handleSubmit} className="space-y-3">
          {/* Type Selection */}
          <div>
            <Label className="text-white/80">Type</Label>
            <div className="flex space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  formData.type === 'income' 
                    ? 'bg-accent-lime text-dark-gray' 
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  formData.type === 'expense' 
                    ? 'bg-accent-orange text-white' 
                    : 'bg-white/20 text-white/80 hover:bg-white/30'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Amount and Original Amount in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount" className="text-white/80">Amount (USDC)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="glass-input text-white placeholder-white/50"
                required
              />
            </div>
            <div>
              <Label htmlFor="originalAmount" className="text-white/80">Original Amount</Label>
              <div className="flex space-x-2">
                <Input
                  id="originalAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.originalAmount}
                  onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                  className="flex-1 glass-input text-white placeholder-white/50"
                />
                <div className="relative">
                  <select
                    value={formData.originalCurrency}
                    onChange={(e) => setFormData({ ...formData, originalCurrency: e.target.value })}
                    className="px-3 py-2 glass-input text-white rounded-md text-sm appearance-none pr-8"
                  >
                    {TOKENS.map((token) => (
                      <option key={token.symbol} value={token.symbol} className="bg-gray-800">
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center">
                    <img
                      src={TOKENS.find(token => token.symbol === formData.originalCurrency)?.icon || '/icons/tokens/usdc.svg'}
                      alt={formData.originalCurrency}
                      className="w-5 h-5"
                      onLoad={() => console.log('Icon loaded successfully:', formData.originalCurrency)}
                      onError={(e) => {
                        console.log('Icon load error:', e.currentTarget.src);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-white/80">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-10 px-3 py-2 glass-input text-white rounded-md text-sm"
              required
            >
              <option value="" className="bg-gray-800">Select Category</option>
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id} className="bg-gray-800">
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-white/80">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="glass-input text-white"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white/80">Description</Label>
            <Input
              id="description"
              placeholder="Add notes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="glass-input text-white placeholder-white/50"
            />
          </div>

          {/* Account Book */}
          <div>
            <Label htmlFor="accountBook" className="text-white/80">Account Book</Label>
            <select
              id="accountBook"
              value={formData.accountBookId}
              onChange={(e) => setFormData({ ...formData, accountBookId: e.target.value })}
              className="w-full h-10 px-3 py-2 glass-input text-white rounded-md text-sm"
            >
              {accountBooks.map(book => (
                <option key={book.id} value={book.id} className="bg-gray-800">
                  {book.icon} {book.name}
                </option>
              ))}
            </select>
          </div>

          </form>
        </div>
        {/* Fixed Buttons */}
        <div className="flex-shrink-0 p-4 border-t border-white/20">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 glass-button text-center py-2 text-white hover:bg-red-400/30 hover:text-red-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="record-form"
              disabled={loading}
              className="flex-1 glass-button text-center py-2 text-white hover:bg-green-400/30 hover:text-green-300 transition-all duration-200 disabled:opacity-50 disabled:hover:bg-white/20 disabled:hover:text-white"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
