import { MD3LightTheme as DefaultTheme } from 'react-native-paper'

// --- Constantes de Couleurs ---
const BUMBEEZ_YELLOW = '#FFC300'
const BUMBEEZ_DARK = '#1F2937'
const BUMBEEZ_WARM_BG = '#F5F5F5'
const INPUT_INACTIVE_BORDER = '#E0E0E0'

const BumbeezPaperTheme = {
    ...DefaultTheme,
    // 1. Arêtes arrondies (pour les inputs, boutons, etc.)
    roundness: 12,
    // 2. Personnalisation des couleurs
    colors: {
        ...DefaultTheme.colors,
        primary: BUMBEEZ_YELLOW,
        onPrimary: BUMBEEZ_DARK, // Texte sur le bouton jaune
        background: BUMBEEZ_WARM_BG, // Fond général
        surface: '#FFFFFF', // Fond des cartes/conteneurs flottants
        error: 'red',
        // Ajout d'une couleur personnalisée pour la bordure inactive (récupérable via useTheme().colors.bumbeezInputBorder)
        bumbeezInputBorder: INPUT_INACTIVE_BORDER,
    },
}

export default BumbeezPaperTheme
