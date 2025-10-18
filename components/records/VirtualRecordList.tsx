'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Record } from '@/lib/types'
import { calculateVisibleRange } from '@/lib/performance'

interface VirtualRecordListProps {
  records: Record[]
  onEdit?: (record: Record) => void
  onDelete?: (record: Record) => void
  height?: number
  itemHeight?: number
}

export function VirtualRecordList({ 
  records, 
  onEdit, 
  onDelete, 
  height = 400,
  itemHeight = 80 
}: VirtualRecordListProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(height)

  // 计算可见范围
  const visibleRange = useMemo(() => {
    return calculateVisibleRange(scrollTop, {
      itemHeight,
      containerHeight,
      overscan: 5
    })
  }, [scrollTop, itemHeight, containerHeight])

  // 可见的记录
  const visibleRecords = useMemo(() => {
    return records.slice(visibleRange.start, visibleRange.end)
  }, [records, visibleRange])

  // 总高度
  const totalHeight = records.length * itemHeight

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // 调整容器高度
  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(height)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [height])

  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-white/60">
        暂无记录
      </div>
    )
  }

  return (
    <div
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${visibleRange.start * itemHeight}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleRecords.map((record, index) => (
            <RecordItem
              key={record.id}
              record={record}
              style={{ height: itemHeight }}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface RecordItemProps {
  record: Record
  style: React.CSSProperties
  onEdit?: (record: Record) => void
  onDelete?: (record: Record) => void
}

function RecordItem({ record, style, onEdit, onDelete }: RecordItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={style}
      className="flex items-center justify-between px-4 py-3 border-b border-white/10 hover:bg-white/5 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg">
            {record.type === 'income' ? '💰' : '💸'}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {record.description || 'No description'}
          </div>
          <div className="text-xs text-white/60">
            {record.category} • {new Date(record.date).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className={`text-sm font-bold ${
          record.type === 'income' ? 'text-green-400' : 'text-red-400'
        }`}>
          {record.type === 'income' ? '+' : '-'}${record.amount.toFixed(2)}
        </div>

        {isHovered && (onEdit || onDelete) && (
          <div className="flex items-center space-x-1">
            {onEdit && (
              <button
                onClick={() => onEdit(record)}
                className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                title="编辑"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(record)}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                title="删除"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
