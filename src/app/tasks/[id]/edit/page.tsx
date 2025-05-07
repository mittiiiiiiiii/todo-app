"use client";

import { useEffect,useState } from "react";
import { useRouter, useParams } from "next/navigation";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/types/tasks";
import { schema } from "@/app/types/tasks";
import { trpc } from "@/utils/trpc";
import type { Status } from "@prisma/client";

export default function EditTaskPage() {
	const router = useRouter();
	const params = useParams();
	const id = params.id as string;
	const editTaskMutation = trpc.editTask.useMutation();
	// useQueryをenabled: falseで初期化
    const [userId, setUserId] = useState<number | null>(null);
	const getTasksQuery = trpc.getTasks.useQuery(
        { userId: userId ?? 0 },
        { enabled: false }
    );

	const {
		register,
		handleSubmit,
		setValue,
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
        const user = localStorage.getItem("user");
        if (!user) {
            console.log("ログインしていないのでログインページにリダイレクト");
            router.push("/login");
            return;
        }
        const parsed = JSON.parse(user);
        setUserId(parsed.id);
    }, [router]);

    useEffect(() => {
        const fetchTask = async (taskId: number) => {
            if (!userId) return;
            try {
                const { data: tasks } = await getTasksQuery.refetch();
                console.log("タスクの取得に成功", tasks);

                const task = tasks?.find((t) => t.id === taskId);
                if (task) {
                    setValue("title", task.title || "");
                    setValue("description", task.description || "");
                    setValue("date", task.dueDate ? task.dueDate.slice(0, 10) : "");
                    setValue("status", task.status || "not_started");
                }
            } catch (error) {
                console.log("タスクの取得に失敗しました", error);
            }
        };

        if (userId) {
            fetchTask(Number(id));
        }
    }, [userId, id, setValue,getTasksQuery]);

	const onSubmit = async (data: FormData) => {
		console.log("タスクを編集するよー");
		try {
			const user = JSON.parse(localStorage.getItem("user") || "{}");

			const response = await editTaskMutation.mutateAsync({
                title: data.title,
                description: data.description,
                dueDate: data.date,
                status: data.status as Status,
                userId: user.id,
                taskId: Number(id),
            });
			console.log("タスクを編集して保存しました", response);
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
			<h1>タスク編集ページ</h1>
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
