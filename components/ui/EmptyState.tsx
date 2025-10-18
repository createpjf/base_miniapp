'use client'

import React from 'react'
import { Plus, TrendingUp, BarChart3, Wallet } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  actionText: string
  onAction: () => void
  icon?: React.ReactNode
  features?: Array<{
    icon: React.ReactNode
    title: string
    description: string
  }>
}

export function EmptyState({ 
  title, 
  description, 
  actionText, 
  onAction, 
  icon,
  features = []
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {/* 主图标 */}
      <div className="w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center mb-6">
        {icon || (
          <TrendingUp className="w-10 h-10 text-blue-300" />
        )}
      </div>

      {/* 标题和描述 */}
      <h3 className="text-2xl font-bold text-white mb-3">
        {title}
      </h3>
      <p className="text-white/70 text-lg mb-8 max-w-md leading-relaxed">
        {description}
      </p>

      {/* 功能亮点 */}
      {features.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-4 bg-white/5 rounded-xl">
              <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-white/60 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 行动按钮 */}
      <button
        onClick={onAction}
        className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>{actionText}</span>
        </div>
      </button>
    </div>
  )
}

// 预设的空状态组件
export function RecordsEmptyState({ onAddRecord }: { onAddRecord: () => void }) {
  const features = [
    {
      icon: <Plus className="w-4 h-4 text-blue-300" />,
      title: '快速记账',
      description: '一键添加收支记录'
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-green-300" />,
      title: '智能分析',
      description: '自动生成财务报告'
    },
    {
      icon: <Wallet className="w-4 h-4 text-purple-300" />,
      title: '多币种',
      description: '支持主流加密货币'
    },
    {
      icon: <TrendingUp className="w-4 h-4 text-orange-300" />,
      title: '趋势跟踪',
      description: '实时价格和汇率'
    }
  ]

  return (
    <EmptyState
      title="开始您的记账之旅"
      description="轻松记录每一笔收支，让财务管理更简单"
      actionText="记录第一笔"
      onAction={onAddRecord}
      features={features}
    />
  )
}
