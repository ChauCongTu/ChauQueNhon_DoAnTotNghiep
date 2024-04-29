import { User } from "../users/type"

export interface HistoryType {
    id: number | null,
    user_id: number,
    user: User,
    model: []|any,
    foreign_id: number,
    result: {
        time: number,
        assignment: {
            [key: string]: {
                question: string,
                your_answer: string,
                correct_answer: number,
                score: number
            }
        },
        correct_count: number,
        total_score: number,
        late: number
    },
    type: string,
    note: string,
    created_at: string | null,
    updated_at: string | null
}
