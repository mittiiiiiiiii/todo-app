'use client'

import { useState } from 'react'

export default function RegistePage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // ここにdbにユーザーを保存するapi
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type='text' value={name} onChange={e => setName(e.target.value)} placeholder='名前'/>
            <input type='text' value={email} onChange={e=> setEmail(e.target.value)} placeholder='メールアドレス'/>
            <input type='text' value={password} onChange={e=> setPassword(e.target.value)} placeholder='パスワード'/>
        </form>
    );
}