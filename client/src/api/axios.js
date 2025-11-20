import axios from 'axios';

// Configurar base URL do axios
// Em produção, o VITE_API_URL já contém o domínio completo
// As rotas já incluem /api, então não adicionamos aqui
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar token automaticamente nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Se a URL não começar com http e tiver VITE_API_URL configurado,
  // e a config.url começar com /api, construir URL completa
  if (API_URL && config.url && config.url.startsWith('/api')) {
    config.url = config.url.replace('/api', '');
    config.baseURL = API_URL + '/api';
  }
  
  return config;
});

export default api;
