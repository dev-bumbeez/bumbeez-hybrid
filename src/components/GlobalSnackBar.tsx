import React, { useState, useEffect, useCallback } from 'react'
import { Text } from 'react-native'
import { Snackbar } from 'react-native-paper'
import { setSnackbarHandler } from '../api/axiosInstance'

type SnackbarType = 'error' | 'success' | 'info'

interface SnackbarState {
  visible: boolean
  message: string
  type: SnackbarType
}

export const GlobalSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    type: 'info',
  })

  // Définir la fonction avec useCallback pour éviter les re-renders
  const handleShowSnackbar = useCallback((message: string, type: SnackbarType = 'info') => {
    setSnackbar({
      visible: true,
      message,
      type,
    })
  }, [])

  useEffect(() => {
    // Enregistre le callback pour l'interceptor axios
    setSnackbarHandler(handleShowSnackbar)
  }, [handleShowSnackbar])

  const onDismiss = () => {
    setSnackbar((prev) => ({ ...prev, visible: false }))
  }

  // Couleurs selon le type
  const getBackgroundColor = () => {
    switch (snackbar.type) {
      case 'error':
        return '#ef4444' // red-500
      case 'success':
        return '#22c55e' // green-500
      case 'info':
      default:
        return '#3b82f6' // blue-500
    }
  }

  return (
    <Snackbar
      visible={snackbar.visible}
      onDismiss={onDismiss}
      duration={4000}
      action={{
        label: 'OK',
        onPress: onDismiss,
        textColor: '#ffffff',
      }}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
      wrapperStyle={{ bottom: 20 }}
    >
      <Text style={{ color: '#ffffff' }}>
        {snackbar.message}
      </Text>
    </Snackbar>
  )
}