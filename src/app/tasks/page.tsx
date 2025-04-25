'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'
import type { Tasks } from '../types/tasks';

export default function TasksPage() {
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = () => {
            // localStorageにuser情報がなければ未ログインとみなす
            const user = localStorage.getItem('user');
            if (!user) {
                router.push('/login');
            }
        };
        const fetchTasks = async () => {
            try{
                const res = await axios.get('/api/tasks');
                setTasks(res.data.tasks);
            }catch(error){
                console.log('タスクの取得に失敗しました',error);
            }
        }

        checkLogin();
        fetchTasks();
    },[router]);

    const handleAddTask = () => {
        console.log('タスクを追加するボタンが押されたよー');
        // ここに追加ページに移動する処理を書く
    }

    return(
        <>
            <h1>タスク一覧ページ</h1>
            <ul>
            {tasks.map(task => (
                    <li key={task.id}>
                        <span>{task.title}（{task.status}）{task.dueDate && ` 締切: ${task.dueDate}`}</span>
                        <button type="button">編集</button>
                        <button type="button">削除</button>
                    </li>
                ))}
            </ul>
            <button type="button" onSubmit={handleAddTask}>タスクを追加</button>
        </>
    );
}