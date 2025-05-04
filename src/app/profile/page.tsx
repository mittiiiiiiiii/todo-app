"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/types/user";
import { schema } from "@/app/types/user";

export default function ProfilePage() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkLogin = async () => {
			const user = localStorage.getItem("user");
			if (!user) {
				console.log("ログインしていないのでログインページにリダイレクト");
				router.push("/login");
				return null;
			}
			return JSON.parse(user);
		};

		const fetchUser = async (userId: number) => {
			try {
				const res = await axios.get("/api/profile", { params: { userId } });
				console.log("ユーザーの取得に成功", res.data);

				const user = res.data.user[0];
				if (user) {
					setValue("name", user.name || "");
					setValue("email", user.email || "");
					setValue("password", user.password || "");
				}
			} catch (error) {
				console.log("ユーザー情報の取得に失敗しました", error);
			}
		};

		(async () => {
			const user = await checkLogin();
			if (user) {
				await fetchUser(user.id);
			}
		})();
	}, [router, setValue]);

	const onSubmit = async (data: FormData) => {
		console.log("ボタンが押されたよー");
		const user = JSON.parse(localStorage.getItem("user") || "{}");
		try {
			const response = await axios.post("/api/profile", {
				userId: user.id,
				name: data.name,
				email: data.email,
				password: data.password,
			});
			console.log("編集に成功しました", response.data);
			router.push("/tasks");
		} catch (error) {
			console.log("編集に失敗しました", error);
		}
	};

	return (
		<>
			<h1>プロフィール編集</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input type="text" {...register("name")} placeholder="名前" />
				{errors.name && (
					<span style={{ color: "red" }}>{errors.name.message}</span>
				)}
				<input
					type="text"
					{...register("email")}
					placeholder="メールアドレス"
				/>
				{errors.email && (
					<span style={{ color: "red" }}>{errors.email.message}</span>
				)}
				<input type="text" {...register("password")} placeholder="パスワード" />
				{errors.password && (
					<span style={{ color: "red" }}>{errors.password.message}</span>
				)}
				<button type="submit">登録</button>
			</form>
			<p>
				ログインページは<a href="/login">こちら</a>
			</p>
		</>
	);
}
