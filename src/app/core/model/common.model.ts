export interface Person {
    perId: number;
    perDocument: string;
    perLastname: string;
    perName: string;
    perPhoto: string;
}
export interface UpdatePerson {
    perId: number;
    perDocument: string;
    perLastname: string;
    perName: string;
}

export interface UserData{
    user: User,
    roles: Roles[]
}

export interface User {
    useId: number,
    useMail: string,
    usePassword: string,
    person: Person
}

export interface LoginPayLoad {
    user: string,
    pwd: string
}

export interface RegisterPayLoad {
    useMail: string,
    usePassword: string,
    person: {
        perDocument: string;
        perName: string;
        perLastname: string;
    };
}

export interface chatBotPayLoad{
    pregunta: string,
    contexto: string
}

export interface Entry {
    entId: number;
    entDate: Date;
    entText: string;
    entTitle: string;
    entStatus: boolean;
}

export interface UserEntry{
    catCategorie: string[]; 
    dailyLogId: string; 
    dayLogDate: string;
    emoLogDate: string;
    emoLogId: string; 
    emoStaState: string; 
    entDate: string; 
    entId: string;
    entText: string; 
    entTitle: string;
    imgUrl: string; 
    perName: string; 
    useMail: string; 
}

export interface DailyLogCreate {
    useId: number,
    emoStaId: number,
    entText: string,
    entTitle: string
}

export interface Collaborator{
    colId: number,
    entry: Entry,
    user: User

}

export interface CategoriesEntry{
    catEntId: number,
    catEntStatus: boolean,
    category: Category,
    entry: Entry
}

export interface Category {
    catId: number,
    catCategorie: string
}

export interface DailyLog {
    dayLogId: number;
    dayLogDate: Date;
    emotionalLog: EmotionalLog;
    entry: Entry;
}

export interface updateDailyLog {
    entText: string,
    entTitle: string,
    idEmoLog: number,
    idEmoState: number
}

export interface EmotionalLog {
    emoLogId: number;
    emoLogDate: Date;
    emotionalState: EmotionalState;
    user: User;
}

export interface EmotionalState {
    emoStaId: number,
    emoStaState: string,
}

export interface googleResponse {
    clientId: string;
    client_id: string;
    credential: string;
    select_by: string;
}

export interface Roles{
    rolId: number;
}

export interface ApiResponse<T> {
    Status?: boolean;
    message?: string;
    error?: string;
    Token?: string;
    Data: T;
    NewAccessToken: string;
}