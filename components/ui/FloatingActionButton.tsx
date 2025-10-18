'use client'

import React, { useState } from 'react'
import { Plus, Camera, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingActionButtonProps {
  onManualAdd: () => void
  onCameraAdd: () => void
  className?: string
}

export function FloatingActionButton({ 
  onManualAdd, 
  onCameraAdd, 
  className 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={cn("fixed right-4 bottom-24 z-50", className)}>
      {/* 子按钮 */}
      <div className={cn(
        "flex flex-col space-y-3 mb-4 transition-all duration-300 ease-out",
        isExpanded 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-0 translate-y-4 scale-95 pointer-events-none"
      )}>
        {/* 相机按钮 */}
        <button
          onClick={() => {
            onCameraAdd()
            setIsExpanded(false)
          }}
          className="group w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* 手动添加按钮 */}
        <button
          onClick={() => {
            onManualAdd()
            setIsExpanded(false)
          }}
          className="group w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        >
          <Plus className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>

      {/* 主按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "group w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transform transition-all duration-300",
          isExpanded ? "rotate-45 scale-110" : "hover:scale-110"
        )}
      >
        {isExpanded ? (
          <X className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" />
        ) : (
          <Plus className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-200" />
        )}
      </button>

      {/* 波纹效果 */}
      <div className={cn(
        "absolute inset-0 rounded-full bg-purple-400/30 scale-0 transition-transform duration-300",
        isExpanded && "scale-150"
      )} />
    </div>
  )
}

// 简单版本（当前使用的）
export function SimpleFAB({ onManualAdd, onCameraAdd, className }: FloatingActionButtonProps) {
  return (
    <div className={cn("fixed right-4 bottom-36 z-50 space-y-3", className)}>
        <button
          onClick={onManualAdd}
          className="group w-16 h-12 glass-button rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ripple hover-lift"
        >
          <Plus className="w-8 h-8 text-blue-300 group-hover:scale-110 transition-transform duration-200" />
        </button>
        <button
          onClick={onCameraAdd}
          className="group w-16 h-12 glass-button rounded-full flex items-center justify-center hover:bg-white/30 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ripple hover-lift"
        >
          <Camera className="w-8 h-8 text-green-300 group-hover:scale-110 transition-transform duration-200" />
        </button>
    </div>
  )
}
