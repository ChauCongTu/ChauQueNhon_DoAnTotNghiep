import { ChapterType, SubjectType } from "../subjects/types"

export interface LessonType {
    id: number,
    name: string,
    slug: string,
    chap_id: number,
    content: string,
    view_count: number,
    type: string,
    likes: string,
    chapter: ChapterType | null,
    subject: SubjectType | null,
    liked_list: {
        name: string,
        username: string
    }[] | null,
    preview: LessonType | null,
    next: LessonType | null,
    created_at: string,
    updated_at: string
}