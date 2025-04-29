import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export async function GET(request: Request) {
    console.log('GETリクエストを受け取りました');
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
        return NextResponse.json({
            message: "タスクがありません",
        }, { status: 404 })
    }

    try{
        const tasks = await prisma.tasks.findMany({
            where: { id: Number(taskId) },
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

export async function POST(request: Request) {
    console.log('POSTリクエストを受け取りました');
    const { postData } = await request.json();
    const { title, description, dueDate, status, userId,taskId } = postData;
    try {
        const task = await prisma.tasks.update({
            where: { id:taskId },
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate):undefined,
                status,
                userId,
            }
        })
        return NextResponse.json({ task },{ status: 200 })
    }catch (error) {
        console.log('登録エラー:', error);
        return NextResponse.json({
            message:  "登録に失敗しました",
            error: error
        }, { status: 400 })
    }
}