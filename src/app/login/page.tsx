"use client";

import { useRouter } from "next/navigation";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/types/login";
import { schema } from "@/app/types/login";
import { trpc } from "@/utils/trpc";

export default function LoginPage() {
	const router = useRouter();
	const loginMutation = trpc.login.useMutation();
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
			const response = await loginMutation.mutateAsync({
				email: data.email,
				password: data.password,
			});
			console.log("ログインに成功しました", response);
			localStorage.setItem("user", JSON.stringify(response));
			router.push("/tasks");
		} catch (error) {
			console.log("ログインに失敗しました", error);
		}
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h1 className="login-title">ログインページ</h1>
				<form
					onSubmit={handleSubmit(onSubmit)}
					noValidate
				>
					<input
						type="email"
						{...register("email")}
						placeholder="メールアドレス"
						className="login-input"
					/>
					{errors.email && (
						<span className="login-error">
							{errors.email.message}
						</span>
					)}
					<input
						type="password"
						{...register("password")}
						placeholder="パスワード"
						className="login-input"
					/>
					{errors.password && (
						<span className="login-error">
							{errors.password.message}
						</span>
					)}
					<button
						type="submit"
						className="login-button"
					>
						ログイン
					</button>
				</form>
				<p className="login-bottom-text">
					アカウントをお持ちでない方は
					<a
						href="/register"
						className="login-link"
					>
						こちら
					</a>
				</p>
			</div>
		</div>
	);
}
