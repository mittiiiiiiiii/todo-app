"use client";

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormData } from "@/app/types/user";
import { schema } from "@/app/types/user";
import { trpc } from "@/utils/trpc";

export default function ProfilePage() {
	const router = useRouter();
	const updateProfileMutation = trpc.updateProfile.useMutation();
    const [userId, setUserId] = useState<number | null>(null);
    const getProfileQuery = trpc.getProfile.useQuery(
        { userId: userId ?? 0 },
        { enabled: !!userId }
    );
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
        if (getProfileQuery.data) {
            const user = getProfileQuery.data;
            setValue("name", user.name || "");
            setValue("email", user.email || "");
            setValue("password", user.password || "");
        }
    }, [getProfileQuery.data, setValue]);


	const onSubmit = async (data: FormData) => {
		console.log("ボタンが押されたよー");
		const user = JSON.parse(localStorage.getItem("user") || "{}");
		try {
			const response = await updateProfileMutation.mutateAsync({
				userId: user.id,
				name: data.name,
				email: data.email,
				password: data.password,
			});
			console.log("編集に成功しました", response);
			router.push("/tasks");
		} catch (error) {
			console.log("編集に失敗しました", error);
		}
	};

	return (
		<div className="form-container">
			<div className="form-box">
				<h1 className="page-title">プロフィール編集</h1>
				<form onSubmit={handleSubmit(onSubmit)}>
					<input type="text" {...register("name")} placeholder="名前" className="form-input" />
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
					<input type="password" {...register("password")} placeholder="パスワード" className="form-input" />
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
