import React, { useEffect, useState } from 'react'
import { View, Text, Button } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../store'
import { getRefreshToken } from '../../storage'
import { refreshToken as apiRefresh } from '../../api/auth'
import { logout } from '../../api/auth'

export default function HomeScreen() {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken)
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
            <Text>Bienvenue dans l'application !</Text>
            <Text>Refresh token: {getRefreshToken()}</Text>
            <Text>Access token: {accessToken}</Text>
            <Button title="Refresh Token" onPress={handleRefresh} />
            <Button title="Logout" onPress={async() => await logout()} />
            {message ? <Text>{message}</Text> : null}
        </View>
    )
}
