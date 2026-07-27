import axios from 'axios'

// Change this if your backend runs on a different host/port,
// or set VITE_API_URL in a .env file at the project root.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export default api
