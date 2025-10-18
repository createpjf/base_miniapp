'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-white/20 border-t-white",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-white/70 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// 骨架屏组件
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/10", className)}
      {...props}
    />
  )
}

// 记录项骨架屏
export function RecordSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

// 分类项骨架屏
export function CategorySkeleton() {
  return (
    <div className="bg-white/10 rounded-xl p-3 text-center animate-pulse">
      <Skeleton className="w-8 h-8 mx-auto mb-2 rounded-full" />
      <Skeleton className="h-3 w-16 mx-auto mb-1" />
      <Skeleton className="h-4 w-12 mx-auto" />
    </div>
  )
}

// 页面加载骨架屏
export function PageSkeleton() {
  return (
    <div className="space-y-6 p-4">
      {/* 分类区域 */}
      <div className="glass-card p-4">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      </div>

      {/* 最近记录区域 */}
      <div className="glass-card p-4">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <RecordSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
