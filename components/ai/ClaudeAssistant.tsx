'use client'

import React, { useState } from 'react'
import { MessageCircle, Sparkles, TrendingUp, DollarSign, Lightbulb } from 'lucide-react'

interface ClaudeAssistantProps {
  onSuggestion?: (suggestion: any) => void
  records?: any[]
  income?: number
}

export function ClaudeAssistant({ onSuggestion, records = [], income = 0 }: ClaudeAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'advice' | 'report' | 'budget'>('chat')

  const askClaude = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ask',
          data: { question, context: { records, income } }
        })
      })

      const data = await res.json()
      if (data.success) {
        setResponse(data.data.answer)
      } else {
        setResponse('抱歉，AI助手暂时不可用。')
      }
    } catch (error) {
      setResponse('网络错误，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  const getSmartAdvice = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'accounting-advice',
          data: { 
            description: '日常消费', 
            amount: records.reduce((sum, r) => sum + (r.amount || 0), 0) / records.length || 0 
          }
        })
      })

      const data = await res.json()
      if (data.success) {
        setResponse(JSON.stringify(data.data, null, 2))
        onSuggestion?.(data.data)
      }
    } catch (error) {
      setResponse('获取建议失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'financial-report',
          data: { records }
        })
      })

      const data = await res.json()
      if (data.success) {
        setResponse(JSON.stringify(data.data, null, 2))
      }
    } catch (error) {
      setResponse('生成报告失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  const createBudget = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'smart-budget',
          data: { 
            income, 
            goals: ['储蓄', '投资', '应急基金'] 
          }
        })
      })

      const data = await res.json()
      if (data.success) {
        setResponse(JSON.stringify(data.data, null, 2))
      }
    } catch (error) {
      setResponse('创建预算失败，请稍后再试。')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 h-96 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
      <div className="p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Claude 助手</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-4">
          {[
            { id: 'chat', label: '对话', icon: MessageCircle },
            { id: 'advice', label: '建议', icon: Lightbulb },
            { id: 'report', label: '报告', icon: TrendingUp },
            { id: 'budget', label: '预算', icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-purple-500/30 text-purple-300' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="flex-1 bg-black/20 rounded-lg p-3 overflow-y-auto">
                <div className="text-white/80 text-sm whitespace-pre-wrap">
                  {response || '有什么可以帮助您的吗？'}
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="输入您的问题..."
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-purple-400"
                  onKeyPress={(e) => e.key === 'Enter' && askClaude()}
                />
                <button
                  onClick={askClaude}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
                >
                  {loading ? '...' : '发送'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'advice' && (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="flex-1 bg-black/20 rounded-lg p-3 overflow-y-auto">
                <div className="text-white/80 text-sm whitespace-pre-wrap">
                  {response || '点击获取智能建议'}
                </div>
              </div>
              <button
                onClick={getSmartAdvice}
                disabled={loading}
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
              >
                {loading ? '分析中...' : '获取智能建议'}
              </button>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="flex-1 bg-black/20 rounded-lg p-3 overflow-y-auto">
                <div className="text-white/80 text-sm whitespace-pre-wrap">
                  {response || '点击生成财务报告'}
                </div>
              </div>
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
              >
                {loading ? '生成中...' : '生成财务报告'}
              </button>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="flex-1 flex flex-col space-y-3">
              <div className="flex-1 bg-black/20 rounded-lg p-3 overflow-y-auto">
                <div className="text-white/80 text-sm whitespace-pre-wrap">
                  {response || '点击创建智能预算'}
                </div>
              </div>
              <button
                onClick={createBudget}
                disabled={loading}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
              >
                {loading ? '创建中...' : '创建智能预算'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
