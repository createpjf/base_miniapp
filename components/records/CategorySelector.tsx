'use client'

import { useState, useEffect } from 'react'
import { Category } from '@/lib/types'
import { categoryStorage } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface CategorySelectorProps {
  type: 'income' | 'expense'
  selectedCategory: string
  onSelect: (categoryId: string) => void
  onEdit?: (category: Category) => void
  onAdd?: () => void
}

export function CategorySelector({ 
  type, 
  selectedCategory, 
  onSelect, 
  onEdit, 
  onAdd 
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    loadCategories()
  }, [type])

  const loadCategories = () => {
    const allCategories = categoryStorage.getAll()
    const filteredCategories = allCategories.filter(cat => cat.type === type)
    setCategories(filteredCategories)
  }

  const handleDelete = (categoryId: string) => {
    if (confirm('确定要删除这个分类吗？')) {
      categoryStorage.delete(categoryId)
      loadCategories()
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {type === 'income' ? '收入分类' : '支出分类'}
          </CardTitle>
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              添加
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => onSelect(category.id)}
              className="h-12 flex flex-col items-center justify-center space-y-1"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="text-xs">{category.name}</span>
            </Button>
          ))}
        </div>
        
        {/* 编辑和删除按钮 */}
        {onEdit && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600 mb-2">管理分类</div>
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                      className="h-6 w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                      className="h-6 w-6 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
