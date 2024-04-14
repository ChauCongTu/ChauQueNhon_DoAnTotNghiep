export interface User {
    id?: number;
    username: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    invite_code: string | null;
    avatar: string;
    gender: string | null;
    dob: string | Date | null; // Hoặc có thể sử dụng kiểu Date nếu phù hợp
    address: string | null;
    school: string | null;
    class: string | null;
    test_class: string | null;
    grade: string | null;
    lastLoginAt: string | Date; // Hoặc có thể sử dụng kiểu Date nếu phù hợp
    google_id: string | null;
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