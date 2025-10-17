'use client'

import { useState, useEffect } from 'react'
import { Record, Category, AccountBook } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatAmount, formatDate } from '@/lib/utils'
import { recordStorage, categoryStorage, accountBookStorage } from '@/lib/storage'
import { Edit, Trash2, Plus } from 'lucide-react'

interface RecordListProps {
  accountBookId?: string
  onEdit: (record: Record) => void
  onAdd: () => void
}

export function RecordList({ accountBookId, onEdit, onAdd }: RecordListProps) {
  const [records, setRecords] = useState<Record[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [accountBooks, setAccountBooks] = useState<AccountBook[]>([])
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  useEffect(() => {
    loadData()
  }, [accountBookId])

  const loadData = () => {
    const allRecords = accountBookId 
      ? recordStorage.getByAccountBook(accountBookId)
      : recordStorage.getAll()
    
    setRecords(allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    setCategories(categoryStorage.getAll())
    setAccountBooks(accountBookStorage.getAll())
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      recordStorage.delete(id)
      loadData()
    }
  }

  const getCategory = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const getAccountBook = (bookId: string) => {
    return accountBooks.find(book => book.id === bookId)
  }

  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true
    return record.type === filter
  })

  const totalIncome = filteredRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0)

  const totalExpense = filteredRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">总收入</div>
            <div className="text-xl font-bold text-green-600">
              {formatAmount(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">总支出</div>
            <div className="text-xl font-bold text-red-600">
              {formatAmount(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选器 */}
      <div className="flex space-x-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
        >
          全部
        </Button>
        <Button
          variant={filter === 'income' ? 'default' : 'outline'}
          onClick={() => setFilter('income')}
          size="sm"
        >
          收入
        </Button>
        <Button
          variant={filter === 'expense' ? 'default' : 'outline'}
          onClick={() => setFilter('expense')}
          size="sm"
        >
          支出
        </Button>
      </div>

      {/* 添加按钮 */}
      <Button onClick={onAdd} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        添加记录
      </Button>

      {/* 记录列表 */}
      <div className="space-y-2">
        {filteredRecords.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              暂无记录
            </CardContent>
          </Card>
        ) : (
          filteredRecords.map((record) => {
            const category = getCategory(record.category)
            const accountBook = getAccountBook(record.accountBookId)
            
            return (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {category?.icon || '📝'}
                        </span>
                        <div>
                          <div className="font-medium">
                            {category?.name || '未知分类'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.description || '无描述'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(record.date)} • {accountBook?.name || '未知账本'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-bold ${
                        record.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.type === 'income' ? '+' : '-'}{formatAmount(record.amount)}
                      </div>
                      {record.originalAmount && record.originalCurrency && (
                        <div className="text-xs text-gray-500">
                          {record.originalAmount} {record.originalCurrency}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(record)}
                        className="h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(record.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
