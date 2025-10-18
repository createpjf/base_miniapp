'use client'

import React, { useEffect, useState } from 'react'
import { Activity, Zap, Clock, Database } from 'lucide-react'
import { performanceMonitor, getMemoryUsage } from '@/lib/performance'

interface PerformanceStats {
  fcp?: number
  lcp?: number
  memory?: {
    used: number
    total: number
    limit: number
  }
  renderTime: number
  componentCount: number
}

export function PerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    renderTime: 0,
    componentCount: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 测量渲染时间
    const startTime = performance.now()
    
    // 计算组件数量
    const componentCount = document.querySelectorAll('[data-component]').length
    
    // 获取内存使用情况
    const memory = getMemoryUsage()
    
    // 测量 Web Vitals
    performanceMonitor.measureWebVitals()
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    setStats({
      fcp: 0, // 将在 PerformanceObserver 中更新
      lcp: 0, // 将在 PerformanceObserver 中更新
      memory,
      renderTime,
      componentCount
    })

    // 监听性能指标
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          setStats(prev => ({ ...prev, fcp: entry.startTime }))
        } else if (entry.entryType === 'largest-contentful-paint') {
          setStats(prev => ({ ...prev, lcp: entry.startTime }))
        }
      }
    })

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  // 开发环境才显示
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* 切换按钮 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        title="性能监控"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* 性能面板 */}
      {isVisible && (
        <div className="fixed top-16 left-4 z-50 w-80 glass-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">性能监控</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* FCP */}
          {stats.fcp && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-green-400" />
                <span className="text-white/80">FCP</span>
              </div>
              <span className="text-white">
                {stats.fcp.toFixed(0)}ms
              </span>
            </div>
          )}

          {/* LCP */}
          {stats.lcp && (
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-blue-400" />
                <span className="text-white/80">LCP</span>
              </div>
              <span className="text-white">
                {stats.lcp.toFixed(0)}ms
              </span>
            </div>
          )}

          {/* 渲染时间 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Activity className="w-3 h-3 text-purple-400" />
              <span className="text-white/80">渲染时间</span>
            </div>
            <span className="text-white">
              {stats.renderTime.toFixed(2)}ms
            </span>
          </div>

          {/* 组件数量 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Database className="w-3 h-3 text-orange-400" />
              <span className="text-white/80">组件数量</span>
            </div>
            <span className="text-white">
              {stats.componentCount}
            </span>
          </div>

          {/* 内存使用 */}
          {stats.memory && (
            <div className="space-y-1">
              <div className="text-xs text-white/80">内存使用</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">已使用</span>
                  <span className="text-white">{stats.memory.used}MB</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">总计</span>
                  <span className="text-white">{stats.memory.total}MB</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">限制</span>
                  <span className="text-white">{stats.memory.limit}MB</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-red-400 h-1 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(stats.memory.used / stats.memory.limit) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 性能建议 */}
          <div className="pt-2 border-t border-white/20">
            <div className="text-xs text-white/60">
              {stats.renderTime > 100 && '⚠️ 渲染时间较长'}
              {stats.memory && stats.memory.used > stats.memory.limit * 0.8 && '⚠️ 内存使用率较高'}
              {stats.fcp && stats.fcp > 2000 && '⚠️ 首次内容绘制较慢'}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
