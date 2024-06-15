export interface DashboardOverview {
    students: number,
    questions: number,
    exams: number,
    histories: number
}

type ForumFrequency = {
    id: number;
    name: string;
};

type User = {
    id: number;
    username: string;
    name: string;
    avatar: string;
};

export type VibrantTableType = {
    id: number;
    user_id: number;
    total_records: number;
    exam_count: string;
    arena_count: string;
    practice_count: string;
    topic_count: number;
    topic_comment_count: number;
    forum_count: number;
    user: User;
    forum_frequency: ForumFrequency;
    web_point: number;
};


type statsRegistration = {
    date: string
    count: number
}

export type RegistrationLineChartType = {
    type: string,
    stats: statsRegistration[]
}