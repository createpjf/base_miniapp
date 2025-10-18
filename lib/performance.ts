// 性能优化工具函数

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 虚拟滚动配置
export interface VirtualScrollConfig {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

// 计算可见范围
export function calculateVisibleRange(
  scrollTop: number,
  config: VirtualScrollConfig
) {
  const { itemHeight, containerHeight, overscan = 5 } = config
  const start = Math.floor(scrollTop / itemHeight)
  const end = Math.min(
    start + Math.ceil(containerHeight / itemHeight) + overscan,
    Infinity
  )
  
  return { start, end }
}

// 批量 DOM 操作
export function batchDOMOperations(operations: (() => void)[]) {
  // 使用 requestAnimationFrame 批量执行 DOM 操作
  requestAnimationFrame(() => {
    operations.forEach(operation => operation())
  })
}

// 图片懒加载
export function createImageObserver(callback: (entries: IntersectionObserverEntry[]) => void) {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  })
}

// 预加载资源
export function preloadResource(url: string, type: 'image' | 'script' | 'style' = 'image') {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = url
    
    switch (type) {
      case 'image':
        link.as = 'image'
        break
      case 'script':
        link.as = 'script'
        break
      case 'style':
        link.as = 'style'
        break
    }
    
    link.onload = () => resolve(url)
    link.onerror = () => reject(new Error(`Failed to preload ${url}`))
    
    document.head.appendChild(link)
  })
}

// 性能监控
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private marks: Map<string, number> = new Map()
  
  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }
  
  mark(name: string) {
    this.marks.set(name, performance.now())
  }
  
  measure(name: string, startMark: string) {
    const start = this.marks.get(startMark)
    const end = performance.now()
    
    if (start !== undefined) {
      const duration = end - start
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
      return duration
    }
    
    return 0
  }
  
  // Web Vitals 监控
  measureWebVitals() {
    if (typeof window !== 'undefined') {
      // 测量 FCP (First Contentful Paint)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime)
          }
        }
      }).observe({ entryTypes: ['paint'] })
      
      // 测量 LCP (Largest Contentful Paint)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log('LCP:', entry.startTime)
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }
}

// 内存使用监控
export function getMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    }
  }
  return null
}

// 缓存管理
export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()
  
  set(key: string, data: any, ttl: number = 300000) { // 默认 5 分钟
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }
  
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  clear() {
    this.cache.clear()
  }
  
  size() {
    return this.cache.size
  }
}

// 导出单例
export const performanceMonitor = PerformanceMonitor.getInstance()
export const cacheManager = new CacheManager()
