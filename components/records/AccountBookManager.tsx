'use client'

import { useState, useEffect } from 'react'
import { AccountBook } from '@/lib/types'
import { accountBookStorage } from '@/lib/storage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { generateId } from '@/lib/utils'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'

interface AccountBookManagerProps {
  selectedBookId: string
  onSelect: (bookId: string) => void
}

export function AccountBookManager({ selectedBookId, onSelect }: AccountBookManagerProps) {
  const [accountBooks, setAccountBooks] = useState<AccountBook[]>([])
  const [editingBook, setEditingBook] = useState<AccountBook | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: '📝',
    color: '#3B82F6',
  })

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ]

  const icons = [
    '🏠', '💼', '📈', '🎯', '💰', '🛍️', '🍽️', '🚗',
    '🎮', '📚', '🏥', '✈️', '🎨', '🎵', '🏃', '📱'
  ]

  useEffect(() => {
    loadAccountBooks()
  }, [])

  const loadAccountBooks = () => {
    setAccountBooks(accountBookStorage.getAll())
  }

  const handleAdd = () => {
    setShowAddForm(true)
    setFormData({ name: '', icon: '📝', color: '#3B82F6' })
  }

  const handleEdit = (book: AccountBook) => {
    setEditingBook(book)
    setFormData({
      name: book.name,
      icon: book.icon,
      color: book.color,
    })
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('请输入账本名称')
      return
    }

    const book: AccountBook = {
      id: editingBook?.id || generateId(),
      name: formData.name.trim(),
      icon: formData.icon,
      color: formData.color,
      createdAt: editingBook?.createdAt || new Date().toISOString(),
    }

    accountBookStorage.save(book)
    loadAccountBooks()
    
    if (editingBook) {
      setEditingBook(null)
    } else {
      setShowAddForm(false)
    }
    
    setFormData({ name: '', icon: '📝', color: '#3B82F6' })
  }

  const handleCancel = () => {
    setEditingBook(null)
    setShowAddForm(false)
    setFormData({ name: '', icon: '📝', color: '#3B82F6' })
  }

  const handleDelete = (bookId: string) => {
    if (confirm('确定要删除这个账本吗？删除后相关记录也会被删除。')) {
      accountBookStorage.delete(bookId)
      loadAccountBooks()
      if (selectedBookId === bookId) {
        onSelect('default')
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* 账本列表 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">我的账本</CardTitle>
            <Button onClick={handleAdd} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加账本
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {accountBooks.map((book) => (
              <div
                key={book.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedBookId === book.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onSelect(book.id)}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: book.color }}
                  >
                    {book.icon}
                  </div>
                  <div>
                    <div className="font-medium">{book.name}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(book.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(book)
                    }}
                    className="h-6 w-6"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  {book.id !== 'default' && book.id !== 'investment' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(book.id)
                      }}
                      className="h-6 w-6 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 添加/编辑表单 */}
      {(showAddForm || editingBook) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingBook ? '编辑账本' : '添加账本'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">账本名称</Label>
              <Input
                id="name"
                placeholder="输入账本名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label>选择图标</Label>
              <div className="grid grid-cols-8 gap-2 mt-2">
                {icons.map((icon) => (
                  <Button
                    key={icon}
                    variant={formData.icon === icon ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setFormData({ ...formData, icon })}
                    className="h-10 w-10"
                  >
                    {icon}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>选择颜色</Label>
              <div className="grid grid-cols-8 gap-2 mt-2">
                {colors.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="icon"
                    onClick={() => setFormData({ ...formData, color })}
                    className="h-10 w-10"
                    style={{ backgroundColor: color }}
                  >
                    {formData.color === color && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSave} className="flex-1">
                <Check className="w-4 h-4 mr-1" />
                保存
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                <X className="w-4 h-4 mr-1" />
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
