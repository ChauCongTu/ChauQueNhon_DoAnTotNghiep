export interface User {
    id?: number;
    username: string | null;
    name: string | null;
    email: string | null;
    password: string;
    phone: string | null;
    invite_code: string | null;
    avatar: string;
    gender: string | null;
    dob: string | Date | null;
    address: string | null;
    school: string | null;
    class: string | null;
    test_class: string | null;
    grade: string | null;
    lastLoginAt: string | Date;
    google_id: string | null;
    role: string[];
}



export interface LoginRequest {
    email: string,
    password: string
}

export interface RegisterRequest {
    email: string,
    password: string,
    username: string,
    name: string
}