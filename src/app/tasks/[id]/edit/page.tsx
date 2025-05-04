'use client'

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    title: z.string().min(1, 'タイトルは必須です'),
    description: z.string().min(1, '詳細は必須です'),
    date: z.string().min(1, '締め切りは必須です'),
    status: z.enum(['not_started', 'in_progress']),
});

type FormData = z.infer<typeof schema>;

export default function EditTaskPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            description: '',
            date: '',
            status: 'not_started',
        }
    });

    useEffect(() => {
        const checkLogin = async () => {
            const user = localStorage.getItem('user');
            if (!user) {
                console.log('ログインしていないのでログインページにリダイレクト');
                router.push('/login');
                return null;
            }
            return JSON.parse(user);
        };
        const fetchTask = async (taskId: number) => {
            try{
                const res = await axios.get('/api/tasks/edit', {params: { taskId } });
                console.log("タスクの取得に成功", res.data);

                const task = res.data.tasks[0];
                if (task) {
                    setValue('title', task.title || '');
                    setValue('description', task.description || '');
                    setValue('date', task.dueDate ? task.dueDate.slice(0,10) : '');
                    setValue('status', task.status || 'not_started');
                }
            }catch(error){
                console.log('タスクの取得に失敗しました',error);
            }
        }

        (async () => {
            await checkLogin();
            await fetchTask(Number(id));
        })();
    },[router,id,setValue]);

    const onSubmit = async(data: FormData) => {
        console.log('タスクを編集するよー');
        try{
            const user = JSON.parse(localStorage.getItem('user')||'{}');
            const postData = {
                title: data.title,
                description: data.description,
                dueDate: data.date ? new Date(data.date) : null,
                status: data.status,
                userId: user.id,
                taskId: Number(id),
            }

            const response= await axios.post('/api/tasks/edit', {postData});
            console.log('タスクを編集して保存しました',response.data);
            router.push('/tasks');
        }catch(error){
            console.log('タスクの保存に失敗しました',error);
        }
    }

    const handleCancel = () => {
        console.log('キャンセルボタンが押されたよー');
        router.push('/tasks');
    }

    return (
        <>
            <h1>タスク編集ページ</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title">タイトル（必須）</label>
                    <input id="title" type='text' {...register('title')} placeholder='タイトル' />
                    {errors.title && <span style={{color:'red'}}>{errors.title.message}</span>}
                </div>
                <div>
                    <label htmlFor="description">詳細</label>
                    <input id="description" type='text' {...register('description')} placeholder='詳細' />
                    {errors.description && <span style={{color:'red'}}>{errors.description.message}</span>}
                </div>
                <div>
                    <label htmlFor="date">締め切り</label>
                    <input id="date" type='date' {...register('date')} />
                    {errors.date && <span style={{color:'red'}}>{errors.date.message}</span>}
                </div>
                <div>
                    <label htmlFor="status">ステータス</label>
                    <select id="status" {...register('status')}>
                        <option value="not_started">未着手</option>
                        <option value="in_progress">進行中</option>
                    </select>
                    {errors.status && <span style={{color:'red'}}>{errors.status.message}</span>}
                </div>
                <button type="submit">保存</button>
                <button type="button" onClick={handleCancel}>キャンセル</button>
            </form>
        </>
    )
}