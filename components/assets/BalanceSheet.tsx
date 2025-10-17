'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Asset } from '@/lib/types'
import { assetStorage } from '@/lib/storage'
import { formatAmount, calculateNetWorth } from '@/lib/utils'
import { TrendingUp, TrendingDown, Wallet, CreditCard } from 'lucide-react'

interface BalanceSheetProps {
  accountBookId?: string
}

export function BalanceSheet({ accountBookId }: BalanceSheetProps) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [liabilities, setLiabilities] = useState<Asset[]>([])

  useEffect(() => {
    loadData()
  }, [accountBookId])

  const loadData = () => {
    const allAssets = assetStorage.getAll()
    
    // 这里简化处理，实际应用中应该有专门的负债管理
    // 暂时将某些资产类型视为负债（如信用卡债务）
    const assetList = allAssets.filter(asset => 
      !asset.name.toLowerCase().includes('信用卡') && 
      !asset.name.toLowerCase().includes('贷款')
    )
    
    const liabilityList = allAssets.filter(asset => 
      asset.name.toLowerCase().includes('信用卡') || 
      asset.name.toLowerCase().includes('贷款')
    )
    
    setAssets(assetList)
    setLiabilities(liabilityList)
  }

  const getTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.amount, 0)
  }

  const getTotalLiabilities = () => {
    return liabilities.reduce((sum, liability) => sum + liability.amount, 0)
  }

  const getNetWorth = () => {
    return calculateNetWorth(getTotalAssets(), getTotalLiabilities())
  }

  const getAssetsByType = (type: Asset['type']) => {
    return assets.filter(asset => asset.type === type)
  }

  const getTypeIcon = (type: Asset['type']) => {
    const icons: Record<Asset['type'], string> = {
      cash: '💵',
      bank: '🏦',
      crypto: '₿',
      stock: '📈',
      fund: '📊',
    }
    return icons[type] || '💰'
  }

  const getTypeLabel = (type: Asset['type']) => {
    const labels: Record<Asset['type'], string> = {
      cash: '现金',
      bank: '银行存款',
      crypto: '加密货币',
      stock: '股票',
      fund: '基金',
    }
    return labels[type] || '其他'
  }

  return (
    <div className="space-y-6">
      {/* 净资产概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>资产负债表</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${
              getNetWorth() >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatAmount(Math.abs(getNetWorth()))}
            </div>
            <div className="text-sm text-gray-500">
              {getNetWorth() >= 0 ? '净资产' : '净负债'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 资产详情 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>资产</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                暂无资产记录
              </div>
            ) : (
              <>
                {/* 按类型分组显示 */}
                {['cash', 'bank', 'crypto', 'stock', 'fund'].map(type => {
                  const typeAssets = getAssetsByType(type as Asset['type'])
                  if (typeAssets.length === 0) return null
                  
                  const total = typeAssets.reduce((sum, asset) => sum + asset.amount, 0)
                  
                  return (
                    <div key={type} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTypeIcon(type as Asset['type'])}</span>
                          <span className="font-medium">{getTypeLabel(type as Asset['type'])}</span>
                        </div>
                        <span className="font-bold text-green-600">
                          {formatAmount(total)}
                        </span>
                      </div>
                      
                      <div className="space-y-1 ml-6">
                        {typeAssets.map(asset => (
                          <div key={asset.id} className="flex justify-between text-sm text-gray-600">
                            <span>{asset.name}</span>
                            <span>{formatAmount(asset.amount)} {asset.currency}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>总资产</span>
                    <span className="text-green-600">
                      {formatAmount(getTotalAssets())}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 负债详情 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-red-600" />
            <span>负债</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {liabilities.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                暂无负债记录
              </div>
            ) : (
              <>
                {liabilities.map(liability => (
                  <div key={liability.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💳</span>
                      <span>{liability.name}</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {formatAmount(liability.amount)} {liability.currency}
                    </span>
                  </div>
                ))}
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-bold text-lg">
                    <span>总负债</span>
                    <span className="text-red-600">
                      {formatAmount(getTotalLiabilities())}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 财务健康度 */}
      <Card>
        <CardHeader>
          <CardTitle>财务健康度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>资产总额</span>
              <span className="font-medium">{formatAmount(getTotalAssets())}</span>
            </div>
            <div className="flex justify-between">
              <span>负债总额</span>
              <span className="font-medium">{formatAmount(getTotalLiabilities())}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>净资产</span>
              <span className={getNetWorth() >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatAmount(getNetWorth())}
              </span>
            </div>
            
            {getTotalAssets() > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">负债率</div>
                <div className="text-lg font-bold">
                  {((getTotalLiabilities() / getTotalAssets()) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getTotalLiabilities() / getTotalAssets() > 0.5 
                    ? '负债率较高，建议控制债务' 
                    : '负债率健康'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
