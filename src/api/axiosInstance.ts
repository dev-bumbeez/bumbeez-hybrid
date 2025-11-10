import axios from 'axios'
import { store } from '../store'
import { refreshToken as apiRefresh } from './auth'
import { getRefreshToken, saveRefreshToken } from '../storage'
import { setCredentials, logout } from '../store/authSlice'
const API_URL = process.env.API_URL

const axiosInstance = axios.create({
    baseURL: API_URL || 'http://localhost:3000',
    timeout: 5000,
})

axiosInstance.interceptors.request.use((config) => {
    const state = store.getState()
    const token = state.auth.accessToken
    if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    console.log('ApiUrl:', API_URL)
    console.log('➡️ Requête :', config.method?.toUpperCase(), config.baseURL + config.url)
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refresh = await getRefreshToken()
            if (!refresh) {
                store.dispatch(logout())
                return Promise.reject(error)
            }

            try {
                const data = await apiRefresh(refresh)
                store.dispatch(
                    setCredentials({
                        accessToken: data.accessToken,
                        user: store.getState().auth.user!,
                    }),
                )
                await saveRefreshToken(data.refreshToken)

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`
                return axiosInstance(originalRequest)
            } catch (err) {
                store.dispatch(logout())
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    },
)

export default axiosInstance
