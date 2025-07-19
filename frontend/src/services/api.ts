// Configuração centralizada da API
const API_BASE_URL = import.meta.env.PROD 
  ? '' // Mesmo domínio em produção
  : 'http://localhost:5000';

// Configuração da API
export const api = {
  // Função helper para fazer requests
  async request(endpoint: string, options: RequestInit = {}) {
    // Remove qualquer URL absoluta e usa relativa
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  },

  // Métodos HTTP
  get: (endpoint: string) => api.request(endpoint),
  post: (endpoint: string, data: any) => api.request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  put: (endpoint: string, data: any) => api.request(endpoint, {
    method: 'PUT', 
    body: JSON.stringify(data),
  }),
  delete: (endpoint: string) => api.request(endpoint, {
    method: 'DELETE',
  }),
};
