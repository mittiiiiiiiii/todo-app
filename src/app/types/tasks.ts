export type Tasks = {
	id: number;
	title: string;
	status: "not_started" | "in_progress" | "completed";
	dueDate?: string;
	description?: string;
	userId?: number;
};

import { z } from "zod";

export const schema = z.object({
	title: z.string().min(1, "タイトルは必須です"),
	description: z.string(),
	date: z.string(),
	status: z.enum(["not_started", "in_progress", "completed"]),
});

export type FormData = z.infer<typeof schema>;
