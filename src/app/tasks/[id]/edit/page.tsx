'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditTaskPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState<'not_started'|'in_progress'>('not_started');

    useEffect(() => {
        const checkLogin = async () => {
            // localStorageにuser情報がなければ未ログインとみなす
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

                // 値をセット
                const task = res.data.tasks[0];
                if (task) {
                    setTitle(task.title||'');
                    setDescription(task.description||'');
                    setDate(task.dueDate ? task.dueDate.slice(0,10):'');
                    setStatus(task.status||'not_started');
                }
            }catch(error){
                console.log('タスクの取得に失敗しました',error);
            }
        }

        // 即時実行
        (async () => {
            await checkLogin();
            await fetchTask(Number(id));
        })();
    },[router,id]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        console.log('タスクを編集するよー');
        e.preventDefault();
        // ここにdbにタスクを保存するapi
        console.log({
            title,
            description,
            date,
            status
        });
        try{
            const user = JSON.parse(localStorage.getItem('user')||'{}');
            const postData = {
                title,
                description,
                dueDate: date ? new Date(date) : null,
                status,
                userId: user.id,
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">タイトル（必須）</label>
                    <input id="title" type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder='タイトル' required/>
                </div>
                <div>
                    <label htmlFor="description">詳細</label>
                    <input id="description" type='text' value={description} onChange={e => setDescription(e.target.value)} placeholder='詳細' required/>
                </div>
                <div>
                    <label htmlFor="date">締め切り</label>
                    <input id="date" type='date' value={date} onChange={e => setDate(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="status">ステータス</label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as 'not_started'|'in_progress')} required>
                        <option value="not_started">未着手</option>
                        <option value="in_progress">進行中</option>
                    </select>
                </div>
                <button type="submit">保存</button>
                <button type="button" onClick={handleCancel}>キャンセル</button>
            </form>
        </>
    )
}