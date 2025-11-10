import axiosInstance from './axiosInstance'

export const register = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
) => {
    const res = await axiosInstance.post('/auth/register', { email, password, firstname, lastname })
    return res.data
}

export const login = async (email: string, password: string) => {
    console.log('login api called with', email, password)
    const res = await axiosInstance.post('/auth/login', { email, password })
    console.log('login api response', res.data)
    return res.data
}

export const refreshToken = async (refreshToken: string) => {
    const res = await axiosInstance.post('/auth/refresh', { refreshToken })
    return res.data
}
