import connectMongoDB from '@/libs/mongodb'
import User from '@/models/user'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()
    if (!name || !email) {
      return NextResponse.json(
        {
          error: 'Name and email are required',
        },
        {
          status: 400,
        }
      )
    }
    // 이메일 형식 검사
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    await connectMongoDB()
    const user = await User.create({ name, email })

    return NextResponse.json(
      {
        message: '사용자 등록 성공',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('사용자 등록 실패', error)
    return NextResponse.json({ error: '사용자 등록 실패' }, { status: 500 })
  }
}
