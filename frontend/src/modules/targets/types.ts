export interface UserTarget {
    id: number,
    user_id: number,
    total_time: number,
    total_exams: number | null,
    total_practices: number | null,
    total_arenas: number | null,
    min_score: number | null,
    accuracy: number | null,
    day_targets: string,
    created_at: string,
    updated_at: string
}
