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
		<div className="form-container">
			<div className="form-box">
				<h1 className="page-title">ユーザー登録ページ</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<input type="text" {...register("name")} placeholder="名前" className="form-input"/>
					{errors.name && (
						<span className="form-error">{errors.name.message}</span>
					)}
					<input
						type="email"
						{...register("email")}
						placeholder="メールアドレス"
						className="form-input"
					/>
					{errors.email && (
						<span className="form-error">{errors.email.message}</span>
					)}
					<input type="password" {...register("password")} placeholder="パスワード" className="form-input"/>
					{errors.password && (
						<span className="form-error">{errors.password.message}</span>
					)}
					<button type="submit" className="form-button">登録</button>
				</form>
				<p className="form-bottom-text">
					ログインページは<a href="/login" className="navigation-link">こちら</a>
				</p>
			</div>
		</div>
	);
}
