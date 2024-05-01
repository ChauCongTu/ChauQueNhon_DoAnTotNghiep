import { DateTime } from "luxon";
import { QuestionType } from "../questions/types";
import { SubjectType } from "../subjects/types";
import { User } from "../users/type";

export interface ArenaType {
    id?: number,
    name: string,
    grade: number | null,
    author: User,
    subject: SubjectType | null,
    subject_id: number | null,
    users: number,
    max_users: number,
    time: number,
    questions: string,
    question_count: number,
    question_list?: QuestionType[] | null,
    start_at: string,
    type: string,
    password: string | null,
    status: string,
    created_at: string,
    updated_at: string,
    joined: {
        id?: number,
        name: string,
        username: string,
        avatar: string
    }[] | null,
    is_joined: boolean
}
export interface ArenaDid {
    user_id?: number | null;
    start_at: DateTime;
    time: number | null;
    cheat: number;
    status: number,
    res: {
        [key: string]: string | null;
    };
}