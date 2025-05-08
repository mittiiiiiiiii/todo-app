"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import type { Tasks } from "../types/tasks";
import { trpc } from "@/utils/trpc";

export default function TasksPage() {
	const [tasks, setTasks] = useState<Tasks[]>([]);
	const router = useRouter();
	const deleteTaskMutation = trpc.deleteTask.useMutation();

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
		const fetchTasks = async (userId: number) => {
			try {
				const res = await axios.get("/api/tasks", { params: { userId } });
				setTasks(res.data.tasks);
			} catch (error) {
				console.log("タスクの取得に失敗しました", error);
			}
		};

		// 即時実行
		(async () => {
			const user = await checkLogin();
			if (user) {
				console.log("ユーザー情報", user);
				await fetchTasks(user.id);
			}
		})();
	}, [router]);

	const handleAddTask = () => {
		console.log("タスクを追加するボタンが押されたよー");
		router.push("/tasks/new");
	};

	const handledeleteTask = async (taskId: number) => {
		console.log("タスクを削除するボタンが押されたよー");
		try {
			// ここにdbからタスクを削除するapi
			const userStr = localStorage.getItem("user");
			if (!userStr) {
				console.log("ユーザー情報が取得できません");
				return;
			}
			const user = JSON.parse(userStr);
			const response = await deleteTaskMutation.mutateAsync({
				userId: user.id,
				taskId: taskId,
			});
			console.log("タスクを削除しました", response);
			setTasks(tasks.filter((task) => task.id !== taskId));
		} catch (error) {
			console.log("タスクの削除に失敗しました", error);
		}
	};

	const handleeditTask = async (taskId: number) => {
		console.log("タスクを編集するボタンが押されたよー");
		try {
			router.push(`/tasks/${taskId}/edit`);
		} catch (error) {
			console.log("タスクの編集に失敗しました", error);
		}
	};

	return (
		<div className="tasks-container">
            <div className="tasks-box">
                <h1 className="tasks-title">タスク一覧ページ</h1>
                <ul className="tasks-list">
                    {tasks.map((task) => (
                        <li key={task.id} className="tasks-list-item">
                            <span className="tasks-list-text">
                                {task.title}（{task.status}）
                                {task.description && ` 詳細: ${task.description}`}{" "}
                                {task.dueDate && ` 締切: ${task.dueDate}`}
                            </span>
                            <div className="tasks-list-actions">
                                <button
                                    type="button"
                                    onClick={() => handleeditTask(task.id)}
                                    className="tasks-edit-btn"
                                >
                                    編集
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handledeleteTask(task.id)}
                                    className="tasks-delete-btn"
                                >
                                    削除
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button
                    type="button"
                    onClick={handleAddTask}
                    className="tasks-add-btn"
                >
                    タスクを追加
                </button>
            </div>
        </div>
	);
}
