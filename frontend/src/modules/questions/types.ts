export interface QuestionType {
    id: number,
    question: string,
    answer_1: string,
    answer_2: string,
    answer_3: string,
    answer_4: string,
    answer_correct: number,
    answer_detail: string,
    subject_id: number | null,
    chapter_id: number | null,
    level: number,
    created_at: string,
    updated_at: string
}
