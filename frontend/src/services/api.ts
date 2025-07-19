// Configuração centralizada da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                    (typeof window !== 'undefined' && (window as any).ENV?.REACT_APP_API_URL) ||
                    (import.meta.env.DEV ? '' : 'http://localhost:5000'); // Usar proxy em dev

// Configuração da API
export const api = {
  baseURL: API_BASE_URL,
  
  // Headers padrão
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  // Função helper para fazer requests
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  },

  // Métodos HTTP
  get: (endpoint: string, options?: RequestInit) => 
    api.request(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: RequestInit) => 
    api.request(endpoint, { 
      ...options, 
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined 
    }),
    
  put: (endpoint: string, data?: any, options?: RequestInit) => 
    api.request(endpoint, { 
      ...options, 
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined 
    }),
    
  delete: (endpoint: string, options?: RequestInit) => 
    api.request(endpoint, { ...options, method: 'DELETE' }),
};

// Debug info
const isDevelopment = import.meta.env.DEV || 
                     (typeof window !== 'undefined' && window.location.hostname === 'localhost');

if (isDevelopment) {
  console.log('🌐 API Base URL:', API_BASE_URL);
  console.log('🔧 Environment:', import.meta.env.VITE_ENVIRONMENT || 'development');
}

export default api;
