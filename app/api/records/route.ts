import { NextRequest, NextResponse } from 'next/server'
import { Record } from '@/lib/types'

// 模拟数据库存储
let records: Record[] = []

export async function GET() {
  try {
    return NextResponse.json({ records })
  } catch (error) {
    console.error('Error fetching records:', error)
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const record: Record = await request.json()
    
    // 添加ID和时间戳
    const newRecord: Record = {
      ...record,
      id: record.id || `record_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: record.createdAt || new Date().toISOString(),
    }
    
    records.push(newRecord)
    
    return NextResponse.json({ record: newRecord }, { status: 201 })
  } catch (error) {
    console.error('Error creating record:', error)
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const record: Record = await request.json()
    
    const index = records.findIndex(r => r.id === record.id)
    if (index === -1) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }
    
    records[index] = { ...record, updatedAt: new Date().toISOString() }
    
    return NextResponse.json({ record: records[index] })
  } catch (error) {
    console.error('Error updating record:', error)
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 })
    }
    
    const index = records.findIndex(r => r.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }
    
    records.splice(index, 1)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting record:', error)
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
  }
}
