import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function POST(request: Request) {
    console.log('POSTリクエストを受け取りました');
    const { taskId,userId } = await request.json();

    try {
        const deletedTask= await prisma.tasks.deleteMany({
            where: {
                id: taskId,
                userId: userId,
            }
        })
        return NextResponse.json({ deletedTask },{ status: 200 })
    }catch (error) {
        console.log('削除エラー:', error);
        return NextResponse.json({
            message:  "削除に失敗しました",
            error: error
        }, { status: 400 })
    }
}