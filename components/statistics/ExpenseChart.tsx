'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Record, Category } from '@/lib/types'
import { recordStorage, categoryStorage } from '@/lib/storage'
import { formatAmount, getDateRange } from '@/lib/utils'
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface ExpenseChartProps {
  accountBookId?: string
}

export function ExpenseChart({ accountBookId }: ExpenseChartProps) {
  const [records, setRecords] = useState<Record[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line')

  useEffect(() => {
    loadData()
  }, [accountBookId, period])

  const loadData = () => {
    const allRecords = accountBookId 
      ? recordStorage.getByAccountBook(accountBookId)
      : recordStorage.getAll()
    
    const { start, end } = getDateRange(period)
    const filteredRecords = allRecords.filter(record => 
      record.date >= start && record.date <= end
    )
    
    setRecords(filteredRecords)
    setCategories(categoryStorage.getAll())
  }

  // 生成趋势数据
  const generateTrendData = () => {
    const { start, end } = getDateRange(period)
    const data = []
    const startDate = new Date(start)
    const endDate = new Date(end)
    
    const interval = period === 'week' ? 1 : period === 'month' ? 7 : 30
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayRecords = records.filter(r => r.date === dateStr)
      
      const income = dayRecords
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0)
      
      const expense = dayRecords
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + r.amount, 0)
      
      data.push({
        date: dateStr,
        income,
        expense,
        net: income - expense,
        displayDate: currentDate.toLocaleDateString('zh-CN', { 
          month: 'short', 
          day: 'numeric' 
        })
      })
      
      currentDate.setDate(currentDate.getDate() + interval)
    }
    
    return data
  }

  // 生成分类数据
  const generateCategoryData = () => {
    const categoryMap = new Map<string, { name: string; amount: number; color: string; icon: string }>()
    
    records
      .filter(r => r.type === 'expense')
      .forEach(record => {
        const category = categories.find(c => c.id === record.category)
        if (category) {
          const existing = categoryMap.get(record.category) || {
            name: category.name,
            amount: 0,
            color: category.color,
            icon: category.icon
          }
          existing.amount += record.amount
          categoryMap.set(record.category, existing)
        }
      })
    
    return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount)
  }

  const trendData = generateTrendData()
  const categoryData = generateCategoryData()
  
  const totalIncome = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0)
  
  const totalExpense = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0)
  
  const netIncome = totalIncome - totalExpense

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <div className="text-sm text-gray-600">总收入</div>
            </div>
            <div className="text-xl font-bold text-green-600">
              {formatAmount(totalIncome)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <div className="text-sm text-gray-600">总支出</div>
            </div>
            <div className="text-xl font-bold text-red-600">
              {formatAmount(totalExpense)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div className="text-sm text-gray-600">净收入</div>
            </div>
            <div className={`text-xl font-bold ${
              netIncome >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatAmount(netIncome)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 控制面板 */}
      <div className="flex flex-wrap gap-2">
        <div className="flex space-x-1">
          <Button
            variant={period === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('week')}
          >
            周
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            月
          </Button>
          <Button
            variant={period === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('year')}
          >
            年
          </Button>
        </div>
        
        <div className="flex space-x-1">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            趋势图
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            柱状图
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            饼图
          </Button>
        </div>
      </div>

      {/* 图表 */}
      <Card>
        <CardHeader>
          <CardTitle>
            {chartType === 'line' && '收支趋势'}
            {chartType === 'bar' && '收支对比'}
            {chartType === 'pie' && '支出分类'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'line' ? (
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatAmount(value), 
                      name === 'income' ? '收入' : name === 'expense' ? '支出' : '净收入'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="收入"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    name="支出"
                  />
                </LineChart>
              ) : chartType === 'bar' ? (
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      formatAmount(value), 
                      name === 'income' ? '收入' : '支出'
                    ]}
                  />
                  <Bar dataKey="income" fill="#10B981" name="收入" />
                  <Bar dataKey="expense" fill="#EF4444" name="支出" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatAmount(value), '金额']} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
