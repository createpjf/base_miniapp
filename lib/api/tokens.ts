import { Token, ExchangeRate } from '../types'

// Base 生态主流代币 ID 列表
const BASE_TOKENS = [
  'ethereum', // ETH
  'usd-coin', // USDC
  'bitcoin', // BTC (for cbBTC)
  'degen', // DEGEN
  'brett', // BRETT
  'aerodrome-finance', // AERO
  'coinbase-wrapped-staked-eth', // cbETH
]

// 缓存时间（5分钟）
const CACHE_DURATION = 5 * 60 * 1000

// 价格缓存
let priceCache: { data: Token[]; timestamp: number } | null = null

// 汇率缓存
let exchangeCache: { data: ExchangeRate[]; timestamp: number } | null = null

// 获取代币价格
export async function getTokenPrices(): Promise<Token[]> {
  // 检查缓存
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
    return priceCache.data
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${BASE_TOKENS.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch token prices')
    }

    const data = await response.json()
    
    // 更新缓存
    priceCache = {
      data,
      timestamp: Date.now(),
    }

    return data
  } catch (error) {
    console.error('Error fetching token prices:', error)
    
    // 返回缓存数据或空数组
    return priceCache?.data || []
  }
}

// 获取特定代币价格
export async function getTokenPrice(tokenId: string): Promise<Token | null> {
  const tokens = await getTokenPrices()
  return tokens.find(token => token.id === tokenId) || null
}

// 获取汇率
export async function getExchangeRates(): Promise<ExchangeRate[]> {
  // 检查缓存
  if (exchangeCache && Date.now() - exchangeCache.timestamp < CACHE_DURATION) {
    return exchangeCache.data
  }

  try {
    const tokens = await getTokenPrices()
    const usdcToken = tokens.find(token => token.id === 'usd-coin')
    
    if (!usdcToken) {
      throw new Error('USDC token not found')
    }

    const exchangeRates: ExchangeRate[] = tokens.map(token => ({
      from: token.symbol.toUpperCase(),
      to: 'USDC',
      rate: token.current_price / usdcToken.current_price,
      timestamp: Date.now(),
    }))

    // 更新缓存
    exchangeCache = {
      data: exchangeRates,
      timestamp: Date.now(),
    }

    return exchangeRates
  } catch (error) {
    console.error('Error calculating exchange rates:', error)
    return exchangeCache?.data || []
  }
}

// 转换金额到 USDC
export function convertToUSDC(amount: number, fromCurrency: string, exchangeRates: ExchangeRate[]): number {
  if (fromCurrency === 'USDC') return amount
  
  const rate = exchangeRates.find(rate => rate.from === fromCurrency.toUpperCase())
  return rate ? amount * rate.rate : amount
}

// 从 USDC 转换到其他币种
export function convertFromUSDC(amount: number, toCurrency: string, exchangeRates: ExchangeRate[]): number {
  if (toCurrency === 'USDC') return amount
  
  const rate = exchangeRates.find(rate => rate.from === toCurrency.toUpperCase())
  return rate ? amount / rate.rate : amount
}

// 获取代币图标
export function getTokenIcon(symbol: string): string {
  const iconMap: Record<string, string> = {
    'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    'USDC': 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    'DEGEN': 'https://assets.coingecko.com/coins/images/36389/large/degen.png',
    'BRETT': 'https://assets.coingecko.com/coins/images/36390/large/brett.png',
    'AERO': 'https://assets.coingecko.com/coins/images/36391/large/aero.png',
    'cbETH': 'https://assets.coingecko.com/coins/images/36392/large/cbeth.png',
  }
  
  return iconMap[symbol.toUpperCase()] || 'https://via.placeholder.com/32x32?text=?'
}
