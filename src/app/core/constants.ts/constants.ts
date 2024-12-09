const API_URL = 'http://localhost:8080';

export const ApiEndpoint = {
    Auth: {
        Register: `${API_URL}/register`,
        Login: `${API_URL}/login`,
        Refresh: `${API_URL}/refresh`,
        Google: `${API_URL}/oauth/google`
    },
    DailyLog:{
        //Get: `${API_URL}/daily/log`,
        GetDailyUserLog: `${API_URL}/daily/user/logs`,
        Create: `${API_URL}/daily/log/allinfo`,
        GetById:`${API_URL}/daily/log/show`,

    },
    EmotionalState:{
        getAll: `${API_URL}/emotional/states`,
    },
    Entry:{
        Delete:`${API_URL}/entry`
    }

}

export const LocalStorage = {
    token: 'USER_TOKEN',
    user: 'USER'
}