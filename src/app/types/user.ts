import { z } from "zod";

export const schema = z.object({
	email: z.string().min(1, "メールアドレスは必須です"),
	password: z.string().min(1, "パスワードは必須です"),
	name: z.string().min(1, "名前は必須です"),
});

export type FormData = z.infer<typeof schema>;
