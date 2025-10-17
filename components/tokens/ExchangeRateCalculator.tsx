'use client'

import { useState, useEffect } from 'react'
import { ExchangeRate } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'

interface ExchangeRateCalculatorProps {
  exchangeRates: ExchangeRate[]
}

export function ExchangeRateCalculator({ exchangeRates }: ExchangeRateCalculatorProps) {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('ETH')
  const [toCurrency, setToCurrency] = useState('USDC')
  const [result, setResult] = useState(0)

  const currencies = Array.from(new Set([
    'USDC',
    ...exchangeRates.map(rate => rate.from)
  ]))

  const calculateExchange = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      setResult(0)
      return
    }

    if (fromCurrency === toCurrency) {
      setResult(numAmount)
      return
    }

    if (fromCurrency === 'USDC') {
      // 从 USDC 转换到其他币种
      const rate = exchangeRates.find(rate => rate.from === toCurrency)
      setResult(rate ? numAmount / rate.rate : 0)
    } else if (toCurrency === 'USDC') {
      // 从其他币种转换到 USDC
      const rate = exchangeRates.find(rate => rate.from === fromCurrency)
      setResult(rate ? numAmount * rate.rate : 0)
    } else {
      // 从一种币种转换到另一种币种（通过 USDC 中转）
      const fromRate = exchangeRates.find(rate => rate.from === fromCurrency)
      const toRate = exchangeRates.find(rate => rate.from === toCurrency)
      
      if (fromRate && toRate) {
        const usdcAmount = numAmount * fromRate.rate
        setResult(usdcAmount / toRate.rate)
      } else {
        setResult(0)
      }
    }
  }

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  useEffect(() => {
    calculateExchange()
  }, [amount, fromCurrency, toCurrency, exchangeRates])

  return (
    <div className="glass-card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white drop-shadow-lg">汇率计算器</h3>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-white/80">金额</Label>
          <Input
            id="amount"
            type="number"
            placeholder="输入金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="glass-input text-white placeholder-white/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="from" className="text-white/80 text-sm">从</Label>
            <select
              id="from"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full h-10 px-3 py-2 glass-input text-white rounded-md text-sm"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency} className="bg-gray-800">
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 sm:justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="w-full sm:w-auto glass-button"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="to" className="text-white/80 text-sm">到</Label>
            <select
              id="to"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full h-10 px-3 py-2 glass-input text-white rounded-md text-sm"
            >
              {currencies.map(currency => (
                <option key={currency} value={currency} className="bg-gray-800">
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {result > 0 && (
          <div className="p-4 glass-card">
            <div className="text-sm text-white/80">转换结果</div>
            <div className="text-2xl font-bold text-white drop-shadow-lg">
              {result.toFixed(6)} {toCurrency}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
