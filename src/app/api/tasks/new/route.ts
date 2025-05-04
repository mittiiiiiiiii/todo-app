import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
	console.log("POSTリクエストを受け取りました");
	const { postData } = await request.json();
	const { title, description, dueDate, status, userId } = postData;
	try {
		const task = await prisma.tasks.create({
			data: {
				title,
				description,
				dueDate: dueDate ? new Date(dueDate) : undefined,
				status,
				userId,
			},
		});
		return NextResponse.json({ task }, { status: 200 });
	} catch (error) {
		console.log("登録エラー:", error);
		return NextResponse.json(
			{
				message: "登録に失敗しました",
				error: error,
			},
			{ status: 400 },
		);
	}
}
