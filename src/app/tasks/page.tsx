'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import type { Tasks } from '../types/tasks';

export default function TasksPage() {
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const router = useRouter();

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
        const fetchTasks = async (userId: number) => {
            try{
                const res = await axios.get('/api/tasks', {params: { userId } });
                setTasks(res.data.tasks);
            }catch(error){
                console.log('タスクの取得に失敗しました',error);
            }
        }

        // 即時実行
        (async () => {
            const user = await checkLogin();
            if (user) {
                console.log('ユーザー情報', user);
                await fetchTasks(user.id);
            }
        })();
    },[router]);

    const handleAddTask = () => {
        console.log('タスクを追加するボタンが押されたよー');
        router.push('/tasks/new');
    }

    const handledeleteTask = async (taskId: number) => {
        console.log('タスクを削除するボタンが押されたよー');
        try{
            // ここにdbからタスクを削除するapi
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                console.log('ユーザー情報が取得できません');
                return;
            }
            const user = JSON.parse(userStr);
            const response = await axios.post('/api/tasks/delete',{
                userId: user.id,
                taskId: taskId
            });
            console.log('タスクを削除しました', response.data);
            setTasks(tasks.filter(task => task.id !== taskId));
        }catch(error){
            console.log('タスクの削除に失敗しました',error);
        }
    }

    const handleeditTask = async (taskId: number) => {
        console.log('タスクを編集するボタンが押されたよー');
        try{
            router.push(`/tasks/${taskId}/edit`);
        }catch(error){
            console.log('タスクの編集に失敗しました',error);
        }
    }

    return(
        <>
            <h1>タスク一覧ページ</h1>
            <ul>
            {tasks.map(task => (
                    <li key={task.id}>
                        <span>{task.title}（{task.status}）{task.description && ` 詳細: ${task.description}`} {task.dueDate && ` 締切: ${task.dueDate}`}</span>
                        <button type="button" onClick={() => handleeditTask(task.id)}>編集</button>
                        <button type="button" onClick={() => handledeleteTask(task.id)}>削除</button>
                    </li>
                ))}
            </ul>
            <button type="button" onClick={handleAddTask}>タスクを追加</button>
        </>
    );
}