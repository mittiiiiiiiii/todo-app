"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TasksnewPage(){
    const router = useRouter();
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

        // 即時実行
        (async () => {
            await checkLogin();
        })();
    },[router]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        console.log('タスクを作成するよー');
        e.preventDefault();
        // ここにdbにタスクを保存するapi
        console.log({
            title,
            description,
            date,
            status
        });
    }

    const handleCancel = () => {
        console.log('キャンセルボタンが押されたよー');
        router.push('/tasks');
    }

    return (
        <>
            <h1>タスク追加ページ</h1>
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
    );
}