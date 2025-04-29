import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(request: Request) {
    console.log('GETリクエストを受け取りました');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({
            message: "ユーザーがいません",
        }, { status: 401 })
    }

    try{
        const tasks = await prisma.tasks.findMany({
            where: { userId: Number(userId) },
            // デフォルトで締切日でソート
            orderBy: { dueDate: 'asc' }
        });
        return NextResponse.json({ tasks }, { status: 200 });
    }catch (error) {
        console.log('取得エラー:', error);
        return NextResponse.json({
            message:  "取得に失敗しました",
            error: error
        }, { status: 400 })
    }
}