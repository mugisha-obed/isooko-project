const env = import.meta.env.VITE_API_URL as string | undefined

function resolveApiBase(): string {
  if (import.meta.env.DEV) {
    return env || 'http://localhost:3001'
  }
  if (env && !/localhost|127\.0\.0\.1/.test(env)) {
    return env
  }
  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'
}

const API_BASE = resolveApiBase()

function getToken(): string | null {
  return localStorage.getItem('isooko-admin-token')
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> || {}),
  }
  if (!(options?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; username: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    verify: () =>
      request<{ valid: boolean; username?: string; role?: string }>('/api/auth/verify'),
  },
  get: <T>(path: string) => request<T[]>(path),
  getById: <T>(path: string, id: string) => request<T>(`${path}/${id}`),
  create: <T>(path: string, data: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  update: <T>(path: string, id: string, data: unknown) =>
    request<T>(`${path}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (path: string, id: string) =>
    request<{ success: boolean }>(`${path}/${id}`, { method: 'DELETE' }),
}
