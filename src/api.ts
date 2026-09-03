const env = import.meta.env.VITE_API_URL as string | undefined

function resolveApiBase(): string {
  if (import.meta.env.DEV) {
    return env || 'http://localhost:3001'
  }
  if (env && !/localhost|127\.0\.0\.1/.test(env)) {
    return env
  }
  return ''
}

const API_BASE = resolveApiBase()

function getToken(scope: 'admin' | 'employee' = 'admin'): string | null {
  const key = scope === 'employee' ? 'isooko-employee-token' : 'isooko-admin-token'
  return localStorage.getItem(key)
}

async function request<T>(path: string, options?: RequestInit & { scope?: 'admin' | 'employee' }): Promise<T> {
  const token = getToken(options?.scope)
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
    verify: (scope: 'admin' | 'employee' = 'admin') =>
      request<{ valid: boolean; username?: string; role?: string; employeeId?: string }>('/api/auth/verify', { scope }),
    employeeLogin: (username: string, password: string) =>
      request<{ token: string; username: string; employeeId: string }>('/api/auth/login/employee', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    employeeTokenLogin: (payload: { username: string; token: string; date?: string; latitude?: string; longitude?: string; locationLabel?: string }) =>
      request<{ token: string; username: string; employeeId: string; attendance: AttendanceRecord }>('/api/auth/login/token', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
  employee: {
    me: () => request<EmployeeProfile>('/api/employees/me', { scope: 'employee' }),
    list: () => request<EmployeeRecord[]>('/api/employees'),
    get: (id: string) => request<EmployeeRecord>(`/api/employees/${id}`),
    create: (data: unknown) =>
      request<EmployeeRecord>('/api/employees', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      request<EmployeeRecord>(`/api/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/employees/${id}`, { method: 'DELETE' }),
    attendance: (id: string) => request<AttendanceRecord[]>(`/api/employees/${id}/attendance`),
    leave: (id: string) => request<LeaveRequest[]>(`/api/employees/${id}/leave`),
    markAttendance: (id: string, action: 'checkin' | 'checkout', location?: { latitude?: string; longitude?: string; locationLabel?: string }) =>
      request<AttendanceRecord>(`/api/employees/${id}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ action, ...(location || {}) }),
        scope: 'employee',
      }),
  },
  tokens: {
    list: () => request<DailyTokenRecord[]>('/api/tokens'),
    today: (date?: string) => request<DailyTokenRecord[]>(`/api/tokens/today${date ? `?date=${encodeURIComponent(date)}` : ''}`),
    create: (data: { date?: string; token?: string }) =>
      request<DailyTokenRecord>('/api/tokens', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/tokens/${id}`, { method: 'DELETE' }),
  },
  attendance: {
    list: () => request<AttendanceRecord[]>('/api/attendance'),
    me: () => request<AttendanceRecord[]>('/api/attendance/me', { scope: 'employee' }),
    create: (data: unknown) =>
      request<AttendanceRecord>('/api/attendance', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) =>
      request<AttendanceRecord>(`/api/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/api/attendance/${id}`, { method: 'DELETE' }),
  },
  leave: {
    list: () => request<LeaveRequest[]>('/api/leave'),
    me: () => request<LeaveRequest[]>('/api/leave/me', { scope: 'employee' }),
    create: (data: unknown) =>
      request<LeaveRequest>('/api/leave', { method: 'POST', body: JSON.stringify(data), scope: 'employee' }),
    setStatus: (id: string, status: 'approved' | 'rejected', adminNote?: string) =>
      request<LeaveRequest>(`/api/leave/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, adminNote }),
      }),
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

interface EmployeeRecord {
  id: string
  name: string
  role: string
  department: string
  phone: string
  email: string
  startDate: string
  salary: number
  bankName: string
  bankAccount: string
  taxId: string
  active: boolean
  username: string
  createdAt?: string
  updatedAt?: string
}

interface EmployeeProfile extends EmployeeRecord {
  attendance: AttendanceRecord[]
  leaves: LeaveRequest[]
}

interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn: string
  checkOut: string
  status: string
  latitude?: string
  longitude?: string
  locationLabel?: string
  createdAt?: string
  updatedAt?: string
}

interface DailyTokenRecord {
  id: string
  date: string
  token: string
  active: boolean
  createdAt?: string
  updatedAt?: string
}

interface LeaveRequest {
  id: string
  employeeId: string
  startDate: string
  endDate: string
  type: string
  reason: string
  status: string
  adminNote?: string
  createdAt?: string
  updatedAt?: string
}
