import OpenAI from 'openai'

// 初始化 OpenAI 客户端
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// 识别票据信息
export interface ReceiptInfo {
  amount: number | null;
  merchant: string | null;
  category: string | null;
  date: string | null;
  description: string | null;
  confidence: number;
}

// 将图片转换为 base64
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1]) // 移除 data:image/...;base64, 前缀
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 识别票据
export async function recognizeReceipt(imageFile: File): Promise<ReceiptInfo> {
  try {
    if (!openai) {
      throw new Error('OpenAI API key not configured')
    }
    
    const base64Image = await imageToBase64(imageFile)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `请识别这张票据/收据的信息，提取以下内容：
1. 金额（数字，不要包含货币符号）
2. 商家名称
3. 商品类别（从以下选项中选择：餐饮、交通、购物、娱乐、医疗、教育、住房、其他）
4. 日期（YYYY-MM-DD 格式）
5. 商品描述

请以 JSON 格式返回，如果某项信息无法识别则返回 null：
{
  "amount": 数字或null,
  "merchant": "商家名称或null",
  "category": "类别或null",
  "date": "YYYY-MM-DD或null",
  "description": "描述或null",
  "confidence": 0-1之间的置信度
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.1,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // 解析 JSON 响应
    const result = JSON.parse(content) as ReceiptInfo
    
    // 验证和清理数据
    return {
      amount: result.amount && typeof result.amount === 'number' ? result.amount : null,
      merchant: result.merchant && typeof result.merchant === 'string' ? result.merchant : null,
      category: result.category && typeof result.category === 'string' ? result.category : null,
      date: result.date && typeof result.date === 'string' ? result.date : null,
      description: result.description && typeof result.description === 'string' ? result.description : null,
      confidence: result.confidence && typeof result.confidence === 'number' ? result.confidence : 0,
    }
  } catch (error) {
    console.error('Error recognizing receipt:', error)
    return {
      amount: null,
      merchant: null,
      category: null,
      date: null,
      description: null,
      confidence: 0,
    }
  }
}

// 识别文字内容
export async function recognizeText(imageFile: File): Promise<string> {
  try {
    if (!openai) {
      throw new Error('OpenAI API key not configured')
    }
    
    const base64Image = await imageToBase64(imageFile)
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "请识别图片中的文字内容，直接返回识别的文字，不要添加任何其他内容。"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.1,
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error recognizing text:', error)
    return ''
  }
}

// 智能分类建议
export async function suggestCategory(description: string): Promise<string> {
  try {
    if (!openai) {
      throw new Error('OpenAI API key not configured')
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `根据以下描述，建议最合适的支出分类（从以下选项中选择：餐饮、交通、购物、娱乐、医疗、教育、住房、其他）：
          
描述：${description}

只返回分类名称，不要其他内容。`
        }
      ],
      max_tokens: 50,
      temperature: 0.1,
    })

    const category = response.choices[0]?.message?.content?.trim()
    const validCategories = ['餐饮', '交通', '购物', '娱乐', '医疗', '教育', '住房', '其他']
    
    return validCategories.includes(category || '') ? category! : '其他'
  } catch (error) {
    console.error('Error suggesting category:', error)
    return '其他'
  }
}
