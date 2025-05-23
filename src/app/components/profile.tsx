"use client";

import { useRouter } from "next/navigation";

export default function ProfileButton() {
	const router = useRouter();

	const handleProfile = () => {
		console.log("プロフィールの編集ボタンが押されたよー");
		router.push("/profile");
	};

	return (
		<button type="button" onClick={handleProfile} className="profile-edit-btn">
			プロフィールの編集
		</button>
	);
}
