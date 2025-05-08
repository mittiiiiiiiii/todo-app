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
		<div className="tasks-container">
			<div className="tasks-box">
				<h1 className="tasks-title">タスク追加ページ</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="tasks-form">
					<div>
						<label htmlFor="title" className="tasks-label">
							タイトル（必須）
						</label>
						<input
							id="title"
							type="text"
							{...register("title")}
							placeholder="タイトル"
							className="tasks-input"
						/>
						{errors.title && (
							<span className="form-error">{errors.title.message}</span>
						)}
					</div>
					<div>
						<label htmlFor="description" className="tasks-label">
							詳細
						</label>
						<input
							id="description"
							type="text"
							{...register("description")}
							placeholder="詳細"
							className="tasks-input"
						/>
						{errors.description && (
							<span className="form-error">{errors.description.message}</span>
						)}
					</div>
					<div>
						<label htmlFor="date" className="tasks-label">
							締め切り
						</label>
						<input
							id="date"
							type="date"
							{...register("date")}
							className="tasks-input"
						/>
						{errors.date && (
							<span className="form-error">{errors.date.message}</span>
						)}
					</div>
					<div>
						<label htmlFor="status" className="tasks-label">
							ステータス
						</label>
						<select
							id="status"
							{...register("status")}
							className="tasks-input"
						>
							<option value="not_started">未着手</option>
							<option value="in_progress">進行中</option>
							<option value="completed">完了</option>
						</select>
						{errors.status && (
							<span className="form-error">{errors.status.message}</span>
						)}
					</div>
					<div className="flex gap-2 mt-4">
						<button type="submit" className="tasks-add-btn">
							保存
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="tasks-add-btn tasks-cancel-btn"
						>
							キャンセル
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
