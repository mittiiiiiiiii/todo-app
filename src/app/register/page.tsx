"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/types/user";
import { schema } from "@/app/types/user";
import { trpc } from "@/utils/trpc";

export default function RegistePage() {
	const router = useRouter();
	const registerMutation = trpc.register.useMutation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: FormData) => {
		console.log("ボタンが押されたよー");
		try {
			 const response =await registerMutation.mutateAsync({
				name: data.name,
				email: data.email,
				password: data.password,
			});
			console.log("登録に成功しました", response);
			router.push("/login");
		} catch (error) {
			console.log("登録に失敗しました", error);
		}
	};

	return (
		<div className="login-container">
			<div className="login-box">
				<h1 className="login-title">ユーザー登録ページ</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<input type="text" {...register("name")} placeholder="名前" className="login-input"/>
					{errors.name && (
						<span className="login-error">{errors.name.message}</span>
					)}
					<input
						type="email"
						{...register("email")}
						placeholder="メールアドレス"
						className="login-input"
					/>
					{errors.email && (
						<span className="login-error">{errors.email.message}</span>
					)}
					<input type="password" {...register("password")} placeholder="パスワード" className="login-input"/>
					{errors.password && (
						<span className="login-error">{errors.password.message}</span>
					)}
					<button type="submit" className="login-button">登録</button>
				</form>
				<p className="login-bottom-text">
					ログインページは<a href="/login" className="login-link">こちら</a>
				</p>
			</div>
		</div>
	);
}
