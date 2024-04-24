export interface ExamType {
    id: number,
    name: string,
    slug: string | null,
    time: number,
    questions: string,
    question_count: number,
    join_count: number,
    complete_count: number,
    subject_id: number,
    chapter_id: number | null,
    created_at: string | null,
    updated_at: string | null
}