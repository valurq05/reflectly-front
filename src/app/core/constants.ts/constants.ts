import { Collaborator } from '../model/common.model';
const API_URL = 'http://localhost:8080';

export const ApiEndpoint = {
    Auth: {
        Register: `${API_URL}/register`,
        Login: `${API_URL}/login`,
        Refresh: `${API_URL}/refresh`,
        UserExist: `${API_URL}/user/exist`
    },
    DailyLog:{
        //Get: `${API_URL}/daily/log`,
        GetDailyUserLog: `${API_URL}/daily/user/logs`,
        Create: `${API_URL}/daily/log/allinfo`,
        GetById:`${API_URL}/daily/log/show`,
        Update:`${API_URL}/daily/log`,
    },
    EmotionalState:{
        getAll: `${API_URL}/emotional/states`,
    },
    categories:{
        getAll: `${API_URL}/categories`,
    },
    image:{
        updateUserPhoto:`${API_URL}/user/profile/img`,
        showImage:`${API_URL}/images/{filename}`,
        defaultImage:`${API_URL}/images/GdXyg8gWgAAQmW1.jpg`,
        changeDefaultImage:`${API_URL}/user/profile/img`,
    },
    Entry:{
        Delete:`${API_URL}/entry`,
        Update:`${API_URL}/entry`,
    },
    Person:{
        Update:`${API_URL}/person`
        
    },
    EmotionalLog:{
        Update:`${API_URL}/Emotional/Log`,
    },
    User:{
        GetAll:`${API_URL}/users`,
    },
    Collaborator:{
        Create:`${API_URL}/collaborator`,
        GetAllCollaboratorsByEntry:`${API_URL}/collaborator/entry`,
    },
    CategoriesEntry:{
        Create:`${API_URL}/Categories/entry`,
        GetAllCategoriesEntry:`${API_URL}/Categories/by/entry`,
        Delete:`${API_URL}/Categories/entry`,
    },
}

export const LocalStorage = {
    token: 'USER_TOKEN',
    user: 'USER',
    rol: 'ROL',
}