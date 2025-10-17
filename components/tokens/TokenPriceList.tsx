'use client'

import { useState, useEffect } from 'react'
import { Token } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TokenPriceListProps {
  tokens: Token[]
  loading?: boolean
}

export function TokenPriceList({ tokens, loading = false }: TokenPriceListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
      {tokens.map((token) => (
        <div key={token.id} className="glass-card hover:bg-white/20 transition-all">
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={token.image}
                  alt={token.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/32x32?text=?'
                  }}
                />
                <div>
                  <div className="font-medium text-sm text-white">{token.symbol.toUpperCase()}</div>
                  <div className="text-xs text-white/70">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm text-white">
                  ${token.current_price.toFixed(2)}
                </div>
                <div className={`text-xs flex items-center ${
                  token.price_change_percentage_24h >= 0 
                    ? 'text-green-300' 
                    : 'text-red-300'
                }`}>
                  {token.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(token.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
