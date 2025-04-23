import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    console.log('POSTリクエストを受け取りました');
    const { name, email, password } = await request.json()
    try {
        const user = await prisma.user.create({
            data: { name, email, password }
        })
        return NextResponse.json({ user },{ status: 200 })
    } catch (error) {
        console.log('登録エラー:', error);
        return NextResponse.json({
            message:  "登録に失敗しました",
            error: error
        }, { status: 400 })
    }
}