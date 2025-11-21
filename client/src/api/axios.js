import axios from 'axios';

// URL base (SEM /api no final). Em produção defina VITE_API_URL como apenas o domínio.
const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// Remove barras finais duplicadas
const base = raw.replace(/\/+$/,'');

if (base.match(/\/api$/)) {
  // Aviso em dev: preferir definir sem /api para evitar ambiguidade
  console.warn('[axios] VITE_API_URL termina com /api. Recomenda-se remover o /api e manter chamadas com prefixo /api no código.');
}

// Instância simples; cada chamada do frontend usa caminhos começando por /api/...
const api = axios.create({ baseURL: base });

export default api;
