export interface User{
    useId: number,
    useMail: string,
    usePassword: string,
    person: {
        perId: number;
        perDocument: string;
        perName: string;
        perLastname: string;
        perPhoto?: string;
      };
}

export interface LoginPayLoad{
    user: string,
    pwd: string
}

export interface RegisterPayLoad{
    useMail: string,
    usePassword: string,
    person: {
        perDocument: string;
        perName: string;
        perLastname: string;
        perPhoto?: string;
      };
}

export interface ApiResponse<T>{
    Status?: boolean;
    message?: string;
    error?: string;
    Token?: string;
    Data: T;
}