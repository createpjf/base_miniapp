'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Budget, Category, Record } from '@/lib/types'
import { budgetStorage, categoryStorage, recordStorage } from '@/lib/storage'
import { formatAmount, calculateBudgetUsage, getBudgetStatusColor, generateId } from '@/lib/utils'
import { Plus, Edit, Trash2, Target, AlertTriangle } from 'lucide-react'

interface BudgetTrackerProps {
  accountBookId?: string
}

export function BudgetTracker({ accountBookId }: BudgetTrackerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [records, setRecords] = useState<Record[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'yearly',
  })

  useEffect(() => {
    loadData()
  }, [accountBookId])

  const loadData = () => {
    const allBudgets = accountBookId 
      ? budgetStorage.getByAccountBook(accountBookId)
      : budgetStorage.getAll()
    
    setBudgets(allBudgets)
    setCategories(categoryStorage.getAll())
    
    // 加载当前期间的记录
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const allRecords = accountBookId 
      ? recordStorage.getByAccountBook(accountBookId)
      : recordStorage.getAll()
    
    const monthlyRecords = allRecords.filter(record => {
      const recordDate = new Date(record.date)
      return recordDate >= startOfMonth && recordDate <= endOfMonth
    })
    
    setRecords(monthlyRecords)
  }

  const handleAdd = () => {
    setShowAddForm(true)
    setEditingBudget(null)
    setFormData({ category: '', amount: '', period: 'monthly' })
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setShowAddForm(true)
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    })
  }

  const handleSave = () => {
    if (!formData.category || !formData.amount) {
      alert('请填写完整信息')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的金额')
      return
    }

    const budget: Budget = {
      id: editingBudget?.id || generateId(),
      accountBookId: accountBookId || 'default',
      category: formData.category,
      amount,
      period: formData.period,
      startDate: editingBudget?.startDate || new Date().toISOString().split('T')[0],
    }

    budgetStorage.save(budget)
    loadData()
    setShowAddForm(false)
    setEditingBudget(null)
  }

  const handleDelete = (budgetId: string) => {
    if (confirm('确定要删除这个预算吗？')) {
      budgetStorage.delete(budgetId)
      loadData()
    }
  }

  const getCategoryUsage = (categoryId: string) => {
    return records
      .filter(r => r.type === 'expense' && r.category === categoryId)
      .reduce((sum, r) => sum + r.amount, 0)
  }

  const getBudgetStatus = (budget: Budget) => {
    const used = getCategoryUsage(budget.category)
    const usage = calculateBudgetUsage(used, budget.amount)
    const status = usage >= 100 ? 'over' : usage >= 80 ? 'warning' : 'good'
    
    return { used, usage, status }
  }

  return (
    <div className="space-y-6">
      {/* 添加预算按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">预算管理</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" />
          添加预算
        </Button>
      </div>

      {/* 预算列表 */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>还没有设置预算</p>
              <p className="text-sm">点击上方按钮添加预算</p>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => {
            const category = categories.find(c => c.id === budget.category)
            const { used, usage, status } = getBudgetStatus(budget)
            
            return (
              <Card key={budget.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category?.icon || '📝'}</span>
                      <div>
                        <div className="font-medium">{category?.name || '未知分类'}</div>
                        <div className="text-sm text-gray-500">
                          {budget.period === 'monthly' ? '月度' : '年度'}预算
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(budget)}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(budget.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        已用: {formatAmount(used)}
                      </span>
                      <span className="text-gray-600">
                        预算: {formatAmount(budget.amount)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          status === 'over' 
                            ? 'bg-red-500' 
                            : status === 'warning' 
                            ? 'bg-yellow-500' 
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(usage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        getBudgetStatusColor(usage)
                      }`}>
                        {usage.toFixed(1)}%
                      </span>
                      
                      {status === 'over' && (
                        <div className="flex items-center text-red-600 text-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          超支
                        </div>
                      )}
                      
                      {status === 'warning' && (
                        <div className="flex items-center text-yellow-600 text-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          接近预算
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* 添加/编辑表单 */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingBudget ? '编辑预算' : '添加预算'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="category">分类</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="">选择分类</option>
                {categories
                  .filter(cat => cat.type === 'expense')
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <Label htmlFor="amount">预算金额 (USDC)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>

            <div>
              <Label>预算周期</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  type="button"
                  variant={formData.period === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, period: 'monthly' })}
                  className="flex-1"
                >
                  月度
                </Button>
                <Button
                  type="button"
                  variant={formData.period === 'yearly' ? 'default' : 'outline'}
                  onClick={() => setFormData({ ...formData, period: 'yearly' })}
                  className="flex-1"
                >
                  年度
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="flex-1">
                保存
              </Button>
              <Button 
                onClick={() => setShowAddForm(false)} 
                variant="outline" 
                className="flex-1"
              >
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
