import { User } from "../users/type";

export interface ArenaType {
    id: number,
    name: string,
    grade: number,
    author: User,
    users: number,
    max_users: number,
    time: number,
    questions: string,
    question_count: number,
    start_at: string,
    type: string,
    password: string,
    status: string,
    created_at: string,
    updated_at: string,
    is_joined: boolean
}
