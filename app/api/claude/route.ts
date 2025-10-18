import { NextRequest, NextResponse } from 'next/server'
import { 
  getSmartAccountingAdvice, 
  generateFinancialReport, 
  createSmartBudget, 
  askClaude, 
  getTokenInvestmentAdvice 
} from '@/lib/api/claude'

// 智能记账建议
export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'accounting-advice':
        const { description, amount } = data
        const advice = await getSmartAccountingAdvice(description, amount)
        return NextResponse.json({ success: true, data: advice })

      case 'financial-report':
        const { records } = data
        const report = await generateFinancialReport(records)
        return NextResponse.json({ success: true, data: report })

      case 'smart-budget':
        const { income, goals } = data
        const budget = await createSmartBudget(income, goals)
        return NextResponse.json({ success: true, data: budget })

      case 'ask':
        const { question, context } = data
        const answer = await askClaude(question, context)
        return NextResponse.json({ success: true, data: { answer } })

      case 'token-advice':
        const { tokens } = data
        const tokenAdvice = await getTokenInvestmentAdvice(tokens)
        return NextResponse.json({ success: true, data: tokenAdvice })

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
