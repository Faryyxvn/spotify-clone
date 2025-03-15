export const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // In production, use relative path
  : `http://localhost:${import.meta.env.VITE_API_PORT || 5000}`; // Dev