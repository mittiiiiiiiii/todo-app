"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/types/login";
import { schema } from "@/app/types/login";

export default function LoginPage() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		console.log("ボタンが押されたよー");
		try {
			const response = await axios.post("/api/login", {
				email: data.email,
				password: data.password,
			});
			console.log("ログインに成功しました", response.data);
			localStorage.setItem("user", JSON.stringify(response.data.user));
			router.push("/tasks");
		} catch (error) {
			console.log("ログインに失敗しました", error);
		}
	};

	return (
		<>
			<h1>ログインページ</h1>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<input
					type="email"
					{...register("email")}
					placeholder="メールアドレス"
				/>
				{errors.email && (
					<span style={{ color: "red" }}>{errors.email.message}</span>
				)}
				<input type="password" {...register("password")} placeholder="パスワード" />
				{errors.password && (
					<span style={{ color: "red" }}>{errors.password.message}</span>
				)}
				<button type="submit">ログイン</button>
			</form>
			<p>
				アカウントをお持ちでない方は<a href="/register">こちら</a>
			</p>
		</>
	);
}
