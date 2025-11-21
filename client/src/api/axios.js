import axios from 'axios';

// Base configurada pelo ambiente
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Se o usuário configurou a variável já com /api, removemos para evitar duplicação
const baseURL = rawBase.endsWith('/api') ? rawBase.replace(/\/api$/, '') : rawBase;

const api = axios.create({ baseURL });

// Interceptor para evitar /api/api/... quando base já inclui /api
api.interceptors.request.use((config) => {
  // Se a base termina em /api e a URL começa com /api/, removemos o primeiro /api
  if (rawBase.endsWith('/api') && config.url.startsWith('/api/')) {
    config.url = config.url.replace(/^\/api\//, '/');
  }
  return config;
});

export default api;
