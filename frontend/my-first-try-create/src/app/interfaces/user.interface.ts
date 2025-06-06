export interface User {
    id?: string;
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'doctor' | 'staff';
    createdAt?: Date;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: 'doctor' | 'staff';  // Admin role can't be self-registered
}