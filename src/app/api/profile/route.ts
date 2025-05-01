import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(request: Request) {
    console.log('GETリクエストを受け取りました');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    try {
        const user = await prisma.user.findMany({
            where: {
                id:Number(userId)
            }
        })
        return NextResponse.json({ user },{ status: 200 })
    } catch (error) {
        console.log('取得エラー:', error);
        return NextResponse.json({
            message: "取得に失敗しました",
            error: error
        }, { status: 400 })
    }
}

export async function POST(request: Request) {
    console.log('POSTリクエストを受け取りました');
    const { userId, name, email, password } = await request.json();
    try {
        const user = await prisma.user.update({
            where: { id:Number(userId) },
            data: {
                name,
                email,
                password
            }
        })
        return NextResponse.json({ user },{ status: 200 })
    }catch (error) {
        console.log('登録エラー:', error);
        return NextResponse.json({
            message:  "登録に失敗しました",
            error: error
        }, { status: 400 })
    }
}