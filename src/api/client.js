const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  async request(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const config = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const res = await fetch(url, config);

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(error.error || `Request failed: ${res.status}`);
    }

    return res.json();
  }

  get(path, query) {
    const params = query ? '?' + new URLSearchParams(query).toString() : '';
    return this.request(`${path}${params}`);
  }

  post(path, body) {
    return this.request(path, { method: 'POST', body });
  }

  patch(path, body) {
    return this.request(path, { method: 'PATCH', body });
  }

  delete(path) {
    return this.request(path, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// Convenience methods
export const briefs = {
  list: (query) => api.get('/briefs', query),
  get: (id) => api.get(`/briefs/${id}`),
  create: (data) => api.post('/briefs', data),
};

export const pipeline = {
  run: (briefId) => api.post('/pipeline/run', { briefId }),
  getRun: (id) => api.get(`/pipeline/runs/${id}`),
  listRuns: (query) => api.get('/pipeline/runs', query),
  deleteRun: (id) => api.delete(`/pipeline/runs/${id}`),
};

export const content = {
  list: (query) => api.get('/content', query),
  get: (id) => api.get(`/content/${id}`),
  search: (q) => api.get('/content/search', { q }),
};

export const compliance = {
  getSummary: () => api.get('/compliance'),
  getForOutput: (outputId) => api.get(`/compliance/${outputId}`),
  resolve: (issueId, resolution) => api.patch(`/compliance/${issueId}`, { resolution }),
};

export const localization = {
  list: () => api.get('/localization'),
  getForOutput: (outputId) => api.get(`/localization/${outputId}`),
};

export const distribution = {
  channels: () => api.get('/distribution/channels'),
  createChannel: (data) => api.post('/distribution/channels', data),
  updateChannel: (id, data) => api.patch(`/distribution/channels/${id}`, data),
  deleteChannel: (id) => api.delete(`/distribution/channels/${id}`),
  calendar: (month, year) => api.get('/distribution/calendar', { month, year }),
  schedule: (data) => api.post('/distribution/schedule', data),
  list: () => api.get('/distribution'),
};

export const analytics = {
  dashboard:  () => api.get('/analytics/dashboard'),
  engagement: () => api.get('/analytics/engagement'),
  formats:    () => api.get('/analytics/formats'),
  trend:      () => api.get('/analytics/trend'),
  channels:   () => api.get('/analytics/channels'),
};
