import { User } from "../users/type";

export interface CommentType {
    id: number,
    topic_id: number,
    author: number,
    content: string,
    likes: User[] | string | null,
    created_at: string | null,
    updated_at: string | null,
    attachment: string | null
}

export interface TopicType {
    id: number,
    title: string,
    slug: string,
    content: string,
    author: User,
    created_at: string | null,
    updated_at: string | null,
    attachment: string | null
    comments: CommentType[]
}
