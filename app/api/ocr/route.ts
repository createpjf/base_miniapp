import { NextRequest, NextResponse } from 'next/server'
import { recognizeReceipt, recognizeText } from '@/lib/api/ai'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const type = formData.get('type') as string

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    let result

    if (type === 'receipt') {
      result = await recognizeReceipt(image)
    } else {
      const text = await recognizeText(image)
      result = { text }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}
