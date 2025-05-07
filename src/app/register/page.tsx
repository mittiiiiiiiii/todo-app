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
		<>
			<h1>ユーザー登録ページ</h1>
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
