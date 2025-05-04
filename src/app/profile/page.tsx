'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios'

export default function ProfilePage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

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

        const fetchUser = async (userId: number) => {
            try{
                const res = await axios.get('/api/profile', {params: { userId } });
                console.log("ユーザーの取得に成功", res.data);

                // 値をセット
                const user = res.data.user[0];
                if (user) {
                    setName(user.name||'');
                    setEmail(user.email||'');
                    setPassword(user.password||'');
                }
            }catch(error){
                console.log('ユーザー情報の取得に失敗しました',error);
            }
        }
       
        (async () => {
            const user = await checkLogin();
            await fetchUser(user.id);
        })();
    },[router]);

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        console.log('ボタンが押されたよー');
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user')||'{}');
        try{
            const response= await axios.post('/api/profile', {
                userId: user.id,
                name,
                email,
                password
            });
            console.log('編集に成功しました',response.data);
            router.push('/tasks');
        }catch (error) {
            console.log('編集に失敗しました',error);
        }
    }

    return(
        <>
            <h1>プロフィール編集</h1>
            <form onSubmit={handleSubmit}>
                <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='名前' required/>
                <input type='text' value={email} onChange={e=> setEmail(e.target.value)} placeholder='メールアドレス' required/>
                <input type='text' value={password} onChange={e=> setPassword(e.target.value)} placeholder='パスワード' required/>
                <button type='submit'>登録</button>
            </form>
            <p>ログインページは<a href='/login'>こちら</a></p>
        </>
    );
}