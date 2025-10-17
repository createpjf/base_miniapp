'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Asset } from '@/lib/types'
import { assetStorage } from '@/lib/storage'
import { formatAmount, generateId } from '@/lib/utils'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface AssetManagerProps {
  accountBookId?: string
}

export function AssetManager({ accountBookId }: AssetManagerProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'cash' as Asset['type'],
    amount: '',
    currency: 'USDC',
  })

  const assetTypes = [
    { value: 'cash', label: '现金', icon: '💵' },
    { value: 'bank', label: '银行存款', icon: '🏦' },
    { value: 'crypto', label: '加密货币', icon: '₿' },
    { value: 'stock', label: '股票', icon: '📈' },
    { value: 'fund', label: '基金', icon: '📊' },
  ]

  const currencies = ['USDC', 'USD', 'ETH', 'BTC', 'DEGEN', 'BRETT']

  useEffect(() => {
    loadAssets()
  }, [accountBookId])

  const loadAssets = () => {
    const allAssets = assetStorage.getAll()
    setAssets(allAssets)
  }

  const handleAdd = () => {
    setShowAddForm(true)
    setEditingAsset(null)
    setFormData({ name: '', type: 'cash', amount: '', currency: 'USDC' })
  }

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setShowAddForm(true)
    setFormData({
      name: asset.name,
      type: asset.type,
      amount: asset.amount.toString(),
      currency: asset.currency,
    })
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.amount) {
      alert('请填写完整信息')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount < 0) {
      alert('请输入有效的金额')
      return
    }

    const asset: Asset = {
      id: editingAsset?.id || generateId(),
      name: formData.name.trim(),
      type: formData.type,
      amount,
      currency: formData.currency,
      updatedAt: new Date().toISOString(),
    }

    assetStorage.save(asset)
    loadAssets()
    setShowAddForm(false)
    setEditingAsset(null)
  }

  const handleDelete = (assetId: string) => {
    if (confirm('确定要删除这个资产吗？')) {
      assetStorage.delete(assetId)
      loadAssets()
    }
  }

  const getTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.amount, 0)
  }

  const getAssetsByType = (type: Asset['type']) => {
    return assets.filter(asset => asset.type === type)
  }

  const getTypeIcon = (type: Asset['type']) => {
    const typeInfo = assetTypes.find(t => t.value === type)
    return typeInfo?.icon || '💰'
  }

  const getTypeLabel = (type: Asset['type']) => {
    const typeInfo = assetTypes.find(t => t.value === type)
    return typeInfo?.label || '其他'
  }

  return (
    <div className="space-y-6">
      {/* 总资产概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>资产概览</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatAmount(getTotalAssets())}
            </div>
            <div className="text-sm text-gray-500">总资产价值</div>
          </div>
        </CardContent>
      </Card>

      {/* 按类型统计 */}
      <div className="grid grid-cols-2 gap-4">
        {assetTypes.map((type) => {
          const typeAssets = getAssetsByType(type.value as Asset['type'])
          const total = typeAssets.reduce((sum, asset) => sum + asset.amount, 0)
          
          return (
            <Card key={type.value}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{type.icon}</span>
                  <div className="text-sm text-gray-600">{type.label}</div>
                </div>
                <div className="text-xl font-bold">
                  {formatAmount(total)}
                </div>
                <div className="text-xs text-gray-500">
                  {typeAssets.length} 项资产
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 添加资产按钮 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">我的资产</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-1" />
          添加资产
        </Button>
      </div>

      {/* 资产列表 */}
      <div className="space-y-2">
        {assets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>还没有添加资产</p>
              <p className="text-sm">点击上方按钮添加资产</p>
            </CardContent>
          </Card>
        ) : (
          assets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(asset.type)}</span>
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-gray-500">
                        {getTypeLabel(asset.type)} • {asset.currency}
                      </div>
                      <div className="text-xs text-gray-400">
                        更新于 {new Date(asset.updatedAt).toLocaleDateString('zh-CN')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {formatAmount(asset.amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {asset.currency}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(asset)}
                      className="h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(asset.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 添加/编辑表单 */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {editingAsset ? '编辑资产' : '添加资产'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">资产名称</Label>
              <Input
                id="name"
                placeholder="例如：工资卡、投资账户"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="type">资产类型</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Asset['type'] })}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {assetTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="amount">金额</Label>
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
              <Label htmlFor="currency">币种</Label>
              <select
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
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
