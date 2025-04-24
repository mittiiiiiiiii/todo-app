'use client'

import { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation'

export default function RegistePage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        console.log('ボタンが押されたよー');
        e.preventDefault();
        // ここにdbにユーザーを保存するapi
        try{
            const response= await axios.post('/api/register', {
                name,
                email,
                password
            });
            console.log('登録に成功しました',response.data);
            router.push('/login');
        }catch (error) {
            console.log('登録に失敗しました',error);
        }
    }

    return (
        <>
            <h1>ユーザー登録ページ</h1>
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