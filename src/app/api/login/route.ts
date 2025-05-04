import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
	console.log("POSTリクエストを受け取りました");
	const { email, password } = await request.json();
	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});
		if (!user) {
			return NextResponse.json(
				{
					message: "ユーザーが見つかりません",
				},
				{ status: 404 },
			);
		}
		if (user.password !== password) {
			return NextResponse.json(
				{
					message: "パスワードが間違っています",
				},
				{ status: 401 },
			);
		}
		return NextResponse.json({ user }, { status: 200 });
	} catch (error) {
		console.log("ログインエラー:", error);
		return NextResponse.json(
			{
				message: "ログインに失敗しました",
				error: error,
			},
			{ status: 400 },
		);
	}
}
