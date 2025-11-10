import React, { useEffect, useState } from 'react'
import { View, Text, Button } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { logout } from '../../store/authSlice'
import { getRefreshToken } from '../../storage'
import { refreshToken as apiRefresh } from '../../api/auth'

export default function HomeScreen() {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken)
    const dispatch = useDispatch()
    const [message, setMessage] = useState('')

    const handleRefresh = async () => {
        const token = await getRefreshToken()
        if (!token) return
        const data = await apiRefresh(token)
        // Ici tu mettrais à jour le state Redux et le storage avec le nouveau token
        setMessage('Refreshed token: ' + data.accessToken)
    }

    return (
        <View style={{ padding: 20 }}>
            <Text>Access token: {accessToken}</Text>
            <Button title="Refresh Token" onPress={handleRefresh} />
            <Button title="Logout" onPress={() => dispatch(logout())} />
            {message ? <Text>{message}</Text> : null}
        </View>
    )
}
