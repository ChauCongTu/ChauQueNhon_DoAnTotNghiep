import { HistoryType } from "../histories/types";
import { QuestionType } from "../questions/types";

export interface PracticeType {
    id: number,
    name: string,
    questions: string,
    slug: string,
    subject_id: number,
    chapter_id: number,
    created_at: string,
    updated_at: string,
    question_count: number,
    question_list: QuestionType[] | null,
    histories: HistoryType[],
    join_count: number
}
