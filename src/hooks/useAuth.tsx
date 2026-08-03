import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api } from '../api'

interface AuthState {
  token: string | null
  username: string | null
  loading: boolean
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: localStorage.getItem('isooko-admin-token'),
    username: localStorage.getItem('isooko-admin-username'),
    loading: true,
  })

  useEffect(() => {
    const token = localStorage.getItem('isooko-admin-token')
    if (!token) {
      setState(s => ({ ...s, loading: false }))
      return
    }
    api.auth.verify()
      .then(res => {
        if (!res.valid) {
          localStorage.removeItem('isooko-admin-token')
          localStorage.removeItem('isooko-admin-username')
          setState({ token: null, username: null, loading: false })
        } else {
          setState({ token, username: res.username || null, loading: false })
        }
      })
      .catch(() => {
        setState(s => ({ ...s, loading: false }))
      })
  }, [])

  const login = async (username: string, password: string) => {
    const res = await api.auth.login(username, password)
    localStorage.setItem('isooko-admin-token', res.token)
    localStorage.setItem('isooko-admin-username', res.username)
    setState({ token: res.token, username: res.username, loading: false })
  }

  const logout = () => {
    localStorage.removeItem('isooko-admin-token')
    localStorage.removeItem('isooko-admin-username')
    setState({ token: null, username: null, loading: false })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
