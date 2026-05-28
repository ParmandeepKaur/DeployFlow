const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Perform an HTTP request to the DeployFlow API
 * @param {string} endpoint - The API endpoint (e.g. '/projects')
 * @param {object} [options] - Standard fetch options
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // If backend reports DB connection or offline issue, bubble up special errors
    if (
      response.status === 500 || 
      (data.error && typeof data.error === 'string' && data.error.toLowerCase().includes('database')) ||
      (data.message && typeof data.message === 'string' && data.message.toLowerCase().includes('database'))
    ) {
      throw new Error('Database offline');
    }
    
    throw {
      status: response.status,
      message: data.message || data.error || 'Request failed',
    };
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
