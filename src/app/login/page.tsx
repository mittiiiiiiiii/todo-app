'use client'

import { useState } from 'react'
import axios from 'axios';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit= async(e: React.FormEvent<HTMLFormElement>) => {
        console.log('ボタンが押されたよー');
        e.preventDefault();
        // ここにログインするapi
        try{
            const response= await axios.post('/api/login', {
                email,
                password
            });
            console.log('ログインに成功しました',response.data);
        }catch (error) {
            console.log('ログインに失敗しました',error);
        }
    }

    return(
        <>
            <h1>ログインページ</h1>
            <form onSubmit={handleSubmit}>
                <input type='text' value={email} onChange={e=> setEmail(e.target.value)} placeholder='メールアドレス' required/>
                <input type='text' value={password} onChange={e=> setPassword(e.target.value)} placeholder='パスワード' required/>
                <button type='submit'>ログイン</button>
            </form>
            <p>アカウントをお持ちでない方は<a href='/register'>こちら</a></p>
        </>
    );
}