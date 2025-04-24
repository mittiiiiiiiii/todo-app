import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request: Request) {
    console.log('POSTリクエストを受け取りました');
    const { email, password } = await request.json()
    try {
        
    }catch (error) {
        console.log('ログインエラー:', error);
        return NextResponse.json({
            message:  "ログインに失敗しました",
            error: error
        }, { status: 400 })
    }
}