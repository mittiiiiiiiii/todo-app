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

    return (
        <>
            <h1>タスク編集ページ</h1>
        </>
    )
}