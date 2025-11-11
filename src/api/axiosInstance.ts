import axios from 'axios'
import { store } from '../store'
import { refreshToken as apiRefresh } from './auth'
import { getRefreshToken, saveRefreshToken } from '../storage'
import { setCredentials, logout } from '../store/authSlice'

const API_URL = process.env.API_URL

const axiosInstance = axios.create({
  baseURL: API_URL || 'http://localhost:3000',
  timeout: 10000,
})

// Variable globale pour le callback de snackbar
let showSnackbarCallback: ((message: string, type?: 'error' | 'success' | 'info') => void) | null = null

// Fonction pour enregistrer le callback depuis ton App.tsx
export const setSnackbarHandler = (callback: (message: string, type?: 'error' | 'success' | 'info') => void) => {
  showSnackbarCallback = callback
}

// Fonction utilitaire pour afficher les erreurs
const showError = (message: string) => {
  if (showSnackbarCallback) {
    showSnackbarCallback(message, 'error')
  } else {
    console.warn('⚠️ Snackbar non configuré:', message)
  }
}

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState()
  const token = state.auth.accessToken

  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  console.log('ApiUrl:', API_URL)
  console.log('➡️ Requête :', config.method?.toUpperCase(), config.baseURL + config.url)
  console.log('Requête Data:', config.data)
  console.log('Requête Headers:', config.headers)

  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse :', response.config.method?.toUpperCase(), response.config.url, response.status)
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Option pour désactiver l'alerte générique sur certaines requêtes
    const silentError = originalRequest?.silentError === true

    // Pas de réponse du serveur (problème réseau, timeout, etc.)
    if (!error.response) {
      if (!silentError) {
        if (error.code === 'ECONNABORTED') {
          showError('La requête a pris trop de temps. Vérifiez votre connexion.')
        } else {
          showError('Impossible de contacter le serveur. Vérifiez votre connexion internet.')
        }
      }
      
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // Gestion du 401 (Unauthorized) avec refresh token
    if (status === 401 && !originalRequest._retry) {
      // ✅ NE PAS intercepter les erreurs de login/register
      console.log('401 détecté, vérification de la route originale...')
      console.log('URL originale:', originalRequest.url)
      const isAuthRoute = originalRequest.url?.includes('/login') || 
                          originalRequest.url?.includes('/register') ||
                          originalRequest.url?.includes('/auth')
      
      if (isAuthRoute) {
        showError(data.message)
        console.log('Route d\'authentification détectée, ne pas intercepter.')
        return Promise.reject(error)
      } else {
        console.log('Route protégée détectée, tentative de refresh token.')
      }
      originalRequest._retry = true

      const refresh = await getRefreshToken()
      if (!refresh) {
        store.dispatch(logout())
        if (!silentError) {
          showError('Session expirée. Veuillez vous reconnecter.')
        }
        return Promise.reject(error)
      }

      try {
        const refreshData = await apiRefresh(refresh)
        store.dispatch(
          setCredentials({
            accessToken: refreshData.accessToken,
            user: store.getState().auth.user!,
          })
        )
        await saveRefreshToken(refreshData.refreshToken)

        originalRequest.headers['Authorization'] = `Bearer ${refreshData.accessToken}`
        return axiosInstance(originalRequest)
      } catch (err) {
        store.dispatch(logout())
        if (!silentError) {
          showError('Session expirée. Veuillez vous reconnecter.')
        }
        return Promise.reject(err)
      }
    }

    // Gestion des autres erreurs HTTP
    if (!silentError) {
      switch (status) {
        case 400:
          showError(data?.message || 'Les données envoyées sont incorrectes.')
          break

        case 403:
          showError('Vous n\'avez pas les permissions nécessaires.')
          break

        case 404:
          showError('L\'élément demandé n\'existe pas ou plus.')
          break

        case 409:
          showError(data?.message || 'Cette ressource existe déjà.')
          break

        case 429:
          showError('Trop de requêtes. Veuillez patienter quelques instants.')
          break

        case 500:
        case 502:
        case 503:
          showError('Erreur serveur. Veuillez réessayer plus tard.')
          break

        default:
          if (status >= 400) {
            showError(data?.message || `Une erreur est survenue (${status}).`)
          }
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance