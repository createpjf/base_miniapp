'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { debounce } from '@/lib/performance'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  onSearch: (query: string) => void
  debounceMs?: number
  className?: string
  showClearButton?: boolean
}

export function SearchInput({ 
  placeholder = '搜索...',
  onSearch,
  debounceMs = 300,
  className,
  showClearButton = true
}: SearchInputProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // 防抖搜索
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string) => {
      onSearch(searchQuery)
    }, debounceMs),
    [onSearch, debounceMs]
  )

  // 处理输入变化
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }, [debouncedSearch])

  // 清除搜索
  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  // 处理键盘事件
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear()
    }
  }, [handleClear])

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "flex items-center space-x-2 px-3 py-2 glass-input transition-all duration-200",
        isFocused && "ring-2 ring-blue-400/50"
      )}>
        <Search className="w-4 h-4 text-white/60 flex-shrink-0" />
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder-white/50 focus:outline-none"
        />
        
        {showClearButton && query && (
          <button
            onClick={handleClear}
            className="p-1 text-white/60 hover:text-white transition-colors"
            title="清除搜索"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

// 高级搜索组件
interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  className?: string
}

interface SearchFilters {
  query: string
  type: 'all' | 'income' | 'expense'
  category: string
  dateRange: {
    start: string
    end: string
  }
  amountRange: {
    min: number
    max: number
  }
}

export function AdvancedSearch({ onSearch, className }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    category: '',
    dateRange: { start: '', end: '' },
    amountRange: { min: 0, max: 10000 }
  })

  const [isExpanded, setIsExpanded] = useState(false)

  // 防抖搜索
  const debouncedSearch = useMemo(
    () => debounce((searchFilters: SearchFilters) => {
      onSearch(searchFilters)
    }, 500),
    [onSearch]
  )

  // 更新过滤器
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    debouncedSearch(newFilters)
  }, [filters, debouncedSearch])

  return (
    <div className={cn("space-y-4", className)}>
      {/* 基础搜索 */}
      <div className="flex space-x-2">
        <SearchInput
          placeholder="搜索记录..."
          onSearch={(query) => updateFilter('query', query)}
          className="flex-1"
        />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 glass-button text-sm"
        >
          {isExpanded ? '收起' : '高级'}
        </button>
      </div>

      {/* 高级搜索 */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 glass-card">
          {/* 类型筛选 */}
          <div>
            <label className="block text-sm text-white/80 mb-2">类型</label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              className="w-full px-3 py-2 glass-input text-white"
            >
              <option value="all">全部</option>
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
          </div>

          {/* 分类筛选 */}
          <div>
            <label className="block text-sm text-white/80 mb-2">分类</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-3 py-2 glass-input text-white"
            >
              <option value="">全部分类</option>
              <option value="Food & Drink">餐饮</option>
              <option value="Transportation">交通</option>
              <option value="Shopping">购物</option>
              <option value="Housing">住房</option>
              <option value="Entertainment">娱乐</option>
              <option value="Trade">交易</option>
              <option value="Others">其他</option>
            </select>
          </div>

          {/* 日期范围 */}
          <div>
            <label className="block text-sm text-white/80 mb-2">开始日期</label>
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => updateFilter('dateRange', { 
                ...filters.dateRange, 
                start: e.target.value 
              })}
              className="w-full px-3 py-2 glass-input text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">结束日期</label>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => updateFilter('dateRange', { 
                ...filters.dateRange, 
                end: e.target.value 
              })}
              className="w-full px-3 py-2 glass-input text-white"
            />
          </div>

          {/* 金额范围 */}
          <div>
            <label className="block text-sm text-white/80 mb-2">最小金额</label>
            <input
              type="number"
              value={filters.amountRange.min}
              onChange={(e) => updateFilter('amountRange', { 
                ...filters.amountRange, 
                min: Number(e.target.value) 
              })}
              className="w-full px-3 py-2 glass-input text-white"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm text-white/80 mb-2">最大金额</label>
            <input
              type="number"
              value={filters.amountRange.max}
              onChange={(e) => updateFilter('amountRange', { 
                ...filters.amountRange, 
                max: Number(e.target.value) 
              })}
              className="w-full px-3 py-2 glass-input text-white"
              min="0"
            />
          </div>
        </div>
      )}
    </div>
  )
}
