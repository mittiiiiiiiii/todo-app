'use client'

export default function TasksPage() {
    const handleAddTask = () => {
        console.log('タスクを追加するボタンが押されたよー');
        // ここに追加ページに移動する処理を書く
    }

    return(
        <>
            <h1>タスク一覧ページ</h1>
            <ul>
                
            </ul>
            <button type="button" onSubmit={handleAddTask}>タスクを追加</button>
        </>
    );
}