const API_URL = 'http://localhost:8080';

export const ApiEndpoint = {
    Auth: {
        Register: `${API_URL}/register`,
        Login: `${API_URL}/login`
    },
    DailyLog:{
        Get: `${API_URL}/daily/log`,
        GetDailyUserLog: `${API_URL}/daily/user/logs`,
    }
}

export const LocalStorage = {
    token: 'USER_TOKEN',
    user: 'USER'
}