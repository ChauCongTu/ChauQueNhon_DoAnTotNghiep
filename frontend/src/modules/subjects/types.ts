import { ExamType } from "../exams/types"
import { LessonType } from "../lessons/type"
import { PracticeType } from "../practices/types"

export interface SubjectType {
    id: number,
    name: string,
    slug: string,
    icon: string,
    grade: number,
    created_at: string,
    updated_at: string
}
export interface ChapterType {
    id: number,
    name: string,
    subject_id: number,
    grade: number,
    created_at: string,
    updated_at: string,
    lessons: LessonType[],
    exams: ExamType[], 
    practices: PracticeType[]
}