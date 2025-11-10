import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from '../screens/auth/LoginScreen'
import HomeScreen from '../screens/auth/HomeScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken)

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {accessToken ? (
                    <Stack.Screen name="Home" component={HomeScreen} />
                ) : (
                    <Stack.Group screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </Stack.Group>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
