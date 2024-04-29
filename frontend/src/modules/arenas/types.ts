import { QuestionType } from "../questions/types";
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
    question_list: QuestionType[] | null,
    start_at: string,
    type: string,
    password: string,
    status: string,
    created_at: string,
    updated_at: string,
    joined: {
        id: number,
        name: string,
        username: string
    }[] | null,
    is_joined: boolean
}
