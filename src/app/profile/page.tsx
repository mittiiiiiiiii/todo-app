'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'

export default function ProfilePage() {
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
       
        (async () => {
            await checkLogin();
        })();
    },[router]);

    return(
        <>
            <h1>プロフィール編集</h1>
        </>
    );
}