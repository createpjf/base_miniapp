import { NextResponse } from 'next/server'
import { getTokenPrices, getExchangeRates } from '@/lib/api/tokens'

export async function GET() {
  try {
    const [tokens, exchangeRates] = await Promise.all([
      getTokenPrices(),
      getExchangeRates(),
    ])

    return NextResponse.json({
      tokens,
      exchangeRates,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Error fetching prices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prices' },
      { status: 500 }
    )
  }
}
