import * as SecureStore from 'expo-secure-store'
import { useDispatch } from 'react-redux'
import { store } from '../store'
import { logout as logoutStore, setCredentials } from '../store/authSlice'
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
    const res = await axiosInstance.post('/auth/login', { email, password })
    const { accessToken, refreshToken, user } = res.data
    store.dispatch(setCredentials({ accessToken, user }))
    await SecureStore.setItemAsync('refreshToken', refreshToken)
    return res.data
}

export const refreshToken = async (refreshToken: string) => {
    const res = await axiosInstance.post('/auth/refresh', { refreshToken })
    const { accessToken, refreshToken: newRefreshToken, user } = res.data
    store.dispatch(setCredentials({ accessToken, user }))
    await SecureStore.setItemAsync('refreshToken', newRefreshToken)
    return res.data
}

export const logout = async () => {
    await SecureStore.deleteItemAsync('refreshToken')
    await axiosInstance.post('/auth/logout')
    store.dispatch(logoutStore())
}
