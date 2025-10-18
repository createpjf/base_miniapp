'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface TabsProps {
  items: TabItem[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function Tabs({ items, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-1 bg-white/10 rounded-xl p-1", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={cn(
            "flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative",
            activeTab === item.id
              ? "bg-white/20 text-white shadow-lg"
              : "text-white/70 hover:text-white hover:bg-white/10"
          )}
        >
          {item.icon && (
            <span className="w-4 h-4">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
          
          {/* 活动指示器 */}
          {activeTab === item.id && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}

// 滑动指示器版本
export function SlidingTabs({ items, activeTab, onTabChange, className }: TabsProps) {
  const activeIndex = items.findIndex(item => item.id === activeTab)
  
  return (
    <div className={cn("relative", className)}>
      <div className="flex space-x-1 bg-white/10 rounded-xl p-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative z-10",
              activeTab === item.id
                ? "text-white"
                : "text-white/70 hover:text-white"
            )}
          >
            {item.icon && (
              <span className="w-4 h-4">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
      
      {/* 滑动背景 */}
      <div 
        className="absolute top-1 bottom-1 bg-white/20 rounded-lg transition-all duration-300 ease-out shadow-lg"
        style={{
          left: `${(activeIndex * 100) / items.length + 0.5}%`,
          width: `${100 / items.length - 1}%`
        }}
      />
    </div>
  )
}
