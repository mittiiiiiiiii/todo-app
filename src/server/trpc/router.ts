import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient,Status } from '@prisma/client';

const prisma = new PrismaClient();
const t = initTRPC.create();

export const appRouter = t.router({
  // タスク一覧取得
  getTasks: t.procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.tasks.findMany({
        where: { userId: input.userId },
        orderBy: { dueDate: 'asc' },
      });
    }),

  // タスク新規作成
  createTask: t.procedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      status: z.nativeEnum(Status),
      userId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.tasks.create({
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          status: input.status,
          userId: input.userId,
        },
      });
    }),

  // タスク編集
  editTask: t.procedure
    .input(z.object({
      taskId: z.number(),
      title: z.string(),
      description: z.string().optional(),
      dueDate: z.string().optional(),
      status: z.nativeEnum(Status),
      userId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.tasks.update({
        where: { id: input.taskId },
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          status: input.status,
          userId: input.userId,
        },
      });
    }),

  // タスク削除
  deleteTask: t.procedure
    .input(z.object({ taskId: z.number(), userId: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.tasks.deleteMany({
        where: { id: input.taskId, userId: input.userId },
      });
    }),

  // ユーザープロフィール取得
  getProfile: t.procedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: { id: input.userId },
      });
    }),

  // ユーザープロフィール更新
  updateProfile: t.procedure
    .input(z.object({
      userId: z.number(),
      name: z.string(),
      email: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.user.update({
        where: { id: input.userId },
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
    }),

  // ログイン
  login: t.procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) throw new Error('ユーザーが見つかりません');
      if (user.password !== input.password) throw new Error('パスワードが間違っています');
      return user;
    }),

  // 新規登録
  register: t.procedure
    .input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: input.password,
        },
      });
    }),
});

export type AppRouter = typeof appRouter;