export type Tasks = {
    id: number;
    title: string;
    status: 'not_started' | 'in_progress' | 'completed';
    dueDate?: string;
    description?: string;
    userId?: number;
};