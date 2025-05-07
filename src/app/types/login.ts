import { z } from "zod";

export const schema = z.object({
	email: z.string().email({ message: "メールアドレスが正しくありません" }),
	password: z.string().min(1, { message: "パスワードは必須です" }),
});

export type FormData = z.infer<typeof schema>;