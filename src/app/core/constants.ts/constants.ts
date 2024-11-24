const API_URL = 'http://localhost:8080';

export const ApiEndpoint = {
    Auth: {
        Register: `${API_URL}/register`,
        Login: `${API_URL}/login`
    }
}

export const LocalStorage = {
    token: 'USER_TOKEN',
    user: 'USER'
}