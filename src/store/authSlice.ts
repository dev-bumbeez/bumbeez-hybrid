import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as SecureStore from "expo-secure-store"

interface AuthState {
    accessToken: string | null
    user: { email: string; id: string } | null
}

const initialState: AuthState = {
    accessToken: null,
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string; user: { email: string; id: string } }>,
        ) => {
            state.accessToken = action.payload.accessToken
            state.user = action.payload.user
            console.log('Auth state updated:', state)
        },
        logout: (state) => {
            state.accessToken = null
            state.user = null
        },
    },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
