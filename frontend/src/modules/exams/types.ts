import { DateTime } from "luxon";
import { HistoryType } from "../histories/types";
import { QuestionType } from "../questions/types";

export interface ExamType {
    id: number,
    name: string,
    slug: string | null,
    time: number,
    questions: string,
    question_list: QuestionType[] | null,
    question_count: number,
    join_count: number,
    complete_count: number,
    subject_id: number,
    chapter_id: number | null,
    created_at: string | null,
    updated_at: string | null,
    histories: HistoryType[] | null
}

export interface ExamDid {
    user_id: number;
    start_at: DateTime;
    time: number | null;
    res: {
        [key: string]: string | null;
    };
}
export interface ExamResultType {
    time: string,
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
}
