import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request: Request) {
    console.log('POSTリクエストを受け取りました');
    const { title, description, date, status } = await request.json()
    try {
        const task = await prisma.tasks.create({})
                return NextResponse.json({ task },{ status: 200 })
    }catch (error) {
        console.log('登録エラー:', error);
        return NextResponse.json({
            message:  "登録に失敗しました",
            error: error
        }, { status: 400 })
    }
}