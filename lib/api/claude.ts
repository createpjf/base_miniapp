// Claude API 集成
export interface ClaudeResponse {
  content: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface ClaudeError {
  error: string;
  message: string;
}

// Claude API 配置
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'

// 发送请求到 Claude API
async function callClaudeAPI(messages: any[], maxTokens: number = 1000): Promise<ClaudeResponse> {
  const apiKey = process.env.CLAUDE_API_KEY
  
  if (!apiKey) {
    throw new Error('Claude API key not configured')
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        messages: messages
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Claude API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    
    return {
      content: data.content[0]?.text || '',
      usage: data.usage
    }
  } catch (error) {
    console.error('Claude API error:', error)
    throw error
  }
}

// 智能记账建议
export async function getSmartAccountingAdvice(description: string, amount: number): Promise<{
  suggestedCategory: string;
  suggestedDescription: string;
  insights: string;
  budgetAdvice: string;
}> {
  const messages = [
    {
      role: "user",
      content: `作为专业的财务顾问，请分析以下记账信息并提供建议：

描述：${description}
金额：$${amount}

请提供：
1. 建议的分类（从以下选项选择：Food & Drink, Transportation, Shopping, Housing, Entertainment, Trade, Others）
2. 优化的描述（更简洁明了）
3. 财务洞察（这笔支出的特点和建议）
4. 预算建议（如何优化这类支出）

请以JSON格式返回：
{
  "suggestedCategory": "分类名称",
  "suggestedDescription": "优化后的描述",
  "insights": "财务洞察",
  "budgetAdvice": "预算建议"
}`
    }
  ]

  try {
    const response = await callClaudeAPI(messages, 800)
    const result = JSON.parse(response.content)
    
    return {
      suggestedCategory: result.suggestedCategory || 'Others',
      suggestedDescription: result.suggestedDescription || description,
      insights: result.insights || '暂无特殊洞察',
      budgetAdvice: result.budgetAdvice || '建议合理控制支出'
    }
  } catch (error) {
    console.error('Error getting smart accounting advice:', error)
    return {
      suggestedCategory: 'Others',
      suggestedDescription: description,
      insights: 'AI分析暂时不可用',
      budgetAdvice: '建议合理控制支出'
    }
  }
}

// 财务分析报告
export async function generateFinancialReport(records: any[]): Promise<{
  summary: string;
  trends: string;
  recommendations: string[];
  alerts: string[];
}> {
  const recordsSummary = records.map(record => ({
    type: record.type,
    amount: record.amount,
    category: record.category,
    date: record.date,
    description: record.description
  }))

  const messages = [
    {
      role: "user",
      content: `作为专业的财务分析师，请分析以下记账数据并生成财务报告：

数据：${JSON.stringify(recordsSummary, null, 2)}

请提供：
1. 财务摘要（总体收支情况）
2. 消费趋势分析
3. 具体建议（3-5条）
4. 风险提醒（如有异常支出）

请以JSON格式返回：
{
  "summary": "财务摘要",
  "trends": "趋势分析",
  "recommendations": ["建议1", "建议2", "建议3"],
  "alerts": ["提醒1", "提醒2"]
}`
    }
  ]

  try {
    const response = await callClaudeAPI(messages, 1200)
    const result = JSON.parse(response.content)
    
    return {
      summary: result.summary || '暂无数据可分析',
      trends: result.trends || '暂无趋势数据',
      recommendations: result.recommendations || ['建议合理规划支出'],
      alerts: result.alerts || []
    }
  } catch (error) {
    console.error('Error generating financial report:', error)
    return {
      summary: '财务分析暂时不可用',
      trends: '趋势分析暂时不可用',
      recommendations: ['建议定期检查财务状况'],
      alerts: []
    }
  }
}

// 智能预算规划
export async function createSmartBudget(income: number, goals: string[]): Promise<{
  budgetAllocation: {[key: string]: number};
  monthlyPlan: string;
  savingsStrategy: string;
  investmentAdvice: string;
}> {
  const messages = [
    {
      role: "user",
      content: `作为专业的理财规划师，请根据以下信息制定智能预算：

月收入：$${income}
财务目标：${goals.join(', ')}

请提供：
1. 预算分配建议（各分类的预算金额）
2. 月度理财计划
3. 储蓄策略
4. 投资建议

请以JSON格式返回：
{
  "budgetAllocation": {
    "Food & Drink": 金额,
    "Transportation": 金额,
    "Shopping": 金额,
    "Housing": 金额,
    "Entertainment": 金额,
    "Savings": 金额,
    "Investment": 金额
  },
  "monthlyPlan": "月度计划描述",
  "savingsStrategy": "储蓄策略",
  "investmentAdvice": "投资建议"
}`
    }
  ]

  try {
    const response = await callClaudeAPI(messages, 1000)
    const result = JSON.parse(response.content)
    
    return {
      budgetAllocation: result.budgetAllocation || {},
      monthlyPlan: result.monthlyPlan || '建议制定详细的月度预算',
      savingsStrategy: result.savingsStrategy || '建议每月至少储蓄20%的收入',
      investmentAdvice: result.investmentAdvice || '建议咨询专业投资顾问'
    }
  } catch (error) {
    console.error('Error creating smart budget:', error)
    return {
      budgetAllocation: {},
      monthlyPlan: '预算规划暂时不可用',
      savingsStrategy: '建议咨询专业理财师',
      investmentAdvice: '建议咨询专业投资顾问'
    }
  }
}

// 智能问答
export async function askClaude(question: string, context?: any): Promise<string> {
  const messages = [
    {
      role: "user",
      content: `作为专业的财务顾问，请回答以下问题：

问题：${question}
${context ? `相关上下文：${JSON.stringify(context, null, 2)}` : ''}

请提供专业、实用的建议。`
    }
  ]

  try {
    const response = await callClaudeAPI(messages, 800)
    return response.content
  } catch (error) {
    console.error('Error asking Claude:', error)
    return '抱歉，AI助手暂时不可用，请稍后再试。'
  }
}

// 代币投资建议
export async function getTokenInvestmentAdvice(tokens: string[]): Promise<{
  analysis: string;
  recommendations: string[];
  risks: string[];
  marketOutlook: string;
}> {
  const messages = [
    {
      role: "user",
      content: `作为专业的加密货币投资顾问，请分析以下代币并提供投资建议：

代币列表：${tokens.join(', ')}

请提供：
1. 市场分析
2. 投资建议（3-5条）
3. 风险提示
4. 市场展望

请以JSON格式返回：
{
  "analysis": "市场分析",
  "recommendations": ["建议1", "建议2", "建议3"],
  "risks": ["风险1", "风险2"],
  "marketOutlook": "市场展望"
}`
    }
  ]

  try {
    const response = await callClaudeAPI(messages, 1000)
    const result = JSON.parse(response.content)
    
    return {
      analysis: result.analysis || '市场分析暂时不可用',
      recommendations: result.recommendations || ['建议谨慎投资'],
      risks: result.risks || ['投资有风险，请谨慎决策'],
      marketOutlook: result.marketOutlook || '市场波动较大，请理性投资'
    }
  } catch (error) {
    console.error('Error getting token investment advice:', error)
    return {
      analysis: '投资分析暂时不可用',
      recommendations: ['建议咨询专业投资顾问'],
      risks: ['投资有风险，请谨慎决策'],
      marketOutlook: '市场情况复杂，请理性投资'
    }
  }
}
