import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TasksnewPage(){
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

        // 即時実行
        (async () => {
            await checkLogin();
        })();
    },[router]);

    return (
        <>
            <h1>タスク追加ページ</h1>
        </>
    );
}