import React from 'react'
import { Provider } from 'react-redux'
import { store } from './src/store'
import AppNavigator from './src/navigation/AppNavigator'
import './src/i18n/i18n'
import { PaperProvider } from 'react-native-paper'
import { GlobalSnackbar } from './src/components/GlobalSnackBar'
import BumbeezPaperTheme from './src/themes/paperTheme'

export default function App() {
    return (
        <Provider store={store}>
            <PaperProvider theme={BumbeezPaperTheme}>
                <AppNavigator />
                <GlobalSnackbar />
            </PaperProvider>
        </Provider>
    )
}
