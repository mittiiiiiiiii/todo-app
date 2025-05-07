"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/types/tasks";
import { schema } from "@/app/types/tasks";
import { trpc } from "@/utils/trpc";
import type { Status } from "@prisma/client";

export default function TasksnewPage() {
	const router = useRouter();
	const createTaskMutation = trpc.createTask.useMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			description: "",
			date: "",
			status: "not_started",
		},
	});

	useEffect(() => {
		const checkLogin = async () => {
			// localStorageにuser情報がなければ未ログインとみなす
			const user = localStorage.getItem("user");
			if (!user) {
				console.log("ログインしていないのでログインページにリダイレクト");
				router.push("/login");
				return null;
			}
			return JSON.parse(user);
		};

		// 即時実行
		(async () => {
			await checkLogin();
		})();
	}, [router]);

	const onSubmit = async (data: FormData) => {
		console.log("タスクを作成するよー");
		try {
			const user = JSON.parse(localStorage.getItem("user") || "{}");

			const response = await createTaskMutation.mutateAsync({
				title: data.title,
				description: data.description,
				dueDate: data.date,
				status: data.status as Status,
				userId: user.id,
			});
			console.log("タスクを保存しました", response);
			router.push("/tasks");
		} catch (error) {
			console.log("タスクの保存に失敗しました", error);
		}
	};

	const handleCancel = () => {
		console.log("キャンセルボタンが押されたよー");
		router.push("/tasks");
	};

	return (
		<>
			<h1>タスク追加ページ</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div>
					<label htmlFor="title">タイトル（必須）</label>
					<input
						id="title"
						type="text"
						{...register("title")}
						placeholder="タイトル"
					/>
					{errors.title && (
						<span style={{ color: "red" }}>{errors.title.message}</span>
					)}
				</div>
				<div>
					<label htmlFor="description">詳細</label>
					<input
						id="description"
						type="text"
						{...register("description")}
						placeholder="詳細"
					/>
					{errors.description && (
						<span style={{ color: "red" }}>{errors.description.message}</span>
					)}
				</div>
				<div>
					<label htmlFor="date">締め切り</label>
					<input id="date" type="date" {...register("date")} />
					{errors.date && (
						<span style={{ color: "red" }}>{errors.date.message}</span>
					)}
				</div>
				<div>
					<label htmlFor="status">ステータス</label>
					<select id="status" {...register("status")}>
						<option value="not_started">未着手</option>
						<option value="in_progress">進行中</option>
						<option value="completed">完了</option>
					</select>
					{errors.status && (
						<span style={{ color: "red" }}>{errors.status.message}</span>
					)}
				</div>
				<button type="submit">保存</button>
				<button type="button" onClick={handleCancel}>
					キャンセル
				</button>
			</form>
		</>
	);
}
