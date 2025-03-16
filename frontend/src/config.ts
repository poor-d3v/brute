/**
 * Frontend configuration settings
 */

export const config = {
  // API Configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  
  // Application Settings
  maxAttempts: parseInt(import.meta.env.VITE_MAX_ATTEMPTS || '1000000'),
  updateInterval: parseInt(import.meta.env.VITE_UPDATE_INTERVAL || '1000'),
  
  // Feature Flags
  enableMnemonics: (import.meta.env.VITE_ENABLE_MNEMONICS || 'true').toLowerCase() === 'true',
  enableDebug: (import.meta.env.VITE_DEBUG || 'false').toLowerCase() === 'true',
}; 