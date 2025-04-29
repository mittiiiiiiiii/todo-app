"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TasksnewPage(){
    const router = useRouter();
    const [title, setTitle] = useState('');

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
        console.log('タスクを追加するボタンが押されたよー');
        e.preventDefault();
        // ここにdbにタスクを保存するapi
    }

    return (
        <>
            <h1>タスク追加ページ</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">タイトル（必須）</label>
                    <input id="title" type='text' value={title} onChange={e => setTitle(e.target.value)} required/>
                </div>
            </form>
        </>
    );
}