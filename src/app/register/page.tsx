'use client'

import { useState } from 'react'

export default function RegistePage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // ここにdbにユーザーを保存するapi
    }

    return (
        <form onSubmit={handleSubmit}>

        </form>
    );
}